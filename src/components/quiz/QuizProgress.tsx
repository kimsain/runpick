'use client';

import { motion } from 'framer-motion';

interface QuizProgressProps {
  current: number;
  total: number;
}

export default function QuizProgress({ current, total }: QuizProgressProps) {
  const percentage = ((current + 1) / total) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-[var(--color-foreground)]/60">
          질문 {current + 1} / {total}
        </span>
        <span className="text-sm font-medium text-[var(--color-asics-accent)]">
          {Math.round(percentage)}%
        </span>
      </div>

      {/* Progress bar with glow */}
      <div className="relative h-2 bg-[var(--color-card)] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-[var(--color-asics-blue)] to-[var(--color-asics-accent)] rounded-full relative"
        >
          {/* Glow on bar end */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
            style={{
              background: 'var(--color-asics-accent)',
              boxShadow: '0 0 8px var(--color-asics-accent), 0 0 16px rgba(0, 209, 255, 0.4)',
            }}
          />
        </motion.div>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-between mt-3">
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className="relative flex items-center justify-center">
            <motion.div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor:
                  i <= current
                    ? 'var(--color-asics-accent)'
                    : 'var(--color-border)',
              }}
              animate={
                i === current
                  ? {
                      scale: [1, 1.4, 1],
                      boxShadow: [
                        '0 0 0px var(--color-asics-accent)',
                        '0 0 8px var(--color-asics-accent)',
                        '0 0 0px var(--color-asics-accent)',
                      ],
                    }
                  : {}
              }
              transition={
                i === current
                  ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
                  : {}
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
