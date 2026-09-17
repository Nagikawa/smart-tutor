import React from 'react';
import { CausalLink } from '../types';
import { CheckCircle2, CircleDashed, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';

interface CausalChainTrackerProps {
  chain: CausalLink[];
  onHintClick?: (link: CausalLink) => void;
}

export const CausalChainTracker: React.FC<CausalChainTrackerProps> = ({
  chain,
  onHintClick
}) => {
  const fulfilledCount = chain.filter(c => c.isFulfilled).length;
  const isAllComplete = fulfilledCount === chain.length;

  return (
    <div id="causal-chain-tracker" className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Causal Mechanism Chain (ICAP Self-Explanation)
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
          <span>{fulfilledCount} / {chain.length} Links Articulated</span>
          {isAllComplete && (
            <span className="flex items-center gap-0.5 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 rounded-full text-[11px] font-semibold">
              <Sparkles className="w-3 h-3" /> Mastered
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500 transition-all duration-700 ease-out"
          style={{ width: `${(fulfilledCount / chain.length) * 100}%` }}
        />
      </div>

      {/* Step Grid / Sequence */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {chain.map((link, idx) => {
          const isNextTarget = !link.isFulfilled && (idx === 0 || chain[idx - 1].isFulfilled);

          return (
            <div
              key={link.id}
              id={`causal-step-${link.id}`}
              className={`p-3 rounded-xl border transition-all duration-300 relative text-left ${
                link.isFulfilled
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/60 shadow-xs'
                  : isNextTarget
                  ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700/60 ring-2 ring-blue-400/20'
                  : 'bg-white/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-1.5 mb-1.5">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  Step {link.order}
                </span>

                {link.isFulfilled ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                ) : isNextTarget ? (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/60 px-1.5 py-0.2 rounded">
                    Current Focus
                  </span>
                ) : (
                  <CircleDashed className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                )}
              </div>

              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1 leading-snug">
                {link.label.replace(/^\d+\.\s*/, '')}
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {link.description}
              </p>

              {onHintClick && !link.isFulfilled && (
                <button
                  type="button"
                  onClick={() => onHintClick(link)}
                  className="mt-2 text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 transition-colors group cursor-pointer"
                  title="Show Socratic scaffolding hint"
                >
                  <HelpCircle className="w-3 h-3 group-hover:scale-110 transition-transform" />
                  <span>View Hint</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
