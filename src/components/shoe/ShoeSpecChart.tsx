'use client';

// Spec bar chart (cushioning, responsiveness, stability, durability).
// Desktop: GSAP scaleX animation (scroll-triggered or immediate when animated=true).
// Mobile: CSS fallback driven by --target-scale variable.

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoeSpecs } from '@/types/shoe';
import { useIsDesktop } from '@/hooks/useIsDesktop';

interface ShoeSpecChartProps {
  specs: ShoeSpecs;
  animated?: boolean;
}

interface SpecBarProps {
  label: string;
  value: number;
  max?: number;
}

function SpecBar({ label, value, max = 10 }: SpecBarProps) {
  const targetScale = Math.max(0, Math.min(1, value / max));

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--color-foreground)]/70">{label}</span>
        <span className="font-medium text-[var(--color-foreground)]">{value}/{max}</span>
      </div>
      <div className="h-2.5 bg-[var(--color-card)] rounded-full overflow-hidden">
        <div
          className="spec-bar-fill h-full rounded-full origin-left"
          style={{
            background: 'linear-gradient(90deg, var(--color-asics-blue), var(--color-asics-accent))',
            boxShadow: '0 0 8px var(--color-asics-accent), 0 0 16px rgba(0, 209, 255, 0.3)',
            transform: 'scaleX(0)',
            ['--target-scale' as string]: targetScale,
          }}
          data-target-scale={targetScale}
        />
      </div>
    </div>
  );
}

export default function ShoeSpecChart({ specs, animated = false }: ShoeSpecChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (!isDesktop || !containerRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const bars = Array.from(containerRef.current.querySelectorAll('.spec-bar-fill')) as HTMLDivElement[];
    const triggers: ScrollTrigger[] = [];

    bars.forEach((bar, index) => {
      const targetScale = parseFloat(bar.dataset.targetScale || '0');

      const tween = gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: targetScale,
          duration: 0.8,
          delay: animated ? index * 0.06 : 0,
          ease: 'power2.out',
          ...(animated
            ? {}
            : {
                scrollTrigger: {
                  trigger: bar,
                  start: 'top 90%',
                  toggleActions: 'play none none none',
                },
              }),
        }
      );

      if (!animated && tween.scrollTrigger) {
        triggers.push(tween.scrollTrigger);
      }
    });

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [animated, isDesktop]);

  const specItems = [
    { label: '쿠셔닝', value: specs.cushioning },
    { label: '반발력', value: specs.responsiveness },
    { label: '안정성', value: specs.stability },
    { label: '내구성', value: specs.durability },
  ];

  return (
    <div className="space-y-6" ref={containerRef}>
      <div className="space-y-4">
        {specItems.map((item) => (
          <SpecBar key={item.label} label={item.label} value={item.value} />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[var(--color-border)]">
        <QuickStat label="무게" value={`${specs.weight}g`} />
        <QuickStat label="드롭" value={`${specs.drop}mm`} />
        <QuickStat
          label="스택"
          value={`${specs.stackHeight.heel}/${specs.stackHeight.forefoot}mm`}
        />
      </div>
    </div>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-xs text-[var(--color-foreground)]/50">{label}</p>
      <p className="mt-1 text-sm font-bold text-[var(--color-asics-accent)]">{value}</p>
    </div>
  );
}
