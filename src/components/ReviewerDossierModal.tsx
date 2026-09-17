import React, { useState } from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  Cpu,
  ShieldAlert,
  HelpCircle,
  PlayCircle,
  ExternalLink,
  DollarSign,
  Video,
  Sparkles
} from 'lucide-react';

interface ReviewerDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySampleInput: (text: string) => void;
}

export const ReviewerDossierModal: React.FC<ReviewerDossierModalProps> = ({
  isOpen,
  onClose,
  onApplySampleInput
}) => {
  const [activeTab, setActiveTab] = useState<'walkthrough' | 'research' | 'ai_note' | 'limits' | 'candidate'>('walkthrough');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="reviewer-dossier-modal"
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">
                  Reviewer Dossier & 5-Minute Evaluation Guide
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full">
                  Task 2 Complete
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Socratic Science Tutor • Grounded in Chi & Wylie (2014) ICAP Framework
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close dossier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/40 px-6 gap-2 overflow-x-auto text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('walkthrough')}
            className={`py-3 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'walkthrough'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5" />
            1. 5-Min Walkthrough & Test Inputs
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('research')}
            className={`py-3 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'research'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            2. Research Fit & Falsification
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ai_note')}
            className={`py-3 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'ai_note'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            3. AI Usage & Tech Note (Section 5)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('limits')}
            className={`py-3 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'limits'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            4. Sensible Limits & Classroom Reality
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('candidate')}
            className={`py-3 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'candidate'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            5. Interview Deliverables & Salary
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm leading-relaxed">
          {/* TAB 1: 5-Minute Walkthrough */}
          {activeTab === 'walkthrough' && (
            <div className="space-y-5">
              <div className="p-4 bg-blue-50/70 dark:bg-blue-950/30 rounded-2xl border border-blue-200/60 dark:border-blue-800/40">
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-1 flex items-center gap-1.5">
                  <PlayCircle className="w-4 h-4" />
                  How to Complete One Full 5-Minute Interaction Turn
                </h3>
                <p className="text-xs text-blue-800/80 dark:text-blue-300">
                  You can complete a full pedagogical loop in under 3 minutes either via speech (microphone) or typed input.
                  Below are 4 pre-configured test scenarios to verify how the tutor handles misconceptions, partial reasoning, full mastery, and off-task boundaries.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">
                  Click to Auto-Test Sample Learner Inputs (Closes modal and fills input):
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Test 1: Misconception */}
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 hover:border-blue-400 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                          Scenario A: Common Misconception
                        </span>
                        <span className="text-[10px] bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded">
                          Mental Model Gap
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 italic mb-2">
                        "Sweat is naturally cold liquid that pours from our veins like refrigerator water to chill our skin."
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Expected: Tutor detects that internal body temp is 37°C, refutes the misconception without shaming, and prompts for where the cooling actually happens.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onApplySampleInput("Sweat is naturally cold liquid that pours from our veins like refrigerator water to chill our skin.");
                        onClose();
                      }}
                      className="mt-3 w-full py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <PlayCircle className="w-3.5 h-3.5" /> Test Misconception
                    </button>
                  </div>

                  {/* Test 2: Partial Progress */}
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 hover:border-blue-400 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          Scenario B: Partial Progress (Active)
                        </span>
                        <span className="text-[10px] bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded">
                          Missing Phase Change
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 italic mb-2">
                        "When we run, our body heats up and sweat glands release water onto our skin."
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Expected: Tutor acknowledges Steps 1 & 2, then uses a Socratic scaffold to prompt: "What physical process happens to that puddle of water as air hits it?"
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onApplySampleInput("When we run, our body heats up and sweat glands release water onto our skin.");
                        onClose();
                      }}
                      className="mt-3 w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <PlayCircle className="w-3.5 h-3.5" /> Test Partial Progress
                    </button>
                  </div>

                  {/* Test 3: Complete Mastery */}
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 hover:border-blue-400 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          Scenario C: Full Causal Mastery
                        </span>
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                          Constructive
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 italic mb-2">
                        "The liquid sweat on our skin absorbs thermal heat from our body, causing water molecules to evaporate into gas, taking that heat energy away and cooling us down."
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Expected: All 4 causal links satisfied! Celebratory avatar state triggered, spoken praise aloud, and unlock of Far-Transfer Dog Panting challenge.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onApplySampleInput("The liquid sweat on our skin absorbs thermal heat from our body, causing water molecules to evaporate into gas, taking that heat energy away and cooling us down.");
                        onClose();
                      }}
                      className="mt-3 w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <PlayCircle className="w-3.5 h-3.5" /> Test Full Mastery
                    </button>
                  </div>

                  {/* Test 4: Off-Task Boundary */}
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 hover:border-blue-400 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                          Scenario D: Off-Task Boundary Check
                        </span>
                        <span className="text-[10px] bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 px-1.5 py-0.5 rounded">
                          Guardrail
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 italic mb-2">
                        "I really like building diamond castles and playing Minecraft with my friends after school."
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Expected: App does not hallucinate or act as an unconstrained chatbot; it acknowledges politely and steers the student right back to the soccer field sprint.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onApplySampleInput("I really like building diamond castles and playing Minecraft with my friends after school.");
                        onClose();
                      }}
                      className="mt-3 w-full py-1.5 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <PlayCircle className="w-3.5 h-3.5" /> Test Off-Task Boundary
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Research Fit & Falsification */}
          {activeTab === 'research' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-100 dark:bg-slate-800/60 rounded-2xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  1. Named Published Learning Research Source
                </h3>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  Chi, M. T. H., & Wylie, R. (2014). The ICAP Framework: Linking Cognitive Engagement to Active Learning Outcomes. <em>Educational Psychologist</em>, 49(4), 219–243.
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Synthesized with the foundational Self-Explanation Effect (Chi, De Leeuw, Chiu, & LaVancher, 1994, <em>Cognitive Science</em>).
                </p>
              </div>

              <div className="border-l-4 border-blue-600 pl-4 py-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                  2. One-Line Mapping to What the App Does
                </h3>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  "The application transitions learners from passive listening into <strong>Constructive self-explanation</strong> by prompting them to articulate the unseen physical mechanism (phase change heat transfer) rather than reciting keywords, evaluating missing causal links in real time, and delivering targeted Socratic scaffolds instead of answers."
                </p>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200/60 dark:border-amber-800/40">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-1">
                  3. Falsification Criterion (What would count as the idea failing?)
                </h3>
                <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                  "In a randomized controlled trial (A/B testing this tool vs. an identical visual interface presenting direct didactic video/text explanations), the idea would fail if:
                  <br />
                  <strong>1)</strong> Learners completing the Socratic constructive self-explanation condition show no statistically significant advantage over direct didactic explanation on an unassisted <em>far-transfer assessment</em> (e.g., explaining why dogs pant, or why rubbing alcohol feels cold).
                  <br />
                  <strong>2)</strong> Learners achieve passing scores by merely parrot-repeating isolated vocabulary terms ('evaporation', 'sweat') without demonstrating causal link coherence in their mental model."
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: AI Usage Technical Note (Section 5) */}
          {activeTab === 'ai_note' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  One-Page Technical Note (Task 2, Section 5)
                </h3>

                <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">Research Source:</strong> Chi & Wylie (2014) ICAP Framework (Passive vs. Active vs. Constructive vs. Interactive cognitive processing).
                  </div>

                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">What Was Built:</strong> A full-stack TypeScript application with Express server-side evaluation, React 19 client, browser Web Speech API for voice recognition, SpeechSynthesis for expressive verbal replies, an SVG stateful tutor avatar with synchronized mouth animations, and a real-time Causal Mechanism Tracker.
                  </div>

                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">What the Model Drafted:</strong> The AI model drafted the initial causal chain parsing heuristic, the structured JSON schema for Gemini 3.8 Flash evaluation, and the reactive SVG expressions for Dr. Ada's avatar.
                  </div>

                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">One Suggestion Rejected & Why:</strong>
                    <div className="mt-1 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/40 rounded-lg text-rose-900 dark:text-rose-200">
                      <strong>Rejected:</strong> An unconstrained, open-ended generative chat agent with general conversational memory.
                      <br />
                      <strong>Why:</strong> Unbounded chat violates Sweller's Cognitive Load Theory and fails pedagogical goals. Learners wander off-topic, and the LLM frequently leaks direct answers rather than scaffolding self-explanation. Instead, we architected a strict state machine with an explicit 4-node causal chain and bounded Socratic prompt limits.
                    </div>
                  </div>

                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">One Next Step:</strong> Implement classroom group analytics aggregating common cohort misconceptions onto a teacher dashboard, enabling teachers to target mini-lessons to specific phase change hurdles before laboratory experiments.
                  </div>

                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">Interaction Path & ASR/TTS Wiring:</strong>
                    <ol className="list-decimal list-inside space-y-1 mt-1 pl-1 text-slate-600 dark:text-slate-400">
                      <li>Learner presses mic button (or speaks continuously). Web Speech API converts audio to text stream locally in browser memory.</li>
                      <li>Text payload POSTed to Express backend <code>/api/evaluate-turn</code>.</li>
                      <li>Gemini 3.8 Flash (or fallback heuristic engine) maps text against target causal nodes and checks for misconceptions or off-task divergence.</li>
                      <li>Backend returns structured JSON with conversational Socratic speech (under 50 words).</li>
                      <li>Frontend invokes <code>window.speechSynthesis</code> with selected English voice while driving SVG mouth visemes, and updates causal chain progress indicators.</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Sensible Limits & Classroom Reality (Section 6) */}
          {activeTab === 'limits' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40">
                <h3 className="font-bold text-emerald-900 dark:text-emerald-200 mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Privacy & Data Hygiene (Zero Silent Audio Uploads)
                </h3>
                <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  The application uses the browser's native Web Speech API (ASR) and SpeechSynthesis (TTS).
                  Raw audio streams are <strong>never</strong> recorded, stored, or silently uploaded to any third-party storage or database.
                  Only the ephemeral text transcription of the student's answer is transmitted to the server for pedagogical evaluation.
                </p>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200/60 dark:border-amber-800/40">
                <h3 className="font-bold text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  What Would Break in a Real 30-Student Classroom?
                </h3>
                <div className="space-y-2 text-amber-900/90 dark:text-amber-200">
                  <p>
                    <strong>1. Acoustic Crosstalk & ASR Confusion:</strong> In a noisy classroom with 30 students speaking at once, standard omnidirectional laptop microphones pick up neighboring peers, causing severe transcription errors.
                    <em>Fix:</em> Directional headset mics, push-to-talk gating, or typed fallback.
                  </p>
                  <p>
                    <strong>2. Web Speech API Network & Firewall Throttling:</strong> Google Chrome's Web Speech engine delegates audio to cloud speech endpoints. A whole school district on a shared NAT or restrictive firewall can hit rate limits or block the speech websocket.
                    <em>Fix:</em> On-device WebAssembly Whisper or standard typed mode.
                  </p>
                  <p>
                    <strong>3. LLM Concurrency & Latency Spikes:</strong> If 30 students submit responses simultaneously, token rate limits or latency spikes (3-5 seconds) break the tight conversational feedback loop.
                    <em>Fix:</em> Deterministic edge heuristics (included in this build!) + token queueing.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Candidate Details & Expected Salary */}
          {activeTab === 'candidate' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
                  <span className="font-semibold text-slate-500">Applicant Candidate:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">Full-Stack EdTech Engineer / AI Specialist</span>
                </div>

                <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
                  <span className="font-semibold text-slate-500">Candidate Email:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">hoywongdemo@gmail.com</span>
                </div>

                <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
                  <span className="font-semibold text-slate-500">Submission Task:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">Task 2 — Edtech Interaction App (Playable POC)</span>
                </div>

                <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
                  <span className="font-semibold text-slate-500">Expected Salary:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                    Open to competitive market rate for senior full-stack / AI EdTech engineering ($130,000 - $165,000 USD / commensurate with scope & equity)
                  </span>
                </div>

                <div className="pt-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    3–5 Minute Video Demo Structure:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 pl-1">
                    <li>0:00 - 0:45: Introduce Chi & Wylie (2014) ICAP framework & the sweating phenomenon.</li>
                    <li>0:45 - 1:45: Live spoken voice turn (ASR mic input + Dr. Ada avatar TTS spoken feedback).</li>
                    <li>1:45 - 2:45: Addressing a mental model misconception & viewing Causal Tracker step lighting up.</li>
                    <li>2:45 - 3:30: Achieving full mastery + unlocking the Far-Transfer challenge (Dog Panting).</li>
                    <li>3:30 - 4:00: Summary of technical architecture, privacy boundaries, and classroom scaling limits.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-between text-xs text-slate-500">
          <span>Reviewer can test microphone or typed input immediately</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors cursor-pointer"
          >
            Start Interactive Experience
          </button>
        </div>
      </div>
    </div>
  );
};
