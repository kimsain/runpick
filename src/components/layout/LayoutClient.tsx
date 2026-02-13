'use client';

// Root client wrapper. Composes global effects: grain overlay, scroll progress,
// custom cursor, Lenis smooth scroll, and page transitions.
// Mounted in layout.tsx (Server Component) -> LayoutClient (Client Component).

import SmoothScroll from './SmoothScroll';
import CustomCursor from './CustomCursor';
import PageTransition from './PageTransition';
import GrainOverlay from '@/components/effects/GrainOverlay';
import ScrollProgress from '@/components/effects/ScrollProgress';

interface LayoutClientProps {
  children: React.ReactNode;
}

export default function LayoutClient({ children }: LayoutClientProps) {
  return (
    <>
      <GrainOverlay />
      <ScrollProgress />
      <CustomCursor />
      <SmoothScroll>
        <PageTransition>
          {children}
        </PageTransition>
      </SmoothScroll>
    </>
  );
}
