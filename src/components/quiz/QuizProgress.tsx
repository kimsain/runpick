'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface QuizProgressProps {
  current: number;
  total: number;
}

export default function QuizProgress({ current, total }: QuizProgressProps) {
  const animateEnabled = !useReducedMotion();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-0">
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className="flex items-center">
            {/* Step circle */}
            <div className="relative flex items-center justify-center">
              {animateEnabled ? (
                <motion.div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium border-2 transition-colors ${
                    i < current
                      ? 'bg-[var(--color-asics-accent)] border-[var(--color-asics-accent)] text-white'
                      : i === current
                        ? 'border-[var(--color-asics-accent)] text-[var(--color-asics-accent)] bg-[var(--color-asics-accent)]/10'
                        : 'border-[var(--color-border)] text-[var(--color-foreground)]/30 bg-[var(--color-card)]'
                  }`}
                  style={i === current ? { boxShadow: '0 0 8px rgba(0, 209, 255, 0.3)' } : undefined}
                >
                  {i < current ? (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  ) : (
                    i + 1
                  )}
                </motion.div>
              ) : (
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium border-2 ${
                    i < current
                      ? 'bg-[var(--color-asics-accent)] border-[var(--color-asics-accent)] text-white'
                      : i === current
                        ? 'border-[var(--color-asics-accent)] text-[var(--color-asics-accent)] bg-[var(--color-asics-accent)]/10'
                        : 'border-[var(--color-border)] text-[var(--color-foreground)]/30 bg-[var(--color-card)]'
                  }`}
                  style={i === current ? { boxShadow: '0 0 8px rgba(0, 209, 255, 0.3)' } : undefined}
                >
                  {i < current ? '✓' : i + 1}
                </div>
              )}
            </div>

            {/* Connector line (not after last step) */}
            {i < total - 1 && (
              <div className="relative w-8 sm:w-16 h-0.5 mx-0.5 sm:mx-1">
                <div className="absolute inset-0 bg-[var(--color-border)] rounded-full" />
                {i < current && (
                  animateEnabled ? (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="absolute inset-y-0 left-0 bg-[var(--color-asics-accent)] rounded-full"
                    />
                  ) : (
                    <div className="absolute inset-y-0 left-0 w-full bg-[var(--color-asics-accent)] rounded-full" />
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Question label */}
      <p className="text-center type-caption text-[var(--color-foreground)]/50 mt-4">
        질문 {current + 1} / {total}
      </p>
    </div>
  );
}
