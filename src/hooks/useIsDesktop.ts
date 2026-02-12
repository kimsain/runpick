'use client';

import { useState, useEffect } from 'react';
import { MOBILE_BREAKPOINT } from '@/constants/animation';

/** One-shot desktop check. GSAP guard용 (resize 미반응, 기존 동작과 동일). */
export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    setIsDesktop(window.innerWidth >= MOBILE_BREAKPOINT);
  }, []);
  return isDesktop;
}
