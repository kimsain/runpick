'use client';

import { useState, useEffect } from 'react';
import { MOBILE_BREAKPOINT } from '@/constants/animation';

export function useIsDesktop(breakpoint = MOBILE_BREAKPOINT): boolean {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);
    const sync = () => setIsDesktop(mediaQuery.matches);

    sync();
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', sync);
    } else {
      mediaQuery.addListener(sync);
    }
    window.addEventListener('orientationchange', sync);

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', sync);
      } else {
        mediaQuery.removeListener(sync);
      }
      window.removeEventListener('orientationchange', sync);
    };
  }, [breakpoint]);

  return isDesktop;
}
