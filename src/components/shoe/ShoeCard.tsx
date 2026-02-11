'use client';

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { RunningShoe } from '@/types/shoe';
import Badge from '@/components/common/Badge';
import { getCategoryById } from '@/data/categories';
import { useRef, useState, useCallback } from 'react';

interface ShoeCardProps {
  shoe: RunningShoe;
  index?: number;
}

// Sparkle component for shimmer effect
function Sparkle({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 1.5, opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="absolute pointer-events-none"
      style={{
        left: x - 10,
        top: y - 10,
        width: 20,
        height: 20,
        background: 'radial-gradient(circle, var(--color-asics-accent) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(2px)',
      }}
    />
  );
}

export default function ShoeCard({ shoe, index = 0 }: ShoeCardProps) {
  const category = getCategoryById(shoe.categoryId);
  const cardRef = useRef<HTMLDivElement>(null);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const sparkleIdRef = useRef(0);

  // 3D tilt effect values - enhanced responsiveness
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // More responsive springs
  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 25 });

  // Enhanced tilt range
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg']);

  // Glow position follows mouse
  const glowX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glowY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const currentMouseX = e.clientX - rect.left;
    const currentMouseY = e.clientY - rect.top;
    const xPct = currentMouseX / width - 0.5;
    const yPct = currentMouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
    mouseX.set(currentMouseX);
    mouseY.set(currentMouseY);

    // Add sparkles occasionally
    if (Math.random() > 0.85) {
      const newSparkle = {
        id: sparkleIdRef.current++,
        x: currentMouseX,
        y: currentMouseY,
      };
      setSparkles((prev) => [...prev.slice(-5), newSparkle]);
      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
      }, 600);
    }
  }, [x, y, mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
    setSparkles([]);
  }, [x, y]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  return (
    <Link href={`/shoe/${shoe.slug}`}>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        whileHover={{
          y: -12,
          scale: 1.03,
          transition: {
            type: 'spring',
            stiffness: 400,
            damping: 20
          }
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="group relative bg-[var(--color-card)] rounded-2xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-asics-accent)]/60 transition-colors duration-300 cursor-pointer"
      >
        {/* Dynamic glow effect that follows mouse */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(400px circle at var(--glow-x) var(--glow-y), var(--color-asics-accent)25, var(--color-asics-blue)10, transparent 50%)`,
            ['--glow-x' as string]: glowX,
            ['--glow-y' as string]: glowY,
          }}
        />

        {/* Sparkles container */}
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          <AnimatePresence>
            {sparkles.map((sparkle) => (
              <Sparkle key={sparkle.id} x={sparkle.x} y={sparkle.y} />
            ))}
          </AnimatePresence>
        </div>

        {/* Pulse ring effect on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0.5, 0], scale: [0.8, 1.2] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="absolute inset-0 rounded-2xl border-2 border-[var(--color-asics-accent)] pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Image container */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-[var(--color-card)] to-[var(--color-card-hover)] overflow-hidden">
          <motion.div
            className="absolute inset-0 flex items-center justify-center p-6"
            style={{ transform: 'translateZ(50px)' }}
          >
            {/* Placeholder for shoe image with bounce effect */}
            <motion.div
              className="w-full h-full flex items-center justify-center text-6xl opacity-20"
              animate={isHovered ? {
                scale: [1, 1.15, 1.1],
                rotate: [0, -3, 3, 0],
              } : { scale: 1, rotate: 0 }}
              transition={{
                duration: 0.5,
                type: 'spring',
                stiffness: 300,
                damping: 15,
              }}
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

          {/* Enhanced shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ x: '-100%' }}
            animate={isHovered ? { x: '100%' } : { x: '-100%' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />

          {/* Secondary diagonal shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-transparent via-[var(--color-asics-accent)]/5 to-transparent"
            initial={{ opacity: 0 }}
            animate={isHovered ? { opacity: [0, 1, 0] } : { opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          />
        </div>

        {/* Content */}
        <div className="p-4" style={{ transform: 'translateZ(20px)' }}>
          <motion.h3
            className="text-lg font-bold text-[var(--color-foreground)] group-hover:text-gradient transition-all duration-300"
            animate={isHovered ? { x: [0, 2, 0] } : { x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {shoe.name}
          </motion.h3>
          <p className="mt-1 text-sm text-[var(--color-foreground)]/60 line-clamp-2">
            {shoe.shortDescription}
          </p>

          {/* Specs preview with subtle animation */}
          <motion.div
            className="mt-3 flex items-center gap-4 text-xs text-[var(--color-foreground)]/50"
            animate={isHovered ? { x: [0, 3, 0] } : { x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span className="flex items-center gap-1">
              <motion.span
                className="text-[var(--color-asics-accent)]"
                animate={isHovered ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                ⚖
              </motion.span>
              {shoe.specs.weight}g
            </span>
            <span className="flex items-center gap-1">
              <motion.span
                className="text-[var(--color-asics-accent)]"
                animate={isHovered ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                ↕
              </motion.span>
              {shoe.specs.drop}mm
            </span>
          </motion.div>

          {/* Price */}
          <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
            <motion.span
              className="text-lg font-bold text-gradient"
              animate={isHovered ? { scale: [1, 1.05, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {shoe.priceFormatted}
            </motion.span>
            <motion.span
              className="text-sm text-[var(--color-asics-accent)]"
              initial={{ x: -10, opacity: 0 }}
              animate={isHovered ? { x: 0, opacity: 1 } : { x: -10, opacity: 0 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
            >
              자세히 보기 →
            </motion.span>
          </div>
        </div>

        {/* Enhanced corner glow with color shift */}
        <motion.div
          className="absolute -bottom-4 -right-4 w-32 h-32 blur-3xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, var(--color-asics-accent), var(--color-asics-blue))',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isHovered ? {
            opacity: 0.4,
            scale: 1,
          } : {
            opacity: 0,
            scale: 0.8
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Top left corner glow */}
        <motion.div
          className="absolute -top-4 -left-4 w-24 h-24 blur-2xl pointer-events-none"
          style={{
            background: 'var(--color-asics-accent)',
          }}
          initial={{ opacity: 0 }}
          animate={isHovered ? { opacity: 0.2 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />

        {/* Enhanced border glow with pulsing effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={isHovered ? {
            opacity: 1,
            boxShadow: [
              '0 0 20px var(--color-asics-accent)30, inset 0 0 20px var(--color-asics-accent)10',
              '0 0 30px var(--color-asics-accent)40, inset 0 0 25px var(--color-asics-accent)15',
              '0 0 20px var(--color-asics-accent)30, inset 0 0 20px var(--color-asics-accent)10',
            ]
          } : {
            opacity: 0
          }}
          transition={{
            opacity: { duration: 0.3 },
            boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
          }}
        />

        {/* Ripple effect on card interaction */}
        <motion.div
          className="absolute inset-0 bg-[var(--color-asics-accent)]/5 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={isHovered ? {
            opacity: [0, 0.3, 0],
          } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>
    </Link>
  );
}
