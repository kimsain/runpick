'use client';

import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { QuizResult as QuizResultType } from '@/types/quiz';
import Button from '@/components/common/Button';
import ShoeSpecChart from '@/components/shoe/ShoeSpecChart';
import { getCategoryById } from '@/data/categories';
import { hasShoeImage } from '@/data/image-manifest';
import Badge from '@/components/common/Badge';
import TextReveal from '@/components/effects/TextReveal';
import ImageDistortion from '@/components/effects/ImageDistortion';
import SmartShoeImage from '@/components/common/SmartShoeImage';
import { useInteractionCapabilities } from '@/hooks/useInteractionCapabilities';
interface QuizResultProps {
  result: QuizResultType;
  onRetry: () => void;
}

function MatchScoreCircle({ score }: { score: number }) {
  const motionValue = useMotionValue(0);
  const { hasMotionBudget } = useInteractionCapabilities();
  const animateEnabled = !useReducedMotion() && hasMotionBudget;
  const rounded = useTransform(motionValue, (v) => Math.round(v));
  const circumference = 2 * Math.PI * 54; // radius=54
  const strokeDashoffset = useTransform(
    motionValue,
    (v) => circumference - (v / 100) * circumference
  );
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!animateEnabled) {
      motionValue.set(score);
      if (displayRef.current) {
        displayRef.current.textContent = `${score}%`;
      }
      return;
    }

    const controls = animate(motionValue, score, {
      duration: 1.5,
      delay: 0.5,
      ease: 'easeOut',
    });
    const unsubscribe = rounded.on('change', (v) => {
      if (displayRef.current) displayRef.current.textContent = `${v}%`;
    });
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [score, motionValue, rounded, animateEnabled]);

  return (
    <div className="relative w-28 h-28 sm:w-36 sm:h-36">
      {/* Glow behind */}
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-30 pointer-events-none"
        style={{ background: 'var(--color-asics-accent)' }}
      />

      <svg className="w-28 h-28 sm:w-36 sm:h-36 -rotate-90" viewBox="0 0 120 120">
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <motion.circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="var(--color-asics-accent)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
        />
      </svg>

      {/* Center number */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          ref={displayRef}
          className="type-h3 text-[var(--color-asics-accent)]"
        >
          0%
        </span>
      </div>
    </div>
  );
}

export default function QuizResult({ result, onRetry }: QuizResultProps) {
  const { hasMotionBudget } = useInteractionCapabilities();
  const animateEnabled = !useReducedMotion() && hasMotionBudget;
  const isDesktop = useIsDesktop();
  const { primaryRecommendation, alternatives, matchScore, matchReasons, reasoning } = result;
  const category = getCategoryById(primaryRecommendation.categoryId);

  return (
    <motion.div
      initial={animateEnabled ? { opacity: 0 } : false}
      animate={animateEnabled ? { opacity: 1 } : undefined}
      transition={animateEnabled ? { duration: 0.5 } : undefined}
      className="relative"
    >
      {/* Hero: Match Score + Title */}
      <div className="relative text-center mb-8 sm:mb-12">
        {/* Particle burst */}
      <motion.div
          initial={animateEnabled ? { scale: 0 } : false}
          animate={animateEnabled ? { scale: 1 } : undefined}
          transition={animateEnabled ? { type: 'spring', delay: 0.2 } : undefined}
          className="inline-block mb-4 relative"
        >
          <span className="text-5xl">🎉</span>
          {animateEnabled ? (
            [...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: 'var(--color-asics-accent)',
                  left: '50%',
                  top: '50%',
                }}
                initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: 0,
                  x: Math.cos((i * Math.PI * 2) / 6) * 60,
                  y: Math.sin((i * Math.PI * 2) / 6) * 60,
                }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              />
            ))
          ) : null}
        </motion.div>

        <TextReveal
          as="h1"
          mode="clip"
          delay={0.3}
          className="type-h1 text-[var(--color-foreground)] mb-4 text-balance"
        >
          당신에게 딱 맞는 러닝화를 찾았어요!
        </TextReveal>

        {/* Match score circle */}
        <motion.div
          initial={animateEnabled ? { opacity: 0, scale: 0.8 } : false}
          animate={animateEnabled ? { opacity: 1, scale: 1 } : undefined}
          transition={animateEnabled ? { delay: 0.4, type: 'spring', stiffness: 200, damping: 20 } : undefined}
          className="flex justify-center mb-6"
        >
          <MatchScoreCircle score={matchScore} />
        </motion.div>

        {/* Match reason badges */}
        {matchReasons.length > 0 && (
          <motion.div
            initial={animateEnabled ? { opacity: 0, y: 10 } : false}
            animate={animateEnabled ? { opacity: 1, y: 0 } : undefined}
            transition={animateEnabled ? { delay: 0.8 } : undefined}
            className="flex flex-wrap items-center justify-center gap-2 mb-6"
          >
            {matchReasons.map((reason, i) => (
                <motion.span
                  key={reason}
                  initial={animateEnabled ? { opacity: 0, scale: 0.8 } : false}
                  animate={animateEnabled ? { opacity: 1, scale: 1 } : undefined}
                  transition={animateEnabled ? { delay: 0.9 + i * 0.1 } : undefined}
                  className="px-4 py-1.5 rounded-full type-caption bg-[var(--color-asics-accent)]/10 text-[var(--color-asics-accent)] border border-[var(--color-asics-accent)]/20"
                >
                  {reason}
                </motion.span>
            ))}
          </motion.div>
        )}

        <motion.p
          initial={animateEnabled ? { opacity: 0, y: 20 } : false}
          animate={animateEnabled ? { opacity: 1, y: 0 } : undefined}
          transition={animateEnabled ? { delay: 1.0 } : undefined}
          className="type-body text-[var(--color-foreground)]/62 reading-measure text-pretty"
        >
          {reasoning}
        </motion.p>
      </div>

      {/* Primary Recommendation */}
        <motion.div
          initial={animateEnabled ? { opacity: 0, y: 30, scale: 0.95 } : false}
          animate={animateEnabled ? { opacity: 1, y: 0, scale: 1 } : undefined}
          transition={
            animateEnabled
              ? {
                  delay: 0.5,
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                }
              : undefined
          }
          className="relative bg-gradient-to-br from-[var(--color-card)] to-[var(--color-card-hover)] rounded-3xl overflow-hidden border border-[var(--color-asics-accent)]/30 mb-8"
        >
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-asics-blue)]/5 to-[var(--color-asics-accent)]/10 pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-5 sm:gap-8 sm:p-8">
          <ImageDistortion variant="glow" enabled={isDesktop && animateEnabled}>
            <div className="relative aspect-square bg-[var(--color-background)] rounded-2xl overflow-hidden">
                <SmartShoeImage
                  src={primaryRecommendation.imageUrl}
                alt={primaryRecommendation.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-8"
                showFallbackBadge
                  forceFallback={!hasShoeImage(primaryRecommendation.imageUrl)}
                  fallbackBadgeLabel={`${primaryRecommendation.brandId.toUpperCase()} 이미지 준비중`}
                  fallbackBadgeClassName="absolute bottom-4 right-4 z-20 rounded-full border border-white/20 bg-black/70 px-2.5 py-1 type-caption text-white"
                />
              <div className="absolute top-4 left-4">
                <Badge variant="category" categoryId={primaryRecommendation.categoryId}>
                  {category?.icon} 1순위 추천
                </Badge>
              </div>
            </div>
          </ImageDistortion>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="category" categoryId={primaryRecommendation.categoryId}>
                {category?.name}
              </Badge>
            </div>

            <h2 className="type-h2 text-[var(--color-foreground)] mb-1 text-balance">
              {primaryRecommendation.name}
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <span className="type-body text-[var(--color-foreground)]/60">
                {primaryRecommendation.nameKo}
              </span>
              <span className="type-h3 text-gradient">
                {primaryRecommendation.priceFormatted}
              </span>
            </div>

            <p className="type-body text-[var(--color-foreground)]/82 mb-6 text-pretty">
              {primaryRecommendation.shortDescription}
            </p>

            <div className="flex items-center gap-4">
              <Button href={`/shoe/${primaryRecommendation.slug}`} size="lg">
                자세히 보기
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Spec Analysis Section - separated from primary card */}
        <motion.div
          initial={animateEnabled ? { opacity: 0, y: 20 } : false}
          animate={animateEnabled ? { opacity: 1, y: 0 } : undefined}
          transition={animateEnabled ? { delay: 0.7 } : undefined}
          className="mb-12 p-4 sm:p-6 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)]"
        >
        <h3 className="type-h3 text-[var(--color-foreground)] mb-4">
          스펙 분석
        </h3>
        <ShoeSpecChart specs={primaryRecommendation.specs} animated />
      </motion.div>

      {/* Alternatives — 3 custom cards */}
        {alternatives.length > 0 && (
          <motion.div
          initial={animateEnabled ? { opacity: 0, y: 20 } : false}
          animate={animateEnabled ? { opacity: 1, y: 0 } : undefined}
          transition={animateEnabled ? { delay: 0.7 } : undefined}
          className="mb-12"
        >
          <h3 className="type-h3 text-[var(--color-foreground)] mb-6 text-balance">
            이런 선택지도 있어요
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {alternatives.map(({ shoe, reason }, index) => {
              const topSpec = [
                { label: '쿠셔닝', value: shoe.specs.cushioning },
                { label: '반발력', value: shoe.specs.responsiveness },
                { label: '안정성', value: shoe.specs.stability },
                { label: '내구성', value: shoe.specs.durability },
              ].sort((a, b) => b.value - a.value)[0];

                return (
                <motion.div
                  key={shoe.id}
                  initial={animateEnabled ? { opacity: 0, y: 20 } : false}
                  animate={animateEnabled ? { opacity: 1, y: 0 } : undefined}
                  transition={animateEnabled ? { delay: 0.8 + index * 0.1 } : undefined}
                >
                  <Link
                    href={`/shoe/${shoe.slug}`}
                    className="block bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-all hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="relative aspect-[4/3] bg-[var(--color-background)]">
                      <SmartShoeImage
                        src={shoe.imageUrl}
                        alt={shoe.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-contain p-4"
                        showFallbackBadge
                        forceFallback={!hasShoeImage(shoe.imageUrl)}
                        fallbackBadgeLabel={`${shoe.brandId.toUpperCase()} 준비중`}
                        fallbackBadgeClassName="absolute bottom-2 right-2 z-20 rounded-full border border-white/20 bg-black/70 px-2 py-0.5 type-caption text-white"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="type-h3 text-[var(--color-foreground)] mb-1">
                        {shoe.name}
                      </h4>
                      <p className="type-caption text-[var(--color-foreground)]/50 mb-2">
                        {shoe.nameKo}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full type-caption bg-[var(--color-asics-accent)]/10 text-[var(--color-asics-accent)] border border-[var(--color-asics-accent)]/20">
                          {topSpec.label} {topSpec.value}/10
                        </span>
                        <span className="px-2 py-0.5 rounded-full type-caption bg-[var(--color-foreground)]/5 text-[var(--color-foreground)]/60 border border-[var(--color-border)]">
                          {shoe.specs.weight}g
                        </span>
                      </div>
                      <p className="type-body text-[var(--color-asics-accent)] leading-snug">
                        {reason}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Actions */}
        <motion.div
          initial={animateEnabled ? { opacity: 0 } : false}
          animate={animateEnabled ? { opacity: 1 } : undefined}
          transition={animateEnabled ? { delay: 0.9 } : undefined}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
        <Button variant="outline" onClick={onRetry}>
          다시 테스트하기
        </Button>
        <Button href={`/brand/${primaryRecommendation.brandId}`} variant="ghost">
          추천 브랜드 카탈로그 보기
        </Button>
      </motion.div>
    </motion.div>
  );
}
