'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { QuizResult as QuizResultType } from '@/types/quiz';
import Button from '@/components/common/Button';
import ShoeSpecChart from '@/components/shoe/ShoeSpecChart';
import { getCategoryById } from '@/data/categories';
import Badge from '@/components/common/Badge';
import TextReveal from '@/components/effects/TextReveal';
import ImageDistortion from '@/components/effects/ImageDistortion';
import FloatingShapes from '@/components/effects/FloatingShapes';

interface QuizResultProps {
  result: QuizResultType;
  onRetry: () => void;
}

function MatchScoreCircle({ score }: { score: number }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));
  const circumference = 2 * Math.PI * 54; // radius=54
  const strokeDashoffset = useTransform(
    motionValue,
    (v) => circumference - (v / 100) * circumference
  );
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
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
  }, [score, motionValue, rounded]);

  return (
    <div className="relative w-36 h-36">
      {/* Glow behind */}
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-30"
        style={{ background: 'var(--color-asics-accent)' }}
      />

      <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
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
          className="text-3xl font-bold text-[var(--color-asics-accent)]"
        >
          0%
        </span>
      </div>
    </div>
  );
}

export default function QuizResult({ result, onRetry }: QuizResultProps) {
  const { primaryRecommendation, alternatives, matchScore, matchReasons, reasoning } = result;
  const category = getCategoryById(primaryRecommendation.categoryId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <FloatingShapes count={4} />

      {/* Hero: Match Score + Title */}
      <div className="relative text-center mb-12">
        {/* Particle burst */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="inline-block mb-4 relative"
        >
          <span className="text-5xl">🎉</span>
          {[...Array(6)].map((_, i) => (
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
          ))}
        </motion.div>

        <TextReveal
          as="h1"
          mode="clip"
          delay={0.3}
          className="text-3xl sm:text-4xl font-bold text-[var(--color-foreground)] mb-4 text-balance leading-snug"
        >
          당신에게 딱 맞는 러닝화를 찾았어요!
        </TextReveal>

        {/* Match score circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
          className="flex justify-center mb-6"
        >
          <MatchScoreCircle score={matchScore} />
        </motion.div>

        {/* Match reason badges */}
        {matchReasons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-6"
          >
            {matchReasons.map((reason, i) => (
              <motion.span
                key={reason}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="px-4 py-1.5 rounded-full text-sm font-medium bg-[var(--color-asics-accent)]/10 text-[var(--color-asics-accent)] border border-[var(--color-asics-accent)]/20"
              >
                {reason}
              </motion.span>
            ))}
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-[var(--color-foreground)]/60 max-w-2xl mx-auto text-pretty leading-relaxed"
        >
          {reasoning}
        </motion.p>
      </div>

      {/* Primary Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          delay: 0.5,
          type: 'spring',
          stiffness: 200,
          damping: 20,
        }}
        className="relative bg-gradient-to-br from-[var(--color-card)] to-[var(--color-card-hover)] rounded-3xl overflow-hidden border border-[var(--color-asics-accent)]/30 mb-8"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-asics-blue)]/5 to-[var(--color-asics-accent)]/10" />

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          <ImageDistortion variant="glow">
            <div className="relative aspect-square bg-[var(--color-background)] rounded-2xl overflow-hidden">
              <Image
                src={primaryRecommendation.imageUrl}
                alt={primaryRecommendation.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-8"
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

            <h2 className="text-3xl font-bold text-[var(--color-foreground)] mb-1 text-balance leading-tight">
              {primaryRecommendation.name}
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[var(--color-foreground)]/60">
                {primaryRecommendation.nameKo}
              </span>
              <span className="text-2xl font-bold text-gradient">
                {primaryRecommendation.priceFormatted}
              </span>
            </div>

            <p className="text-[var(--color-foreground)]/80 mb-6 leading-relaxed text-pretty">
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-12 p-6 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)]"
      >
        <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-4">
          스펙 분석
        </h3>
        <ShoeSpecChart specs={primaryRecommendation.specs} animated />
      </motion.div>

      {/* Alternatives — 3 custom cards */}
      {alternatives.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-6 text-balance">
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <Link
                    href={`/shoe/${shoe.slug}`}
                    className="block bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-all hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="relative aspect-[4/3] bg-[var(--color-background)]">
                      <Image
                        src={shoe.imageUrl}
                        alt={shoe.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-contain p-4"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-[var(--color-foreground)] mb-1">
                        {shoe.name}
                      </h4>
                      <p className="text-xs text-[var(--color-foreground)]/50 mb-2">
                        {shoe.nameKo}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--color-asics-accent)]/10 text-[var(--color-asics-accent)] border border-[var(--color-asics-accent)]/20">
                          {topSpec.label} {topSpec.value}/10
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--color-foreground)]/5 text-[var(--color-foreground)]/60 border border-[var(--color-border)]">
                          {shoe.specs.weight}g
                        </span>
                      </div>
                      <p className="text-sm text-[var(--color-asics-accent)] leading-snug">
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Button variant="outline" onClick={onRetry}>
          다시 테스트하기
        </Button>
        <Button href="/brand/asics" variant="ghost">
          전체 카탈로그 보기
        </Button>
      </motion.div>
    </motion.div>
  );
}
