'use client';
import { motion } from 'framer-motion';
import { ElementType, ReactNode } from 'react';
import { EASE_OUT_EXPO, DUR_REVEAL, STAGGER_FAST } from '@/constants/animation';

interface TextRevealProps {
  children: ReactNode;
  as?: ElementType;
  mode?: 'clip' | 'word';
  stagger?: number;
  delay?: number;
  scrub?: boolean;
  className?: string;
}

export default function TextReveal({
  children,
  as: Tag = 'div',
  mode = 'clip',
  stagger,
  delay = 0,
  className = '',
}: TextRevealProps) {
  if (mode === 'clip') {
    return (
      <Tag className={className}>
        <span className="text-reveal-clip block">
          <motion.span
            className="block"
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true }}
            transition={{
              duration: DUR_REVEAL,
              delay,
              ease: EASE_OUT_EXPO as unknown as number[],
            }}
          >
            {children}
          </motion.span>
        </span>
      </Tag>
    );
  }

  // Word mode - split text content and animate each word
  const text = typeof children === 'string' ? children : '';
  const words = text.split(' ');
  const wordStagger = stagger ?? STAGGER_FAST;

  return (
    <Tag className={className} style={{ wordBreak: 'keep-all' }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: delay + i * wordStagger,
            ease: EASE_OUT_EXPO as unknown as number[],
          }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
