'use client';

// Root client wrapper. Composes global effects: grain overlay, scroll progress,
// custom cursor, Lenis smooth scroll, and page transitions.
// Mounted in layout.tsx (Server Component) -> LayoutClient (Client Component).

import { usePathname } from 'next/navigation';
import SmoothScroll from './SmoothScroll';
import CustomCursor from './CustomCursor';
import PageTransition from './PageTransition';
import GrainOverlay from '@/components/effects/GrainOverlay';
import ScrollProgress from '@/components/effects/ScrollProgress';

interface LayoutClientProps {
  children: React.ReactNode;
}

export default function LayoutClient({ children }: LayoutClientProps) {
  const pathname = usePathname();

  return (
    <>
      <GrainOverlay />
      <ScrollProgress />
      <CustomCursor />
      <SmoothScroll key={pathname}>
        <PageTransition>
          {children}
        </PageTransition>
      </SmoothScroll>
    </>
  );
}
