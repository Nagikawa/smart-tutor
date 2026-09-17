import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Send,
  RotateCcw,
  Volume2,
  VolumeX,
  BookOpen,
  Sparkles,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  Flame,
  CheckCircle,
  Info
} from 'lucide-react';
import {
  DialogueTurn,
  CausalLink,
  LearnerStatus,
  TurnEvaluation,
  ScienceActivity
} from './types';
import { primaryActivity } from './data/activities';
import { TutorAvatar } from './components/TutorAvatar';
import { CausalChainTracker } from './components/CausalChainTracker';
import { DialogueHistory } from './components/DialogueHistory';
import { ReviewerDossierModal } from './components/ReviewerDossierModal';
import {
  createSpeechRecognition,
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  speakText,
  stopSpeaking
} from './utils/speech';

export default function App() {
  // Current Activity
  const [activity, setActivity] = useState<ScienceActivity>(primaryActivity);
  const [isTransferMode, setIsTransferMode] = useState<boolean>(false);

  // Causal Chain State
  const [causalChain, setCausalChain] = useState<CausalLink[]>(primaryActivity.causalChain);

  // Dialogue Turns
  const [turns, setTurns] = useState<DialogueTurn[]>([]);

  // Input & Status
  const [inputText, setInputText] = useState<string>('');
  const [learnerStatus, setLearnerStatus] = useState<LearnerStatus>('idle');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [activeHint, setActiveHint] = useState<CausalLink | null>(null);

  // Audio / Speech State
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isSpeakingAudio, setIsSpeakingAudio] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [hasSpeechRecognition, setHasSpeechRecognition] = useState<boolean>(true);
  const [speechInterimText, setSpeechInterimText] = useState<string>('');

  // Modals & Drawers
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);

  // Refs
  const recognitionRef = useRef<any>(null);
  const turnsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize Speech Recognition & First Tutor Turn
  useEffect(() => {
    setHasSpeechRecognition(isSpeechRecognitionSupported());

    // Initial greeting from Dr. Ada
    const initialTutorTurn: DialogueTurn = {
      id: 'turn-init',
      speaker: 'tutor',
      text: `${activity.scenario}\n\n${activity.initialPrompt}`,
      timestamp: Date.now()
    };
    setTurns([initialTutorTurn]);

    // Cleanup on unmount
    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Auto-scroll dialogue
  useEffect(() => {
    turnsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns, isEvaluating]);

  // Handle Speech Output (TTS)
  const speakMessage = useCallback(
    (text: string) => {
      if (isAudioMuted || !isSpeechSynthesisSupported()) return;

      stopSpeaking();
      setIsSpeakingAudio(true);
      setLearnerStatus('feedback');

      speakText(text, {
        rate: speechRate,
        onStart: () => {
          setIsSpeakingAudio(true);
        },
        onEnd: () => {
          setIsSpeakingAudio(false);
          setLearnerStatus(prev => (prev === 'feedback' ? 'idle' : prev));
        },
        onError: () => {
          setIsSpeakingAudio(false);
          setLearnerStatus('idle');
        }
      });
    },
    [isAudioMuted, speechRate]
  );

  // Toggle Voice Input (ASR)
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.warn(e);
        }
      }
      setIsListening(false);
      setLearnerStatus('idle');
      return;
    }

    const recognition = createSpeechRecognition();
    if (!recognition) {
      alert('Speech recognition is not supported in this browser environment. You can type your explanation in the text box below!');
      setHasSpeechRecognition(false);
      return;
    }

    stopSpeaking();
    setIsSpeakingAudio(false);

    recognition.onstart = () => {
      setIsListening(true);
      setLearnerStatus('listening');
      setSpeechInterimText('');
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      setSpeechInterimText(interim);
      if (final) {
        setInputText(prev => (prev ? `${prev} ${final.trim()}` : final.trim()));
        setSpeechInterimText('');
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
      setLearnerStatus('idle');
      if (event.error === 'not-allowed') {
        alert('Microphone permission was denied. Please allow microphone access or use the text box to type your answer.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setLearnerStatus('idle');
      setSpeechInterimText('');
    };

    try {
      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
      setIsListening(false);
      setLearnerStatus('idle');
    }
  };

  // Submit Learner Explanation Turn
  const handleSubmitTurn = async (overrideText?: string) => {
    const textToEvaluate = (overrideText ?? inputText).trim();
    if (!textToEvaluate) return;

    // Stop listening if active
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    }
    stopSpeaking();
    setIsSpeakingAudio(false);

    // Create and append learner turn
    const learnerTurnId = `turn-${Date.now()}`;
    const newLearnerTurn: DialogueTurn = {
      id: learnerTurnId,
      speaker: 'learner',
      text: textToEvaluate,
      timestamp: Date.now()
    };

    setTurns(prev => [...prev, newLearnerTurn]);
    setInputText('');
    setSpeechInterimText('');
    setIsEvaluating(true);
    setLearnerStatus('evaluating');

    try {
      // Gather already fulfilled links
      const completedLinkIds = causalChain.filter(c => c.isFulfilled).map(c => c.id);

      const response = await fetch('/api/evaluate-turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: activity.id,
          learnerInput: textToEvaluate,
          completedLinks: completedLinkIds,
          isTransfer: isTransferMode
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const evaluation: TurnEvaluation = await response.json();

      // Update learner turn with diagnostic data
      setTurns(prev =>
        prev.map(turn => (turn.id === learnerTurnId ? { ...turn, evaluation } : turn))
      );

      // Update causal chain links fulfilled
      setCausalChain(prev =>
        prev.map(link => ({
          ...link,
          isFulfilled: evaluation.identifiedLinks.includes(link.id) || link.isFulfilled
        }))
      );

      // Tutor response text
      const tutorResponseText = `${evaluation.feedbackSpeech}\n\n${evaluation.socraticScaffold}`;
      const tutorTurn: DialogueTurn = {
        id: `turn-tutor-${Date.now()}`,
        speaker: 'tutor',
        text: tutorResponseText,
        timestamp: Date.now()
      };

      setTurns(prev => [...prev, tutorTurn]);

      if (evaluation.isComplete) {
        setLearnerStatus('mastered');
      } else {
        setLearnerStatus('feedback');
      }

      // Speak feedback aloud
      speakMessage(evaluation.feedbackSpeech);
    } catch (error) {
      console.error('Evaluation failed:', error);
      const fallbackTurn: DialogueTurn = {
        id: `turn-err-${Date.now()}`,
        speaker: 'tutor',
        text: "I heard your thoughts! Let's examine that carefully: what physical phase change does the moisture on your skin undergo when thermal energy is applied?",
        timestamp: Date.now()
      };
      setTurns(prev => [...prev, fallbackTurn]);
      setLearnerStatus('idle');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Reset or Switch Activities
  const handleReset = (transfer: boolean = false) => {
    stopSpeaking();
    setIsSpeakingAudio(false);
    setIsListening(false);
    setIsTransferMode(transfer);

    const initialChain = primaryActivity.causalChain.map(c => ({ ...c, isFulfilled: false }));
    setCausalChain(initialChain);

    const scenarioText = transfer
      ? `${primaryActivity.transferPrompt.scenario}\n\n${primaryActivity.transferPrompt.prompt}`
      : `${primaryActivity.scenario}\n\n${primaryActivity.initialPrompt}`;

    setTurns([
      {
        id: `turn-reset-${Date.now()}`,
        speaker: 'tutor',
        text: scenarioText,
        timestamp: Date.now()
      }
    ]);
    setLearnerStatus('idle');
    setInputText('');
  };

  const isMastered = causalChain.every(c => c.isFulfilled);

  return (
    <div id="app-root" className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased">
      {/* Top Application Bar */}
      <header id="app-header" className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Curriculum Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Socratic Science Tutor
                </h1>
                <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800">
                  ICAP Self-Explanation
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs sm:max-w-md">
                {activity.curriculumStandard}
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2">
            {/* Audio Voice Toggle */}
            <button
              id="audio-mute-toggle"
              type="button"
              onClick={() => {
                if (!isAudioMuted) stopSpeaking();
                setIsAudioMuted(prev => !prev);
              }}
              className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
                isAudioMuted
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                  : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
              }`}
              title={isAudioMuted ? 'Unmute Dr. Ada Voice (TTS)' : 'Mute Dr. Ada Voice'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isAudioMuted ? 'Voice Off' : 'Voice On'}</span>
            </button>

            {/* Restart Activity */}
            <button
              id="restart-activity-btn"
              type="button"
              onClick={() => handleReset(isTransferMode)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors text-xs font-medium flex items-center gap-1 cursor-pointer"
              title="Restart current challenge"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Reviewer Dossier Button (Task 2 Interview Highlight) */}
            <button
              id="open-reviewer-dossier-btn"
              type="button"
              onClick={() => setIsDossierOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ring-2 ring-blue-500/20"
            >
              <BookOpen className="w-4 h-4" />
              <span>Reviewer Dossier & 5-Min Walkthrough</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Learning Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Tutor Avatar, Activity Scenario, and Causal Chain */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Dr. Ada Animated Avatar Card */}
          <TutorAvatar
            status={learnerStatus}
            isSpeakingAudio={isSpeakingAudio}
            name="Dr. Ada"
            role="Socratic Science Coach"
          />

          {/* Activity Scenario Card */}
          <div id="activity-scenario-card" className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                {isTransferMode ? 'Transfer Challenge' : 'Scientific Phenomenon'}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                Grades 6–8
              </span>
            </div>

            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">
              {isTransferMode ? primaryActivity.transferPrompt.title : primaryActivity.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isTransferMode ? primaryActivity.transferPrompt.scenario : primaryActivity.scenario}
            </p>

            {/* Switch between Base Activity and Far-Transfer Challenge */}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {isTransferMode ? 'Challenge 2 of 2' : 'Challenge 1 of 2'}
              </span>

              <button
                type="button"
                onClick={() => handleReset(!isTransferMode)}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>{isTransferMode ? '← Back to Sweating' : 'Try Far-Transfer (Dog Panting) →'}</span>
              </button>
            </div>
          </div>

          {/* Causal Mechanism Progress Tracker */}
          <CausalChainTracker
            chain={causalChain}
            onHintClick={(link) => setActiveHint(link)}
          />

          {/* Hint Card when clicked */}
          {activeHint && (
            <div className="p-3.5 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2 animate-in fade-in duration-150">
              <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold mb-0.5">{activeHint.label} Hint:</div>
                <p className="leading-relaxed">{activeHint.hint}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveHint(null)}
                className="text-amber-600 hover:text-amber-800 p-0.5 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Mastered Celebration Banner */}
          {isMastered && (
            <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl shadow-sm flex items-center justify-between gap-3 animate-in zoom-in-95 duration-300">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Causal Loop Mastered!</h4>
                  <p className="text-xs text-emerald-100">
                    You articulated the entire physical mechanism of evaporative cooling.
                  </p>
                </div>
              </div>

              {!isTransferMode && (
                <button
                  type="button"
                  onClick={() => handleReset(true)}
                  className="px-3 py-1.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer"
                >
                  Far-Transfer Test →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Socratic Dialogue Stream & Multi-Modal Input Bar */}
        <div className="lg:col-span-7 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden h-[620px] sm:h-[680px]">
          {/* Dialogue Header */}
          <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Interactive Socratic Dialogue
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Speech Speed:</span>
              <button
                type="button"
                onClick={() => setSpeechRate(prev => (prev === 1.0 ? 1.2 : prev === 1.2 ? 0.8 : 1.0))}
                className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[11px] font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                title="Change SpeechSynthesis playback rate"
              >
                {speechRate}x
              </button>
            </div>
          </div>

          {/* Dialogue Feed */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto">
            <DialogueHistory
              turns={turns}
              onReplayAudio={speakMessage}
              isAudioPlaying={isSpeakingAudio}
            />

            {/* Evaluating Spinner Bubble */}
            {isEvaluating && (
              <div className="flex items-center gap-2 p-3 mt-3 max-w-xs bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                <span>Dr. Ada is analyzing your explanation...</span>
              </div>
            )}

            <div ref={turnsEndRef} />
          </div>

          {/* Live ASR Interim Transcript Banner */}
          {isListening && (
            <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/50 border-t border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 animate-in fade-in">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping flex-shrink-0" />
              <span className="font-semibold">Live Mic Stream:</span>
              <span className="italic truncate">{speechInterimText || 'Listening for your voice... speak aloud!'}</span>
            </div>
          )}

          {/* Multi-Modal Input Bar (Voice ASR + Typed Fallback + Quick Chips) */}
          <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40">
            {/* Quick-Prompt Chips (for easy testing & student scaffolding) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-[11px] text-slate-500">
              <span className="whitespace-nowrap font-semibold">Try saying:</span>

              <button
                type="button"
                onClick={() => setInputText("Sweat covers our warm skin, and the water absorbs thermal heat until it evaporates into gas, cooling our body.")}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 whitespace-nowrap text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                💧 Full Causal Loop
              </button>

              <button
                type="button"
                onClick={() => setInputText("The sweat is cold liquid pumped from our blood to freeze our skin.")}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-700 whitespace-nowrap text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                ⚠️ Misconception Test
              </button>

              <button
                type="button"
                onClick={() => setInputText("Our body gets hot so our sweat glands release moisture.")}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 whitespace-nowrap text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                🧩 Partial Progress Test
              </button>
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitTurn();
              }}
              className="flex items-end gap-2"
            >
              {/* Voice Microphone Toggle Button */}
              <button
                id="voice-mic-input-btn"
                type="button"
                onClick={toggleListening}
                className={`p-3 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                  isListening
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-400/40 animate-pulse'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                }`}
                title={isListening ? 'Click to stop recording' : 'Click to speak your explanation (Web Speech API)'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Text Input Box */}
              <div className="relative flex-1">
                <textarea
                  id="learner-input-textarea"
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitTurn();
                    }
                  }}
                  rows={2}
                  placeholder={
                    isListening
                      ? 'Listening to your voice... (you can also edit here)'
                      : 'Speak via microphone or type your explanation here... (Press Enter to send)'
                  }
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none transition-all"
                  disabled={isEvaluating}
                />
              </div>

              {/* Send Button */}
              <button
                id="submit-turn-btn"
                type="submit"
                disabled={!inputText.trim() || isEvaluating}
                className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white rounded-2xl transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                title="Send explanation for Socratic evaluation"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

            {/* Input Help Text & Privacy Guarantee */}
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Info className="w-3 h-3" />
                Local Speech Recognition (No audio uploaded to cloud)
              </span>
              <span>Press Enter to Submit</span>
            </div>
          </div>
        </div>
      </main>

      {/* Reviewer Dossier Modal */}
      <ReviewerDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        onApplySampleInput={(text) => {
          setInputText(text);
          setTimeout(() => {
            handleSubmitTurn(text);
          }, 100);
        }}
      />
    </div>
  );
}
