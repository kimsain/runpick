import { useEffect, useRef, useState } from 'react';

interface UseScrollVisibilityOptions {
  enabled: boolean;
}

interface UseScrollVisibilityResult {
  isScrolled: boolean;
  isHidden: boolean;
}

const HIDE_THRESHOLD = 20;

export function useScrollVisibility({
  enabled,
}: UseScrollVisibilityOptions): UseScrollVisibilityResult {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const rafPending = useRef(false);
  const rafId = useRef<number | null>(null);
  const isHiddenRef = useRef(false);
  const isScrolledRef = useRef(false);

  const syncState = (currentY: number) => {
    const isDown = currentY > lastScrollY.current;
    const nextIsScrolled = currentY > HIDE_THRESHOLD;
    const nextIsHidden = isDown && nextIsScrolled;

    if (nextIsScrolled !== isScrolledRef.current) {
      isScrolledRef.current = nextIsScrolled;
      setIsScrolled(nextIsScrolled);
    }
    if (nextIsHidden !== isHiddenRef.current) {
      isHiddenRef.current = nextIsHidden;
      setIsHidden(nextIsHidden);
    }

    lastScrollY.current = currentY;
    rafPending.current = false;
    rafId.current = null;
  };

  const reset = () => {
    if (isHiddenRef.current || isScrolledRef.current || lastScrollY.current !== 0) {
      isHiddenRef.current = false;
      isScrolledRef.current = false;
      lastScrollY.current = 0;
      setIsHidden(false);
      setIsScrolled(false);
    }
    if (rafId.current != null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    rafPending.current = false;
  };

  useEffect(() => {
    if (!enabled) {
      reset();
      return;
    }

    lastScrollY.current = window.scrollY;
    syncState(lastScrollY.current);

    const handleScroll = () => {
      if (rafPending.current) return;
      rafPending.current = true;

      rafId.current = requestAnimationFrame(() => {
        syncState(window.scrollY);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      reset();
    };
  }, [enabled]);

  return { isScrolled, isHidden };
}
