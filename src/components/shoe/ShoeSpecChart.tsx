'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoeSpecs } from '@/types/shoe';

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
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const springValue = useSpring(0, { stiffness: 100, damping: 30 });
  const display = useTransform(springValue, (v) => Math.round(v));
  const [displayNum, setDisplayNum] = useState(0);

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, springValue, value]);

  useEffect(() => {
    const unsubscribe = display.on('change', (v) => setDisplayNum(v));
    return unsubscribe;
  }, [display]);

  return (
    <div className="space-y-1" ref={ref}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--color-foreground)]/70">{label}</span>
        <span className="font-medium text-[var(--color-foreground)]">
          {displayNum}/{max}
        </span>
      </div>
      <div className="h-2.5 bg-[var(--color-card)] rounded-full overflow-hidden">
        <div
          className="spec-bar-fill h-full rounded-full origin-left"
          style={{
            background: 'linear-gradient(90deg, var(--color-asics-blue), var(--color-asics-accent))',
            boxShadow: '0 0 8px var(--color-asics-accent), 0 0 16px rgba(0, 209, 255, 0.3)',
            transform: 'scaleX(0)',
            ['--target-scale' as string]: value / max,
          }}
          data-value={value / max}
        />
      </div>
    </div>
  );
}

export default function ShoeSpecChart({ specs, animated = false }: ShoeSpecChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.innerWidth < 768) return;
    gsap.registerPlugin(ScrollTrigger);

    const bars = containerRef.current?.querySelectorAll('.spec-bar-fill');
    const triggers: ScrollTrigger[] = [];

    bars?.forEach((bar) => {
      const targetScale = (bar as HTMLElement).dataset.value || '1';

      if (animated) {
        // Immediate animation without ScrollTrigger (for quiz results already in viewport)
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: parseFloat(targetScale),
            duration: 1,
            delay: 0.3,
            ease: 'power2.out',
          }
        );
      } else {
        // ScrollTrigger-based animation (for detail pages)
        const tl = gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: parseFloat(targetScale),
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: bar,
              start: 'top 90%',
              end: 'top 60%',
              scrub: 1,
            },
          }
        );
        if (tl.scrollTrigger) {
          triggers.push(tl.scrollTrigger);
        }
      }
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [animated]);

  const specItems = [
    { label: '쿠셔닝', value: specs.cushioning },
    { label: '반발력', value: specs.responsiveness },
    { label: '안정성', value: specs.stability },
    { label: '내구성', value: specs.durability },
  ];

  return (
    <div className="space-y-6" ref={containerRef}>
      {/* Spec bars */}
      <div className="space-y-4">
        {specItems.map((item) => (
          <SpecBar
            key={item.label}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>

      {/* Quick stats */}
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <p className="text-xs text-[var(--color-foreground)]/50">{label}</p>
      <p className="mt-1 text-sm font-bold text-[var(--color-asics-accent)]">{value}</p>
    </motion.div>
  );
}
