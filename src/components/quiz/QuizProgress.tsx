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
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-[var(--color-foreground)]/60">
          질문 {current + 1} / {total}
        </span>
        <span className="text-sm font-medium text-[var(--color-asics-accent)]">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="h-2 bg-[var(--color-card)] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-[var(--color-asics-blue)] to-[var(--color-asics-accent)] rounded-full"
        />
      </div>
    </div>
  );
}
