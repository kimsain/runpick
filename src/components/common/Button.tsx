'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  children: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-[var(--color-asics-blue)] to-[var(--color-asics-accent)] text-white',
  secondary: 'bg-[var(--color-card-hover)] text-[var(--color-foreground)]',
  ghost: 'bg-transparent text-[var(--color-foreground)] hover:bg-[var(--color-card)]',
  outline:
    'bg-transparent border border-[var(--color-border)] text-[var(--color-foreground)] hover:border-[var(--color-asics-accent)]',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    rounded-full font-medium
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-[var(--color-asics-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)]
  `;

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href}>
        <motion.span
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={combinedClassName}
        >
          {children}
        </motion.span>
      </Link>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={combinedClassName}
      {...props}
    >
      {children}
    </motion.button>
  );
}
