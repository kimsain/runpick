'use client';

import { motion } from 'framer-motion';
import { ShoeSpecs } from '@/types/shoe';

interface ShoeSpecChartProps {
  specs: ShoeSpecs;
}

interface SpecBarProps {
  label: string;
  value: number;
  max?: number;
  delay?: number;
}

function SpecBar({ label, value, max = 10, delay = 0 }: SpecBarProps) {
  const percentage = (value / max) * 100;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--color-foreground)]/70">{label}</span>
        <span className="font-medium text-[var(--color-foreground)]">
          {value}/{max}
        </span>
      </div>
      <div className="h-2 bg-[var(--color-card)] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-asics-blue)] to-[var(--color-asics-accent)]"
        />
      </div>
    </div>
  );
}

export default function ShoeSpecChart({ specs }: ShoeSpecChartProps) {
  const specItems = [
    { label: '쿠셔닝', value: specs.cushioning },
    { label: '반발력', value: specs.responsiveness },
    { label: '안정성', value: specs.stability },
    { label: '내구성', value: specs.durability },
  ];

  return (
    <div className="space-y-6">
      {/* Spec bars */}
      <div className="space-y-4">
        {specItems.map((item, index) => (
          <SpecBar
            key={item.label}
            label={item.label}
            value={item.value}
            delay={index * 0.1}
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
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <p className="text-xs text-[var(--color-foreground)]/50">{label}</p>
      <p className="mt-1 text-sm font-bold text-[var(--color-asics-accent)]">{value}</p>
    </motion.div>
  );
}
