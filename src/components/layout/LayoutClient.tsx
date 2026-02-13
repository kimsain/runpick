'use client';

// Root client wrapper. Composes global effects: grain overlay, scroll progress,
// custom cursor, Lenis smooth scroll, and page transitions.
// Mounted in layout.tsx (Server Component) -> LayoutClient (Client Component).

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import SmoothScroll from './SmoothScroll';
import PageTransition from './PageTransition';

const GrainOverlay = dynamic(() => import('@/components/effects/GrainOverlay'), {
  ssr: false,
});
const ScrollProgress = dynamic(() => import('@/components/effects/ScrollProgress'), {
  ssr: false,
});
const CustomCursor = dynamic(() => import('./CustomCursor'), {
  ssr: false,
});

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
