'use client';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[9991] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, var(--color-asics-blue), var(--color-asics-accent))',
        boxShadow: '0 0 10px var(--color-asics-accent), 0 0 5px var(--color-asics-accent)',
      }}
    />
  );
}
