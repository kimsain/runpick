'use client';

import { motion } from 'framer-motion';

interface SparkleProps {
  delay: number;
  x: string;
  y: string;
  size?: number;
  opacity?: number;
  duration?: number;
  repeatDelay?: number;
}

export default function Sparkle({
  delay,
  x,
  y,
  size = 14,
  opacity = 0.5,
  duration = 2.5,
  repeatDelay = 3,
}: SparkleProps) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0, 1, 0],
        rotate: [0, 180],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z"
          fill="var(--color-asics-accent)"
          opacity={opacity}
        />
      </svg>
    </motion.div>
  );
}
