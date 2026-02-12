'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsDesktop } from '@/hooks/useIsDesktop';

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (!isDesktop) return;
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
  }, [isDesktop]);

  return (
    <div
      ref={barRef}
      className="scroll-progress-bar fixed top-0 left-0 right-0 h-[2px] z-[9991] origin-left hidden md:block"
      style={{
        background: 'linear-gradient(90deg, var(--color-asics-blue), var(--color-asics-accent))',
        willChange: 'transform',
      }}
    />
  );
}
