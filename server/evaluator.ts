import { GoogleGenAI, Type } from '@google/genai';
import { TurnEvaluation } from '../src/types';

interface EvaluateTurnInput {
  topicId: string;
  learnerInput: string;
  completedLinks: string[];
  isTransfer?: boolean;
}

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

export async function evaluateTurn(input: EvaluateTurnInput): Promise<TurnEvaluation> {
  const { learnerInput, completedLinks, isTransfer } = input;
  const trimmed = (learnerInput || '').trim();

  // Rule 1: Empty or extremely low effort
  if (!trimmed || trimmed.split(/\s+/).length < 2) {
    return {
      status: 'empty_or_gibberish',
      identifiedLinks: completedLinks,
      missingLinks: ['heat_trigger', 'sweat_layer', 'phase_change', 'heat_removal'].filter(
        id => !completedLinks.includes(id)
      ),
      feedbackSpeech: "I didn't quite catch that. Take a breath and tell me what you think happens to the sweat on your skin!",
      socraticScaffold: 'What physical changes happen to water drops on your skin when you feel the breeze?',
      encouragement: "No rush! Every scientist starts with an observation.",
      isComplete: false,
      icapLevel: 'Passive'
    };
  }

  // If Gemini API is configured, use it for rich pedagogical assessment grounded in ICAP
  const client = getAiClient();
  if (client) {
    try {
      const prompt = `You are Dr. Ada, an expert Socratic science educator specializing in middle-school cognitive learning.
Your pedagogical goal is grounded in Chi & Wylie's (2014) ICAP Framework: guide the student from Passive to Constructive self-explanation of causal mechanisms.

Current Topic: ${isTransfer ? 'Canine Panting & Evaporative Cooling (Far-Transfer)' : 'Evaporative Cooling: Why Sweating Cools Us Down'}
Already identified links by learner: ${JSON.stringify(completedLinks)}

The target 4-step causal chain is:
1. 'heat_trigger': Body heats up during exertion/hot weather -> sweat glands release water.
2. 'sweat_layer': Liquid sweat coats the skin surface.
3. 'phase_change': Liquid sweat water absorbs thermal energy and evaporates into gas/vapor.
4. 'heat_removal': Because highest kinetic energy molecules evaporate into vapor, thermal heat is carried away, reducing average skin temperature.

Learner's current response: "${trimmed}"

Evaluate the response:
1. Is it off-task (e.g. video games, unrelated casual banter, food, gibberish)?
2. Does it express a common misconception (e.g. sweat is naturally ice-cold fluid inside veins, or pores open like doors to let wind in)?
3. Which of the 4 causal links are genuinely explained or articulated by the learner? (Include previously completed ones if still relevant, plus new ones).
4. Provide 'feedbackSpeech': 2 to 3 concise, encouraging sentences suitable for text-to-speech aloud. Praise whatever causal link was accurate, then ask a targeted Socratic guiding question for the next missing link. Never give the direct answer away; prompt them to explain the mechanism.
5. Provide 'socraticScaffold': The focused guiding question.
6. Provide 'icapLevel': 'Passive' (off-task/echo), 'Active' (repeats buzzwords without causal link), 'Constructive' (articulates mechanism), or 'Interactive' (responds directly to prior tutor prompt).`;

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: {
                type: Type.STRING,
                description: "One of: 'off_task', 'empty_or_gibberish', 'misconception', 'partial_progress', 'complete_mastery'"
              },
              detectedMisconception: {
                type: Type.STRING,
                description: "Description of misconception if detected, else empty string"
              },
              identifiedLinks: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array of causal link ids articulated: 'heat_trigger', 'sweat_layer', 'phase_change', 'heat_removal'"
              },
              missingLinks: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array of causal link ids still missing"
              },
              feedbackSpeech: {
                type: Type.STRING,
                description: "Conversational spoken feedback for TTS (under 60 words)"
              },
              socraticScaffold: {
                type: Type.STRING,
                description: "Targeted question guiding the next step"
              },
              encouragement: {
                type: Type.STRING,
                description: "Brief sentence affirming their effort"
              },
              isComplete: {
                type: Type.BOOLEAN,
                description: "True if phase_change and heat_removal are both understood"
              },
              icapLevel: {
                type: Type.STRING,
                description: "Passive, Active, Constructive, or Interactive"
              }
            },
            required: ['status', 'identifiedLinks', 'missingLinks', 'feedbackSpeech', 'socraticScaffold', 'encouragement', 'isComplete', 'icapLevel']
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim()) as TurnEvaluation;
        return parsed;
      }
    } catch (err) {
      console.warn('Gemini API call failed or timed out, falling back to deterministic heuristic evaluator:', err);
    }
  }

  // Deterministic Fallback Evaluator (100% offline & keyless reliability)
  return evaluateWithHeuristics(trimmed, completedLinks, isTransfer);
}

function evaluateWithHeuristics(
  text: string,
  existingLinks: string[],
  isTransfer?: boolean
): TurnEvaluation {
  const lower = text.toLowerCase();

  // Check off-task
  const offTaskWords = ['minecraft', 'fortnite', 'roblox', 'tiktok', 'youtube', 'pizza', 'burger', 'weather', 'joke', 'movie', 'game', 'play soccer'];
  const mentionsScience = ['sweat', 'heat', 'warm', 'hot', 'cool', 'water', 'evaporat', 'skin', 'liquid', 'gas', 'vapor', 'body', 'temp', 'pant', 'tongue', 'dog'];
  const hasScienceContext = mentionsScience.some(w => lower.includes(w));

  if (!hasScienceContext && offTaskWords.some(w => lower.includes(w))) {
    return {
      status: 'off_task',
      identifiedLinks: existingLinks,
      missingLinks: ['heat_trigger', 'sweat_layer', 'phase_change', 'heat_removal'].filter(id => !existingLinks.includes(id)),
      feedbackSpeech: "That sounds fun, but let's stay focused on our science experiment! How do those water drops on your skin help lower your body heat?",
      socraticScaffold: "Think about what happens when you step out of a warm shower or pool into the air. What does the water do?",
      encouragement: "Let's crack the mystery of sweat together!",
      isComplete: false,
      icapLevel: 'Passive'
    };
  }

  // Check misconceptions
  if (lower.includes('cold water inside') || lower.includes('ice') || lower.includes('refrigerator') || lower.includes('veins are cold') || lower.includes('sweat is cold inside')) {
    return {
      status: 'misconception',
      detectedMisconception: 'Believing sweat comes out as an already-cold liquid from internal storage.',
      identifiedLinks: existingLinks,
      missingLinks: ['phase_change', 'heat_removal'],
      feedbackSpeech: "Interesting thought! But remember, our internal body temperature is about thirty-seven degrees Celsius, so sweat actually starts out warm. Where does the cooling effect happen after it reaches the surface?",
      socraticScaffold: "Once that warm moisture is resting on your skin, what happens to it when exposed to the air?",
      encouragement: "Great scientists test their assumptions all the time!",
      isComplete: false,
      icapLevel: 'Active'
    };
  }

  if (lower.includes('pores let air in') || lower.includes('wind blows into') || lower.includes('holes open') || lower.includes('breeze enters skin')) {
    return {
      status: 'misconception',
      detectedMisconception: 'Believing skin pores function as open vents that admit outside air.',
      identifiedLinks: existingLinks,
      missingLinks: ['phase_change', 'heat_removal'],
      feedbackSpeech: "Our skin pores actually only release sweat droplets outward—they don't act like air vents. Instead, look closely at the puddle of sweat on your skin. What physical process happens to that water?",
      socraticScaffold: "When liquid water on a warm surface disappears over time, what state of matter is it turning into?",
      encouragement: "You're thinking about airflow, which is definitely part of the puzzle!",
      isComplete: false,
      icapLevel: 'Active'
    };
  }

  // Detect causal links
  const links = new Set<string>(existingLinks);

  // Link 1: Thermal Trigger
  if (lower.includes('hot') || lower.includes('heat') || lower.includes('warm') || lower.includes('run') || lower.includes('exercise') || lower.includes('temperature rise') || lower.includes('sweat gland')) {
    links.add('heat_trigger');
  }

  // Link 2: Liquid Layer
  if (lower.includes('water') || lower.includes('sweat') || lower.includes('moisture') || lower.includes('droplet') || lower.includes('wet') || lower.includes('skin surface')) {
    links.add('sweat_layer');
  }

  // Link 3: Phase Change / Evaporation (Crucial Constructive Concept)
  if (lower.includes('evaporat') || lower.includes('vapor') || lower.includes('gas') || lower.includes('dries up') || lower.includes('steam') || lower.includes('phase change') || lower.includes('liquid to gas') || lower.includes('disappears into air')) {
    links.add('phase_change');
  }

  // Link 4: Heat Energy Transfer / Removal
  if (lower.includes('absorb') || lower.includes('takes heat') || lower.includes('carries heat') || lower.includes('cools') || lower.includes('lower') || lower.includes('thermal energy') || lower.includes('takes energy') || lower.includes('drops temperature') || lower.includes('leaves skin cooler')) {
    links.add('heat_removal');
  }

  const identifiedLinks = Array.from(links);
  const allRequired = ['heat_trigger', 'sweat_layer', 'phase_change', 'heat_removal'];
  const missingLinks = allRequired.filter(id => !identifiedLinks.includes(id));

  // Determine completion
  const hasPhaseChange = identifiedLinks.includes('phase_change');
  const hasHeatRemoval = identifiedLinks.includes('heat_removal');
  const isComplete = hasPhaseChange && hasHeatRemoval;

  if (isComplete) {
    return {
      status: 'complete_mastery',
      identifiedLinks,
      missingLinks: [],
      feedbackSpeech: isTransfer
        ? "Brilliant! You applied the exact same principle: moisture from the dog's tongue evaporates into the air, drawing thermal heat away from blood vessels in the mouth. Outstanding scientific reasoning!"
        : "Spot on! That is the core of evaporative cooling: as the liquid sweat absorbs thermal energy from your skin, the fastest water molecules evaporate into gas, taking that heat energy right with them. You explained the full causal mechanism!",
      socraticScaffold: isTransfer
        ? "You've successfully solved both challenges! Ready to test another science phenomenon or review your learning summary?"
        : "You've mastered this! Can you now predict why dogs pant with their wet tongue out instead of sweating all over their fur?",
      encouragement: "Outstanding explanation! You connected the molecular phase change directly to temperature drop.",
      isComplete: true,
      icapLevel: 'Constructive'
    };
  }

  // Partial progress feedback
  if (hasPhaseChange && !hasHeatRemoval) {
    return {
      status: 'partial_progress',
      identifiedLinks,
      missingLinks: ['heat_removal'],
      feedbackSpeech: "Excellent! You spotted that the sweat evaporates from liquid into vapor. Now, connect that back to your body: when those energetic water molecules lift off into the air, what happens to the heat on your skin?",
      socraticScaffold: "Where does the energy needed for evaporation come from, and what happens to your skin's temperature as a result?",
      encouragement: "You're so close! You have the phase change, now link it to thermal transfer.",
      isComplete: false,
      icapLevel: 'Constructive'
    };
  }

  if (!hasPhaseChange && (identifiedLinks.includes('heat_trigger') || identifiedLinks.includes('sweat_layer'))) {
    return {
      status: 'partial_progress',
      identifiedLinks,
      missingLinks: ['phase_change', 'heat_removal'],
      feedbackSpeech: "Good observation! Your body gets hot and produces a layer of water on your skin. But how does that wet layer actually pull temperature down? What happens to the water as the breeze passes over it?",
      socraticScaffold: "Think about the state of matter of the sweat. Does it stay a liquid on your skin forever, or does it change?",
      encouragement: "Great start! You've identified the trigger and the water layer.",
      isComplete: false,
      icapLevel: 'Active'
    };
  }

  return {
    status: 'partial_progress',
    identifiedLinks,
    missingLinks,
    feedbackSpeech: "You're touching on how our body responds to heat! Can you explain step-by-step: once that sweat is on your skin, what happens to the water droplets, and how does that make you feel cooler?",
    socraticScaffold: "What physical change happens to water drops when heat is applied to them?",
    encouragement: "Keep going! Walk me through the step-by-step physical process.",
    isComplete: false,
    icapLevel: 'Active'
  };
}
