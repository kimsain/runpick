'use client';

// Reusable shoe card with 3D tilt effect (desktop only, max 6deg).
// Shows: image, category badge, name, shortDescription, top 2 specs, price.
// Desktop: ImageDistortion + mouse-follow glow. Mobile: static card.

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { RunningShoe, ShoeSpecs } from '@/types/shoe';
import Badge from '@/components/common/Badge';
import { getCategoryById } from '@/data/categories';
import { hasShoeImage } from '@/data/image-manifest';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import ImageDistortion from '@/components/effects/ImageDistortion';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import SmartShoeImage from '@/components/common/SmartShoeImage';
import { useInteractionCapabilities } from '@/hooks/useInteractionCapabilities';

interface ShoeCardProps {
  shoe: RunningShoe;
  index?: number;
}

const SPEC_LABELS: Record<string, string> = {
  cushioning: '쿠셔닝',
  responsiveness: '반발력',
  stability: '안정성',
  durability: '내구성',
};

function getTopSpecs(specs: ShoeSpecs): { key: string; label: string; value: number }[] {
  const entries = [
    { key: 'cushioning', value: specs.cushioning },
    { key: 'responsiveness', value: specs.responsiveness },
    { key: 'stability', value: specs.stability },
    { key: 'durability', value: specs.durability },
  ];
  return entries
    .sort((a, b) => b.value - a.value)
    .slice(0, 2)
    .map((e) => ({ ...e, label: SPEC_LABELS[e.key] }));
}

function SpecDotBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="type-caption text-[var(--color-foreground)]/50 w-14 shrink-0 whitespace-nowrap">
        {label}
      </span>
      <div className="flex gap-[2px]">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="w-[6px] h-[6px] rounded-[1px]"
            style={{
              background: i < value
                ? 'var(--color-asics-accent)'
                : 'var(--color-border)',
              opacity: i < value ? 1 : 0.4,
            }}
          />
        ))}
      </div>
      <span className="type-caption font-medium text-[var(--color-foreground)]/60 w-4 text-right">{value}</span>
    </div>
  );
}

function ShoeCardDecorations({ isHovered, isMotionEnabled }: { isHovered: boolean; isMotionEnabled: boolean }) {
  if (!isMotionEnabled) return null;

  return (
    <motion.div
      className="absolute -bottom-4 -right-4 w-32 h-32 blur-3xl pointer-events-none hidden md:block"
      style={{
        background: 'linear-gradient(135deg, var(--color-asics-accent), var(--color-asics-blue))',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isHovered ? { opacity: 0.4, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4 }}
    />
  );
}

function ShoeCardImage({ shoe, category, index, isHovered, isMotionEnabled }: {
  shoe: RunningShoe;
  category: ReturnType<typeof getCategoryById>;
  index: number;
  isHovered: boolean;
  isMotionEnabled: boolean;
}) {
  if (!isMotionEnabled) {
    return (
      <div className="relative aspect-[4/3] bg-gradient-to-br from-[var(--color-card)] to-[var(--color-card-hover)] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="relative w-full h-full">
            <SmartShoeImage
              src={shoe.imageUrl}
              alt={shoe.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain drop-shadow-2xl"
              priority={index < 3}
              showFallbackBadge
              forceFallback={!hasShoeImage(shoe.imageUrl)}
              fallbackBadgeLabel={`${shoe.brandId.toUpperCase()} 이미지 준비중`}
            />
          </div>
        </div>

        <div className="absolute top-3 left-3 z-10">
          <Badge variant="category" categoryId={shoe.categoryId}>
            {category?.icon} {category?.name}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] bg-gradient-to-br from-[var(--color-card)] to-[var(--color-card-hover)] overflow-hidden">
      <motion.div
        className="absolute inset-0 flex items-center justify-center p-4"
        animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <motion.div
          className="relative w-full h-full"
          animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <SmartShoeImage
            src={shoe.imageUrl}
            alt={shoe.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain drop-shadow-2xl"
            priority={index < 3}
            showFallbackBadge
            forceFallback={!hasShoeImage(shoe.imageUrl)}
            fallbackBadgeLabel={`${shoe.brandId.toUpperCase()} 이미지 준비중`}
          />
        </motion.div>
      </motion.div>

      <div className="absolute top-3 left-3 z-10">
        <Badge variant="category" categoryId={shoe.categoryId}>
          {category?.icon} {category?.name}
        </Badge>
      </div>

      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: '-100%' }}
        animate={isHovered ? { x: '100%' } : { x: '-100%' }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />

    </div>
  );
}

function ShoeCard({ shoe, index = 0 }: ShoeCardProps) {
  const category = useMemo(() => getCategoryById(shoe.categoryId), [shoe.categoryId]);
  const topSpecs = useMemo(() => getTopSpecs(shoe.specs), [shoe.specs]);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isDesktop = useIsDesktop();
  const { hasMotionBudget } = useInteractionCapabilities();
  const isMotionEnabled = isDesktop && hasMotionBudget;
  const showDetailHint = isMotionEnabled ? isHovered : true;

  // 3D tilt effect values - desktop only
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, { stiffness: 400, damping: 25 });
  const ySpring = useSpring(y, { stiffness: 400, damping: 25 });

  const rotateX = useTransform(ySpring, [-0.5, 0.5], ['6deg', '-6deg']);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ['-6deg', '6deg']);

  const glowX = useTransform(xSpring, [-0.5, 0.5], ['0%', '100%']);
  const glowY = useTransform(ySpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMotionEnabled || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }, [isMotionEnabled, x, y]);

  const handleMouseLeave = useCallback(() => {
    if (!isMotionEnabled) return;
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }, [isMotionEnabled, x, y]);

  const handleMouseEnter = useCallback(() => {
    if (!isMotionEnabled) return;
    setIsHovered(true);
  }, [isMotionEnabled]);

  return (
    <Link href={`/shoe/${shoe.slug}`}>
      <motion.div
        ref={cardRef}
        data-cursor="view"
        initial={isMotionEnabled ? { opacity: 0, y: 20 } : false}
        whileInView={isMotionEnabled ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true }}
        transition={isMotionEnabled ? { duration: 0.4, delay: index * 0.1 } : undefined}
        whileHover={isMotionEnabled ? {
          y: -12,
          scale: 1.03,
          zIndex: 20,
          transition: {
            type: 'spring',
            stiffness: 400,
            damping: 20
          }
        } : undefined}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        style={isMotionEnabled ? {
          rotateX,
          rotateY,
          filter: isHovered
            ? 'drop-shadow(0 25px 50px rgba(0, 209, 255, 0.15))'
            : 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1))',
        } : {
          filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1))',
        }}
        className="group relative bg-[var(--color-card)] rounded-2xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-asics-accent)]/60 transition-colors duration-300 cursor-pointer"
      >
        {/* Dynamic glow effect that follows mouse */}
        {isMotionEnabled && (
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(400px circle at var(--glow-x) var(--glow-y), var(--color-asics-accent)25, var(--color-asics-blue)10, transparent 50%)`,
              ['--glow-x' as string]: glowX,
              ['--glow-y' as string]: glowY,
            }}
          />
        )}

        {/* Image container — ImageDistortion on desktop only */}
        {isDesktop ? (
          <ImageDistortion variant="scan" enabled={hasMotionBudget}>
            <ShoeCardImage
              shoe={shoe}
              category={category}
              index={index}
              isHovered={isHovered}
              isMotionEnabled={isMotionEnabled}
            />
          </ImageDistortion>
        ) : (
          <ShoeCardImage
            shoe={shoe}
            category={category}
            index={index}
            isHovered={isHovered}
            isMotionEnabled={false}
          />
        )}

        {/* Content */}
        <div className="p-4" style={{ backfaceVisibility: 'hidden' }}>
          <h3 className="type-h3 text-[var(--color-foreground)] group-hover:text-gradient transition-all duration-300 text-balance">
            {shoe.name}
          </h3>
          <p className="mt-1 type-body type-readable text-[var(--color-foreground)]/60">
            {shoe.shortDescription}
          </p>

          <div className="mt-3 flex items-center gap-4 type-caption text-[var(--color-foreground)]/50">
            <span className="flex items-center gap-1">
              <span className="text-[var(--color-asics-accent)]">⚖</span>
              <span>{shoe.specs.weight}g</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-[var(--color-asics-accent)]">↕</span>
              <span>{shoe.specs.drop}mm</span>
            </span>
          </div>

          {/* Top 2 spec scores */}
          <div className="mt-2 flex flex-col gap-1">
            {topSpecs.map((spec) => (
              <SpecDotBar key={spec.key} label={spec.label} value={spec.value} />
            ))}
          </div>

          {/* Price */}
          <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
            <span className="type-h3 text-gradient">
              {shoe.priceFormatted}
            </span>
            <motion.span
              className="type-body text-[var(--color-asics-accent)]"
              initial={isMotionEnabled ? { x: -10, opacity: 0 } : false}
              animate={showDetailHint ? { x: 0, opacity: 1 } : { x: -10, opacity: 0 }}
              transition={isMotionEnabled ? { duration: 0.3, type: 'spring', stiffness: 300 } : undefined}
            >
              자세히 보기 →
            </motion.span>
          </div>
        </div>

        <ShoeCardDecorations isHovered={isHovered} isMotionEnabled={isMotionEnabled} />
      </motion.div>
    </Link>
  );
}

export default memo(ShoeCard);
