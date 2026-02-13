'use client';

// Lenis smooth scroll wrapper. Desktop only (useIsDesktop guard).
// Syncs with GSAP ticker for frame-perfect ScrollTrigger compatibility.
// Mobile uses native scroll — this component renders children only.
// Scroll position resets on pathname change (no key-based remount needed).

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { useReducedMotion } from 'framer-motion';

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
    addEventListener?: (type: string, listener: EventListenerOrEventListenerObject) => void;
    removeEventListener?: (type: string, listener: EventListenerOrEventListenerObject) => void;
  };
};

const LOW_POWER_CONNECTION_TYPES = new Set(['slow-2g', '2g']);

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const isDesktop = useIsDesktop();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const navConnection = (navigator as NavigatorWithConnection).connection;

    const checkEnabled = () => {
      const isCoarsePointer =
        window.matchMedia('(hover: none), (pointer: coarse)').matches || 'ontouchstart' in window;
      const isSaveData = Boolean(navConnection?.saveData) ||
        (navConnection?.effectiveType
          ? LOW_POWER_CONNECTION_TYPES.has(navConnection.effectiveType)
          : false);
      setIsEnabled(!isDesktop || reduceMotion ? false : !isCoarsePointer && !isSaveData);
    };

    checkEnabled();
    window.addEventListener('resize', checkEnabled);
    navConnection?.addEventListener?.('change', checkEnabled);

    return () => {
      window.removeEventListener('resize', checkEnabled);
      navConnection?.removeEventListener?.('change', checkEnabled);
    };
  }, [isDesktop, reduceMotion]);

  useEffect(() => {
    if (!isEnabled) return; // Mobile or reduced-motion: native scroll

    gsap.registerPlugin(ScrollTrigger);

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
