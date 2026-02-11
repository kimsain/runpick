'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { RunningShoe } from '@/types/shoe';
import Badge from '@/components/common/Badge';
import { getCategoryById } from '@/data/categories';
import { useRef } from 'react';

interface ShoeCardProps {
  shoe: RunningShoe;
  index?: number;
}

export default function ShoeCard({ shoe, index = 0 }: ShoeCardProps) {
  const category = getCategoryById(shoe.categoryId);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D tilt effect values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Link href={`/shoe/${shoe.slug}`}>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        whileHover={{ y: -8, scale: 1.02 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="group relative bg-[var(--color-card)] rounded-2xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-asics-accent)]/50 transition-all duration-300 cursor-pointer"
      >
        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(600px circle at ${x.get() * 100 + 50}% ${y.get() * 100 + 50}%, var(--color-asics-accent)10, transparent 40%)`,
          }}
        />

        {/* Image container */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-[var(--color-card)] to-[var(--color-card-hover)] overflow-hidden">
          <motion.div
            className="absolute inset-0 flex items-center justify-center p-6"
            style={{ transform: 'translateZ(50px)' }}
          >
            {/* Placeholder for shoe image */}
            <motion.div
              className="w-full h-full flex items-center justify-center text-6xl opacity-20"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
            >
              👟
            </motion.div>
          </motion.div>

          {/* Category badge */}
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="category" categoryId={shoe.categoryId}>
              {category?.icon} {category?.name}
            </Badge>
          </div>

          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>

        {/* Content */}
        <div className="p-4" style={{ transform: 'translateZ(20px)' }}>
          <h3 className="text-lg font-bold text-[var(--color-foreground)] group-hover:text-gradient transition-all duration-300">
            {shoe.name}
          </h3>
          <p className="mt-1 text-sm text-[var(--color-foreground)]/60 line-clamp-2">
            {shoe.shortDescription}
          </p>

          {/* Specs preview */}
          <div className="mt-3 flex items-center gap-4 text-xs text-[var(--color-foreground)]/50">
            <span className="flex items-center gap-1">
              <span className="text-[var(--color-asics-accent)]">⚖</span>
              {shoe.specs.weight}g
            </span>
            <span className="flex items-center gap-1">
              <span className="text-[var(--color-asics-accent)]">↕</span>
              {shoe.specs.drop}mm
            </span>
          </div>

          {/* Price */}
          <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
            <span className="text-lg font-bold text-gradient">
              {shoe.priceFormatted}
            </span>
            <motion.span
              className="text-sm text-[var(--color-asics-accent)] opacity-0 group-hover:opacity-100 transition-all"
              initial={{ x: -10, opacity: 0 }}
              whileHover={{ x: 0, opacity: 1 }}
            >
              자세히 보기 →
            </motion.span>
          </div>
        </div>

        {/* Corner glow */}
        <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-[var(--color-asics-accent)]/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Border glow */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: '0 0 20px var(--color-asics-accent)20, inset 0 0 20px var(--color-asics-accent)10',
          }}
        />
      </motion.div>
    </Link>
  );
}
