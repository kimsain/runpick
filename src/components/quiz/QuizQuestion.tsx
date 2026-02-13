'use client';

// Single quiz question with option grid. Single-select only.

import { motion } from 'framer-motion';
import { QuizQuestion as QuizQuestionType } from '@/types/quiz';

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
  const handleClick = (optionId: string) => {
    onSelectOption(optionId);
  };

  return (
    <div>
      <h2 className="type-h2 text-[var(--color-foreground)] mb-2 text-balance">
        {question.questionKo}
      </h2>
      {question.description && (
        <p className="type-body text-[var(--color-foreground)]/62 mb-8 text-pretty">{question.description}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === option.id;
          const hasSelection = selectedOption !== null;

          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: hasSelection && !isSelected ? 0.5 : 1,
                y: 0,
                scale: isSelected ? 1.02 : 1,
              }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              whileHover={!isSelected ? { scale: 1.02, y: -4 } : {}}
              whileTap={!isSelected ? { scale: 0.98 } : {}}
              onClick={() => handleClick(option.id)}
              className={`relative w-full min-h-[96px] p-4 sm:p-6 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'border-[var(--color-asics-accent)] bg-[var(--color-asics-accent)]/10 shadow-[0_0_20px_rgba(0,209,255,0.15)]'
                  : 'border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-border-hover)]'
              }`}
              aria-pressed={isSelected}
            >
              {/* Check icon for selected */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[var(--color-asics-accent)] flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}

              {/* Icon + Label */}
              <div className="flex items-center gap-3 mb-1">
                {option.icon && <span className="text-2xl sm:text-3xl shrink-0">{option.icon}</span>}
                <h3 className={`type-body font-medium ${
                  isSelected ? 'text-[var(--color-asics-accent)]' : 'text-[var(--color-foreground)]'
                }`}>
                  {option.labelKo}
                </h3>
              </div>

              {/* Description */}
              {option.description && (
                <p className="type-body text-[var(--color-foreground)]/60">{option.description}</p>
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
