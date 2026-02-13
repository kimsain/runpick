'use client';

// Single quiz question with option grid. Single-select only.

import { motion, useReducedMotion } from 'framer-motion';
import { QuizQuestion as QuizQuestionType } from '@/types/quiz';
import SentenceLineBreakText from '@/components/common/SentenceLineBreakText';
import { useInteractionCapabilities } from '@/hooks/useInteractionCapabilities';

interface QuizQuestionProps {
  question: QuizQuestionType;
  selectedOption: string | null;
  onSelectOption: (optionId: string) => void;
}

export default function QuizQuestion({
  question,
  selectedOption,
  onSelectOption,
}: QuizQuestionProps) {
  const { hasMotionBudget } = useInteractionCapabilities();
  const animateEnabled = !useReducedMotion() && hasMotionBudget;

  const handleClick = (optionId: string) => {
    onSelectOption(optionId);
  };

  return (
    <div>
      <h2 className="type-h2 text-[var(--color-foreground)] mb-2 text-balance">
        <SentenceLineBreakText text={question.questionKo} variant="headline" />
      </h2>
      {question.description && (
        <p className="type-body text-[var(--color-foreground)]/62 mb-8 text-pretty type-readable">
          <SentenceLineBreakText text={question.description} variant="body" />
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === option.id;
          const hasSelection = selectedOption !== null;

          return (
            <motion.button
              key={option.id}
              type="button"
              initial={animateEnabled ? { opacity: 0, y: 20 } : false}
              animate={
                animateEnabled
                  ? {
                      opacity: hasSelection && !isSelected ? 0.5 : 1,
                      y: 0,
                      scale: isSelected ? 1.02 : 1,
                    }
                  : undefined
              }
              transition={animateEnabled ? { delay: index * 0.08, duration: 0.3 } : undefined}
              whileHover={animateEnabled && !isSelected ? { scale: 1.02, y: -4, zIndex: 10 } : undefined}
              whileTap={animateEnabled && !isSelected ? { scale: 0.98 } : undefined}
              onClick={() => handleClick(option.id)}
              aria-label={option.labelKo}
              className={`relative w-full min-h-[86px] sm:min-h-[92px] p-4 sm:p-6 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'border-[var(--color-asics-accent)] bg-[var(--color-asics-accent)]/10 shadow-[0_0_20px_rgba(0,209,255,0.15)]'
                  : 'border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-border-hover)]'
              }`}
              aria-pressed={isSelected}
            >
              {/* Check icon for selected */}
              {isSelected && (
                <motion.div
                  initial={animateEnabled ? { scale: 0 } : false}
                  animate={animateEnabled ? { scale: 1 } : undefined}
                  transition={
                    animateEnabled ? { type: 'spring', stiffness: 500, damping: 25 } : undefined
                  }
                  className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[var(--color-asics-accent)] flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}

              {/* Icon + Label */}
              <div className="flex items-start gap-3 mb-1">
                {option.icon && <span className="text-2xl sm:text-3xl shrink-0">{option.icon}</span>}
                <h3 className={`type-body font-medium leading-tight ${
                  isSelected ? 'text-[var(--color-asics-accent)]' : 'text-[var(--color-foreground)]'
                }`}>
                  <SentenceLineBreakText text={option.labelKo} variant="body" />
                </h3>
              </div>

              {/* Description */}
              {option.description && (
                <p className="type-caption text-[var(--color-foreground)]/60 leading-snug">
                  <SentenceLineBreakText text={option.description} variant="caption" />
                </p>
              )}

              {/* Glow effect */}
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 rounded-2xl bg-[var(--color-asics-accent)]/5 pointer-events-none"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
