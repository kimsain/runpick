'use client';

import { motion, useReducedMotion, HTMLMotionProps, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useCallback, useRef } from 'react';
import MagneticElement from '@/components/effects/MagneticElement';
import { useIsDesktop } from '@/hooks/useIsDesktop';

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
  const animateEnabled = !useReducedMotion();
  const isDesktop = useIsDesktop();
  const enableRichMotion = animateEnabled && isDesktop;

  const baseStyles = `
    inline-flex items-center justify-center gap-2
    rounded-full font-medium
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-[var(--color-asics-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)]
    relative overflow-hidden
  `;

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;
  const isExternalHref = typeof href === 'string' && /^(https?:)?\/\//.test(href);
  const isDisabled = Boolean(props.disabled);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (enableRichMotion) {
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
    }

    if (onClick) {
      onClick(e);
    }
  }, [enableRichMotion, onClick]);

  const removeRipple = useCallback((id: number) => {
    setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
  }, []);

  const hoverTransition = enableRichMotion
    ? {
      type: 'spring' as const,
      stiffness: 400,
      damping: 17,
    }
    : undefined;

  const hoverAnimation = enableRichMotion
    ? {
      scale: 1.05,
      boxShadow:
        variant === 'primary'
          ? '0 10px 30px -10px var(--color-asics-accent)'
          : '0 5px 15px -5px rgba(0,0,0,0.2)',
    }
    : undefined;

  const buttonContent = (
    <>
      <AnimatePresence>
        {enableRichMotion &&
          ripples.map((ripple) => (
            <Ripple
              key={ripple.id}
              x={ripple.x}
              y={ripple.y}
              onComplete={() => removeRipple(ripple.id)}
            />
          ))}
      </AnimatePresence>

      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        initial={animateEnabled ? { opacity: 0 } : { opacity: 0 }}
        whileHover={enableRichMotion ? { opacity: 1 } : undefined}
        style={{
          background: variant === 'primary'
            ? 'radial-gradient(circle at center, rgba(255,255,255,0.15), transparent 70%)'
            : 'radial-gradient(circle at center, var(--color-asics-accent)15, transparent 70%)',
        }}
      />

      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  );

  if (href) {
    if (isExternalHref) {
      return (
        <MagneticElement>
          <motion.a
            data-cursor="hover"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={hoverAnimation}
            whileTap={enableRichMotion ? { scale: 0.95 } : undefined}
            transition={hoverTransition}
            className={combinedClassName}
          >
            {buttonContent}
          </motion.a>
        </MagneticElement>
      );
    }

    return (
      <MagneticElement>
        <Link href={href}>
          <motion.span
            data-cursor="hover"
            whileHover={hoverAnimation}
            whileTap={enableRichMotion ? { scale: 0.95 } : undefined}
            transition={hoverTransition}
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
        whileHover={isDisabled ? undefined : hoverAnimation}
        whileTap={isDisabled || !enableRichMotion ? undefined : { scale: 0.92 }}
        animate={animateEnabled && isPressed ? { scale: [1, 0.95, 1.02, 1] } : {}}
        transition={hoverTransition}
        className={combinedClassName}
        onClick={isDisabled ? undefined : handleClick}
        {...props}
      >
        {buttonContent}
      </motion.button>
    </MagneticElement>
  );
}
