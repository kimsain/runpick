'use client';

// Lenis smooth scroll wrapper. Desktop only (useIsDesktop guard).
// Syncs with GSAP ticker for frame-perfect ScrollTrigger compatibility.
// Mobile uses native scroll — this component renders children only.
// Scroll position resets on pathname change (no key-based remount needed).

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, ensureScrollTriggerRegistration } from '@/lib/scroll-trigger';
import { useInteractionCapabilities } from '@/hooks/useInteractionCapabilities';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const { isDesktop, hasMotionBudget } = useInteractionCapabilities();
  const pathname = usePathname();
  const isEnabled = isDesktop && hasMotionBudget;

  useEffect(() => {
    if (!isEnabled) return; // Mobile or reduced-motion: native scroll

    ensureScrollTriggerRegistration();

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Sync Lenis scroll events with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP ticker instead of separate rAF for frame-perfect sync
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isEnabled]);

  // Reset scroll position on route change without destroying the tree
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return <>{children}</>;
}
