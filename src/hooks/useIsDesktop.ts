'use client';

import { useState, useEffect } from 'react';
import { MOBILE_BREAKPOINT } from '@/constants/animation';

/** One-shot desktop check. GSAP guard용 (resize 미반응, 기존 동작과 동일). */
export function useIsDesktop(breakpoint = MOBILE_BREAKPOINT): boolean {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    setIsDesktop(window.innerWidth >= breakpoint);
  }, [breakpoint]);
  return isDesktop;
}
