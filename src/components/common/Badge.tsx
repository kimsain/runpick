'use client';

import { CategoryId } from '@/types/shoe';

type BadgeVariant = 'default' | 'category' | 'spec';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  categoryId?: CategoryId;
  className?: string;
  'data-cursor'?: string;
}

const categoryColors: Record<CategoryId, { bg: string; text: string; border: string; glow: string }> = {
  daily: {
    bg: 'bg-[var(--color-daily)]/20',
    text: 'text-[var(--color-daily)]',
    border: 'border-[var(--color-daily)]/30',
    glow: 'var(--color-daily)',
  },
  'super-trainer': {
    bg: 'bg-[var(--color-super-trainer)]/20',
    text: 'text-[var(--color-super-trainer)]',
    border: 'border-[var(--color-super-trainer)]/30',
    glow: 'var(--color-super-trainer)',
  },
  racing: {
    bg: 'bg-[var(--color-racing)]/20',
    text: 'text-[var(--color-racing)]',
    border: 'border-[var(--color-racing)]/30',
    glow: 'var(--color-racing)',
  },
};

export default function Badge({
  children,
  variant = 'default',
  categoryId,
  className = '',
  'data-cursor': dataCursor,
}: BadgeProps) {
  const baseStyles =
    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm relative overflow-hidden';

  const getVariantStyles = () => {
    if (variant === 'category' && categoryId) {
      const colors = categoryColors[categoryId];
      return `${colors.bg} ${colors.text} ${colors.border}`;
    }
    if (variant === 'spec') {
      return 'bg-[var(--color-asics-blue)]/20 text-[var(--color-asics-accent)] border-[var(--color-asics-blue)]/30';
    }
    return 'bg-[var(--color-card)] text-[var(--color-foreground)]/70 border-[var(--color-border)]';
  };

  const getGlowColor = () => {
    if (variant === 'category' && categoryId) {
      return categoryColors[categoryId].glow;
    }
    return 'transparent';
  };

  return (
    <span
      data-cursor={dataCursor}
      className={`${baseStyles} ${getVariantStyles()} ${className} cursor-default transition-transform duration-200 hover:scale-[1.08] hover:-translate-y-0.5`}
    >
      {/* Static glow for category badges */}
      {variant === 'category' && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${getGlowColor()}15, transparent)`,
            opacity: 0.6,
          }}
        />
      )}

      {/* Content with z-index to stay above effects */}
      <span className="relative z-10 flex items-center gap-1">
        {children}
      </span>
    </span>
  );
}
