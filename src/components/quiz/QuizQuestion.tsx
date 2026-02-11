'use client';

import { motion } from 'framer-motion';
import { QuizQuestion as QuizQuestionType } from '@/types/quiz';

interface QuizQuestionProps {
  question: QuizQuestionType;
  selectedOptions: string[];
  onSelectOption: (optionId: string) => void;
}

export default function QuizQuestion({
  question,
  selectedOptions,
  onSelectOption,
}: QuizQuestionProps) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-foreground)] mb-2">
        {question.questionKo}
      </h2>
      {question.description && (
        <p className="text-[var(--color-foreground)]/60 mb-8">{question.description}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {question.options.map((option, index) => {
          const isSelected = selectedOptions.includes(option.id);

          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectOption(option.id)}
              className={`relative p-6 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'border-[var(--color-asics-accent)] bg-[var(--color-asics-accent)]/10'
                  : 'border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-border-hover)]'
              }`}
            >
              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[var(--color-asics-accent)] flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              )}

              {/* Icon */}
              {option.icon && (
                <span className="text-3xl mb-3 block">{option.icon}</span>
              )}

              {/* Label */}
              <h3
                className={`text-lg font-medium mb-1 ${
                  isSelected
                    ? 'text-[var(--color-asics-accent)]'
                    : 'text-[var(--color-foreground)]'
                }`}
              >
                {option.labelKo}
              </h3>

              {/* Description */}
              {option.description && (
                <p className="text-sm text-[var(--color-foreground)]/60">
                  {option.description}
                </p>
              )}

              {/* Glow effect */}
              {isSelected && (
                <div className="absolute inset-0 rounded-2xl bg-[var(--color-asics-accent)]/5 pointer-events-none" />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
