'use client';

import { motion, HTMLMotionProps, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useCallback, useRef } from 'react';
import MagneticElement from '@/components/effects/MagneticElement';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface RippleType {
  id: number;
  x: number;
  y: number;
}

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

// Ripple component for click effect
function Ripple({ x, y, onComplete }: { x: number; y: number; onComplete: () => void }) {
  return (
    <motion.span
      initial={{ scale: 0, opacity: 0.5 }}
      animate={{ scale: 4, opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      onAnimationComplete={onComplete}
      className="absolute rounded-full bg-white/30 pointer-events-none"
      style={{
        left: x - 10,
        top: y - 10,
        width: 20,
        height: 20,
      }}
    />
  );
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className = '',
  onClick,
  ...props
}: ButtonProps) {
  const [ripples, setRipples] = useState<RippleType[]>([]);
  const [isPressed, setIsPressed] = useState(false);
  const rippleIdRef = useRef(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const baseStyles = `
    inline-flex items-center justify-center gap-2
    rounded-full font-medium
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-[var(--color-asics-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)]
    relative overflow-hidden
  `;

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      id: rippleIdRef.current++,
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);

    if (onClick) {
      onClick(e);
    }
  }, [onClick]);

  const removeRipple = useCallback((id: number) => {
    setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
  }, []);

  const buttonContent = (
    <>
      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <Ripple
            key={ripple.id}
            x={ripple.x}
            y={ripple.y}
            onComplete={() => removeRipple(ripple.id)}
          />
        ))}
      </AnimatePresence>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{
          background: variant === 'primary'
            ? 'radial-gradient(circle at center, rgba(255,255,255,0.15), transparent 70%)'
            : 'radial-gradient(circle at center, var(--color-asics-accent)15, transparent 70%)',
        }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  );

  if (href) {
    return (
      <MagneticElement>
        <Link href={href}>
          <motion.span
            data-cursor="hover"
            whileHover={{
              scale: 1.05,
              boxShadow: variant === 'primary'
                ? '0 10px 30px -10px var(--color-asics-accent)'
                : '0 5px 15px -5px rgba(0,0,0,0.2)',
            }}
            whileTap={{
              scale: 0.95,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 17,
            }}
            className={combinedClassName}
          >
            {buttonContent}
          </motion.span>
        </Link>
      </MagneticElement>
    );
  }

  return (
    <MagneticElement>
      <motion.button
        ref={buttonRef}
        data-cursor="hover"
        whileHover={{
          scale: 1.05,
          boxShadow: variant === 'primary'
            ? '0 10px 30px -10px var(--color-asics-accent)'
            : '0 5px 15px -5px rgba(0,0,0,0.2)',
        }}
        whileTap={{
          scale: 0.92,
        }}
        animate={isPressed ? {
          scale: [1, 0.95, 1.02, 1],
        } : {}}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 17,
        }}
        className={combinedClassName}
        onClick={handleClick}
        {...props}
      >
        {buttonContent}
      </motion.button>
    </MagneticElement>
  );
}
