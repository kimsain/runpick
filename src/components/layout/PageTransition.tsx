'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useIsDesktop } from '@/hooks/useIsDesktop';

interface PageTransitionProps {
  children: React.ReactNode;
}

// Note: SmoothScroll key={pathname} already unmounts/remounts the entire tree,
// so exit animations never run. Using opacity-only to avoid Framer Motion's
// clipPath interpolation error on detached DOM elements.
const pageVariants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
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
