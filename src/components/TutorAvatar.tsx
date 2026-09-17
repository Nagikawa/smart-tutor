import React from 'react';
import { LearnerStatus } from '../types';
import { Mic, Sparkles, Brain, Volume2 } from 'lucide-react';

interface TutorAvatarProps {
  status: LearnerStatus;
  isSpeakingAudio: boolean;
  name?: string;
  role?: string;
}

export const TutorAvatar: React.FC<TutorAvatarProps> = ({
  status,
  isSpeakingAudio,
  name = 'Dr. Ada',
  role = 'Socratic Science Coach'
}) => {
  const isListening = status === 'listening';
  const isEvaluating = status === 'evaluating';
  const isMastered = status === 'mastered';
  const isTalking = isSpeakingAudio || status === 'feedback';

  return (
    <div id="tutor-avatar-container" className="flex items-center gap-4 p-4 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-sm">
      {/* Avatar Visual Stage */}
      <div className="relative flex-shrink-0">
        {/* Pulsing Aura for Listening or Celebrating */}
        {isListening && (
          <div className="absolute -inset-2 rounded-full bg-emerald-500/20 animate-ping" />
        )}
        {isMastered && (
          <div className="absolute -inset-2 rounded-full bg-amber-500/25 animate-pulse" />
        )}
        {isEvaluating && (
          <div className="absolute -inset-1.5 rounded-full border-2 border-indigo-400/40 border-dashed animate-spin duration-3000" />
        )}

        {/* Outer Circular Frame */}
        <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 transition-all duration-500 ${
          isMastered
            ? 'bg-gradient-to-tr from-amber-400 via-orange-300 to-yellow-200 ring-4 ring-amber-300/40 shadow-lg shadow-amber-500/20'
            : isListening
            ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 ring-4 ring-emerald-400/30'
            : isEvaluating
            ? 'bg-gradient-to-tr from-indigo-500 to-purple-400 ring-4 ring-indigo-400/30'
            : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 ring-2 ring-slate-200 dark:ring-slate-700'
        }`}>
          <div className="w-full h-full rounded-full bg-slate-950 overflow-hidden relative flex items-center justify-center">
            {/* SVG Interactive Face */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full transform transition-transform duration-300"
            >
              <defs>
                <radialGradient id="faceGlow" cx="50%" cy="45%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
                </radialGradient>
              </defs>

              {/* Background Glow */}
              <circle cx="50" cy="50" r="48" fill="url(#faceGlow)" />

              {/* Hair / Head Silhouette */}
              <path
                d="M 22 52 C 20 28, 80 28, 78 52 C 78 68, 85 75, 85 85 C 75 92, 25 92, 15 85 C 15 75, 22 68, 22 52 Z"
                fill="#1e293b"
              />

              {/* Face Shape */}
              <ellipse cx="50" cy="52" rx="26" ry="28" fill="#fed7aa" />

              {/* Hair Front Fringe */}
              <path
                d="M 24 45 C 32 32, 68 32, 76 45 C 65 38, 35 38, 24 45 Z"
                fill="#334155"
              />

              {/* Glasses Frame (Science Tutor Aesthetic) */}
              <circle cx="40" cy="50" r="8" fill="none" stroke="#0284c7" strokeWidth="2.5" />
              <circle cx="60" cy="50" r="8" fill="none" stroke="#0284c7" strokeWidth="2.5" />
              <path d="M 48 50 L 52 50" stroke="#0284c7" strokeWidth="2.5" />

              {/* Eyes */}
              {isListening ? (
                // Wide attentive listening eyes
                <>
                  <circle cx="40" cy="50" r="4.5" fill="#0f172a" />
                  <circle cx="38.5" cy="48.5" r="1.5" fill="#ffffff" />
                  <circle cx="60" cy="50" r="4.5" fill="#0f172a" />
                  <circle cx="58.5" cy="48.5" r="1.5" fill="#ffffff" />
                </>
              ) : isMastered ? (
                // Happy squint eyes (^_^)
                <>
                  <path d="M 36 51 Q 40 46 44 51" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <path d="M 56 51 Q 60 46 64 51" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </>
              ) : isEvaluating ? (
                // Thinking gaze slightly up-right
                <>
                  <circle cx="42" cy="48" r="3.8" fill="#0f172a" />
                  <circle cx="43" cy="47" r="1.2" fill="#ffffff" />
                  <circle cx="62" cy="48" r="3.8" fill="#0f172a" />
                  <circle cx="63" cy="47" r="1.2" fill="#ffffff" />
                </>
              ) : (
                // Standard friendly eyes
                <>
                  <circle cx="40" cy="50" r="3.5" fill="#0f172a" />
                  <circle cx="39" cy="49" r="1.2" fill="#ffffff" />
                  <circle cx="60" cy="50" r="3.5" fill="#0f172a" />
                  <circle cx="59" cy="49" r="1.2" fill="#ffffff" />
                </>
              )}

              {/* Eyebrows */}
              <path
                d={isEvaluating ? "M 34 40 Q 40 37 46 41" : "M 34 42 Q 40 39 46 42"}
                stroke="#475569"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d={isEvaluating ? "M 54 41 Q 60 37 66 39" : "M 54 42 Q 60 39 66 42"}
                stroke="#475569"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />

              {/* Blush cheeks */}
              <circle cx="33" cy="57" r="3" fill="#f43f5e" opacity="0.3" />
              <circle cx="67" cy="57" r="3" fill="#f43f5e" opacity="0.3" />

              {/* Animated Mouth */}
              {isTalking ? (
                // Talking mouth animated via SVG
                <path
                  d="M 44 65 Q 50 73 56 65 Q 50 67 44 65 Z"
                  fill="#991b1b"
                  stroke="#7f1d1d"
                  strokeWidth="1"
                  className="animate-pulse"
                />
              ) : isMastered ? (
                // Big beaming smile
                <path
                  d="M 42 63 Q 50 73 58 63"
                  stroke="#991b1b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : isListening ? (
                // Attentive "o" mouth
                <ellipse cx="50" cy="65" rx="3.5" ry="4.5" fill="#991b1b" />
              ) : (
                // Friendly gentle smile
                <path
                  d="M 45 65 Q 50 69 55 65"
                  stroke="#991b1b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
              )}
            </svg>
          </div>
        </div>

        {/* State Badge Icon */}
        <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-full border-2 border-white dark:border-slate-900 shadow-sm flex items-center justify-center ${
          isListening
            ? 'bg-emerald-500 text-white animate-bounce'
            : isEvaluating
            ? 'bg-indigo-500 text-white'
            : isMastered
            ? 'bg-amber-500 text-white'
            : isTalking
            ? 'bg-blue-600 text-white'
            : 'bg-slate-700 text-white'
        }`}>
          {isListening && <Mic className="w-3.5 h-3.5" />}
          {isEvaluating && <Brain className="w-3.5 h-3.5 animate-spin" />}
          {isMastered && <Sparkles className="w-3.5 h-3.5" />}
          {isTalking && !isMastered && <Volume2 className="w-3.5 h-3.5" />}
          {!isListening && !isEvaluating && !isMastered && !isTalking && (
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-400" />
          )}
        </div>
      </div>

      {/* Tutor Info & Live Status text */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            {name}
          </h2>
          <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200/60 dark:border-blue-800/40">
            {role}
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {isListening ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Listening to your explanation... Speak aloud!
            </span>
          ) : isEvaluating ? (
            <span className="text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Analyzing causal mechanism & mental model...
            </span>
          ) : isTalking ? (
            <span className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1.5">
              <Volume2 className="w-3 h-3 animate-pulse" />
              Speaking response aloud (TTS active)
            </span>
          ) : isMastered ? (
            <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Causal loop mastered! Constructive reasoning achieved.
            </span>
          ) : (
            'Ready to listen. Share your explanation by voice or text.'
          )}
        </p>
      </div>
    </div>
  );
};
