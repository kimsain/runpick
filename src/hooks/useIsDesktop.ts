'use client';

// Standard GSAP/Lenis guard hook. One-shot check, no resize listener, SSR-safe.
// Used in 11+ components. Pattern: if (!isDesktop) return; in useEffect.
// See mobile-optimization skill for full checklist.

import { useState, useEffect } from 'react';
import { MOBILE_BREAKPOINT } from '@/constants/animation';
export function useIsDesktop(breakpoint = MOBILE_BREAKPOINT): boolean {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    setIsDesktop(window.innerWidth >= breakpoint);
  }, [breakpoint]);
  return isDesktop;
}
