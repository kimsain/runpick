'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

  return (
    <div
      ref={barRef}
      className="scroll-progress-bar fixed top-0 left-0 right-0 h-[2px] z-[9991] origin-left"
      style={{
        background: 'linear-gradient(90deg, var(--color-asics-blue), var(--color-asics-accent))',
        willChange: 'transform',
      }}
    />
  );
}
