'use client';

import { motion } from 'framer-motion';
import { CategoryId } from '@/types/shoe';

type BadgeVariant = 'default' | 'category' | 'spec';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  categoryId?: CategoryId;
  className?: string;
}

const categoryColors: Record<CategoryId, string> = {
  daily: 'bg-[var(--color-daily)]/20 text-[var(--color-daily)] border-[var(--color-daily)]/30',
  'super-trainer':
    'bg-[var(--color-super-trainer)]/20 text-[var(--color-super-trainer)] border-[var(--color-super-trainer)]/30',
  racing: 'bg-[var(--color-racing)]/20 text-[var(--color-racing)] border-[var(--color-racing)]/30',
};

export default function Badge({
  children,
  variant = 'default',
  categoryId,
  className = '',
}: BadgeProps) {
  const baseStyles =
    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border';

  const getVariantStyles = () => {
    if (variant === 'category' && categoryId) {
      return categoryColors[categoryId];
    }
    if (variant === 'spec') {
      return 'bg-[var(--color-asics-blue)]/20 text-[var(--color-asics-accent)] border-[var(--color-asics-blue)]/30';
    }
    return 'bg-[var(--color-card)] text-[var(--color-foreground)]/70 border-[var(--color-border)]';
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${baseStyles} ${getVariantStyles()} ${className}`}
    >
      {children}
    </motion.span>
  );
}
