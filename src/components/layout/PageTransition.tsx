'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { DUR_TRANSITION, EASE_IN_OUT_QUART } from '@/constants/animation';
import { useIsDesktop } from '@/hooks/useIsDesktop';

interface PageTransitionProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: {
    clipPath: 'circle(0% at 50% 50%)',
    opacity: 0,
  },
  enter: {
    clipPath: 'circle(100% at 50% 50%)',
    opacity: 1,
    transition: {
      clipPath: {
        duration: DUR_TRANSITION,
        ease: EASE_IN_OUT_QUART as unknown as number[],
      },
      opacity: {
        duration: 0.3,
      },
    },
  },
  exit: {
    clipPath: 'circle(0% at 50% 50%)',
    opacity: 0,
    transition: {
      clipPath: {
        duration: DUR_TRANSITION,
        ease: EASE_IN_OUT_QUART as unknown as number[],
      },
      opacity: {
        duration: 0.3,
        delay: DUR_TRANSITION - 0.3,
      },
    },
  },
};

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const isDesktop = useIsDesktop();

  if (!isDesktop) {
    return <div key={pathname}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
