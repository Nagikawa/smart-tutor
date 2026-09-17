import React from 'react';
import { DialogueTurn } from '../types';
import { Volume2, User, Bot, AlertTriangle, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';

interface DialogueHistoryProps {
  turns: DialogueTurn[];
  onReplayAudio: (text: string) => void;
  isAudioPlaying: boolean;
}

export const DialogueHistory: React.FC<DialogueHistoryProps> = ({
  turns,
  onReplayAudio,
  isAudioPlaying
}) => {
  return (
    <div id="dialogue-history-feed" className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
      {turns.map((turn, index) => {
        const isTutor = turn.speaker === 'tutor';
        const evalData = turn.evaluation;

        return (
          <div
            key={turn.id}
            id={`dialogue-turn-${index}`}
            className={`flex flex-col ${isTutor ? 'items-start' : 'items-end'}`}
          >
            <div className={`flex items-start gap-2.5 max-w-[92%] sm:max-w-[85%] ${
              isTutor ? 'flex-row' : 'flex-row-reverse'
            }`}>
              {/* Avatar Icon */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                isTutor
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-emerald-600 text-white shadow-xs'
              }`}>
                {isTutor ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`p-4 rounded-2xl text-sm leading-relaxed border transition-all ${
                isTutor
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs shadow-xs'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-transparent rounded-tr-xs shadow-xs'
              }`}>
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className={`text-[11px] font-semibold tracking-wide ${
                    isTutor ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-100'
                  }`}>
                    {isTutor ? 'Dr. Ada (Tutor)' : 'Learner (Spoken / Typed)'}
                  </span>

                  {isTutor && (
                    <button
                      type="button"
                      onClick={() => onReplayAudio(turn.text)}
                      className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded-md transition-colors cursor-pointer"
                      title="Listen aloud with SpeechSynthesis"
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${isAudioPlaying ? 'animate-pulse' : ''}`} />
                    </button>
                  )}
                </div>

                <p className="whitespace-pre-wrap">{turn.text}</p>

                {/* Formative Evaluation Tag for learner turns */}
                {evalData && (
                  <div className="mt-3 pt-2.5 border-t border-emerald-500/30 text-xs">
                    {evalData.status === 'misconception' && (
                      <div className="flex items-center gap-1.5 text-amber-200 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Mental model gap detected: {evalData.detectedMisconception}</span>
                      </div>
                    )}

                    {evalData.status === 'off_task' && (
                      <div className="flex items-center gap-1.5 text-orange-200 font-medium">
                        <HelpCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Off-task input detected & gently redirected</span>
                      </div>
                    )}

                    {evalData.status === 'partial_progress' && (
                      <div className="flex items-center gap-1.5 text-emerald-100 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Progress noted • Prompted for next causal link</span>
                      </div>
                    )}

                    {evalData.status === 'complete_mastery' && (
                      <div className="flex items-center gap-1.5 text-amber-300 font-medium">
                        <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Causal mechanism fully articulated!</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-emerald-100/80 font-mono">
                      <span>ICAP Engagement: <strong className="text-white">{evalData.icapLevel}</strong></span>
                      <span>•</span>
                      <span>Links: {evalData.identifiedLinks.length}/4</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
