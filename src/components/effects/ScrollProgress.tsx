'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { useInteractionCapabilities } from '@/hooks/useInteractionCapabilities';

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const { hasMotionBudget } = useInteractionCapabilities();
  const isEnabled = isDesktop && hasMotionBudget;

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
        opacity: isEnabled ? 1 : 0,
        background: 'linear-gradient(90deg, var(--color-asics-blue), var(--color-asics-accent))',
      }}
    />
  );
}
