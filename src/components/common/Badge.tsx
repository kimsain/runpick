'use client';

import { motion } from 'framer-motion';
import { CategoryId } from '@/types/shoe';
import { useState } from 'react';

type BadgeVariant = 'default' | 'category' | 'spec';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  categoryId?: CategoryId;
  className?: string;
  interactive?: boolean;
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
  interactive = true,
  'data-cursor': dataCursor,
}: BadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

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
    if (variant === 'spec') {
      return 'var(--color-asics-accent)';
    }
    return 'var(--color-foreground)';
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8, y: -5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 20
      }}
      whileHover={interactive ? {
        scale: 1.08,
        y: -2,
        transition: { type: 'spring', stiffness: 500, damping: 15 }
      } : undefined}
      whileTap={interactive ? { scale: 0.95 } : undefined}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      data-cursor={dataCursor}
      className={`${baseStyles} ${getVariantStyles()} ${className} cursor-default`}
      style={{
        boxShadow: isHovered
          ? `0 4px 15px ${getGlowColor()}40, 0 0 10px ${getGlowColor()}20`
          : 'none',
      }}
    >
      {/* Shimmer/shine effect */}
      <motion.div
        className="absolute inset-0 -translate-x-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${getGlowColor()}20, transparent)`,
        }}
        animate={isHovered ? {
          translateX: ['calc(-100%)', 'calc(100%)']
        } : { translateX: 'calc(-100%)' }}
        transition={{
          duration: 0.6,
          ease: 'easeInOut'
        }}
      />

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

      {/* Gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0"
        style={{
          background: `linear-gradient(135deg, transparent, ${getGlowColor()}10)`,
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Content with z-index to stay above effects */}
      <span className="relative z-10 flex items-center gap-1">
        {children}
      </span>

      {/* Border glow animation */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          border: `1px solid ${getGlowColor()}`,
          opacity: 0,
        }}
        animate={isHovered ? {
          opacity: [0, 0.5, 0],
          scale: [1, 1.1, 1.15],
        } : { opacity: 0 }}
        transition={{
          duration: 0.8,
          repeat: isHovered ? Infinity : 0,
        }}
      />
    </motion.span>
  );
}
