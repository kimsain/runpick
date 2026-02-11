'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      when: 'beforeChildren',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Wipe transition overlay
const wipeVariants = {
  initial: {
    scaleX: 0,
    transformOrigin: 'left',
  },
  animate: {
    scaleX: [0, 1, 1, 0],
    transformOrigin: ['left', 'left', 'right', 'right'],
    transition: {
      duration: 0.8,
      times: [0, 0.4, 0.6, 1],
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    scaleX: 0,
  },
};

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
      >
        {/* Wipe overlay effect */}
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, var(--color-asics-blue) 0%, var(--color-asics-accent) 100%)',
          }}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={wipeVariants}
        />

        {children}
      </motion.div>
    </AnimatePresence>
  );
}
