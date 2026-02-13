'use client';
import { useEffect, useRef, useState } from 'react';
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

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const reduceMotion = useReducedMotion();
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const conn = (navigator as NavigatorWithConnection).connection;
    const checkEnabled = () => {
      const isCoarsePointer =
        window.matchMedia('(hover: none), (pointer: coarse)').matches || 'ontouchstart' in window;
      const isSaveData = Boolean(conn?.saveData) ||
        (conn?.effectiveType ? LOW_POWER_CONNECTION_TYPES.has(conn.effectiveType) : false);

      setIsEnabled(!isDesktop || reduceMotion ? false : !isCoarsePointer && !isSaveData);
    };

    checkEnabled();
    window.addEventListener('resize', checkEnabled);
    conn?.addEventListener?.('change', checkEnabled);

    return () => {
      window.removeEventListener('resize', checkEnabled);
      conn?.removeEventListener?.('change', checkEnabled);
    };
  }, [isDesktop, reduceMotion]);

  useEffect(() => {
    if (!isEnabled) return;
    gsap.registerPlugin(ScrollTrigger);
    const bar = barRef.current;
    if (!bar) return;

    gsap.set(bar, { scaleX: 0 });
    const trigger = ScrollTrigger.create({
      start: 'top top',
      end: 'max',
      scrub: 0,
      onUpdate: (self) => { gsap.set(bar, { scaleX: self.progress }); },
    });

    return () => { trigger.kill(); };
  }, [isEnabled]);

  return (
    <div
      ref={barRef}
      className="scroll-progress-bar fixed top-0 left-0 right-0 h-[2px] z-[9991] origin-left hidden md:block"
      style={{
        background: 'linear-gradient(90deg, var(--color-asics-blue), var(--color-asics-accent))',
      }}
    />
  );
}
