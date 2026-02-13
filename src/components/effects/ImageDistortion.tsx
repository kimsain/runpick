'use client';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { useState, ReactNode } from 'react';
import { useInteractionCapabilities } from '@/hooks/useInteractionCapabilities';

interface ImageDistortionProps {
  children: ReactNode;
  variant?: 'scan' | 'glow';
  enabled?: boolean;
}

export default function ImageDistortion({
  children,
  variant = 'scan',
  enabled = true,
}: ImageDistortionProps) {
  const animateEnabled = !useReducedMotion();
  const { hasMotionBudget } = useInteractionCapabilities();
  const isMotionEnabled = animateEnabled && enabled && hasMotionBudget;
  const [isHovered, setIsHovered] = useState(false);

  if (!isMotionEnabled) {
    return <div className="relative overflow-hidden">{children}</div>;
  }

  return (
    <motion.div
      className="relative overflow-hidden"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Base content */}
      <motion.div
        animate={isHovered ? {
          filter: 'contrast(1.1) brightness(1.05)',
        } : {
          filter: 'contrast(1) brightness(1)',
        }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>

      {/* Scan line effect */}
      {variant === 'scan' && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(0, 209, 255, 0.1) 50%, transparent 100%)',
            height: '30%',
          }}
          initial={{ top: '-30%' }}
          animate={isHovered ? { top: '130%' } : { top: '-30%' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      )}

      {/* Glow variant */}
      {variant === 'glow' && isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'radial-gradient(circle at center, var(--color-asics-accent)30, transparent 70%)',
          }}
        />
      )}
    </motion.div>
  );
}
