'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { QuizResult as QuizResultType } from '@/types/quiz';
import ShoeCard from '@/components/shoe/ShoeCard';
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

export default function QuizResult({ result, onRetry }: QuizResultProps) {
  const { primaryRecommendation, alternatives, reasoning } = result;
  const category = getCategoryById(primaryRecommendation.categoryId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Floating shapes background */}
      <FloatingShapes count={4} />

      {/* Hero Result - particle burst + TextReveal */}
      <div className="relative text-center mb-12">
        {/* Particle burst */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="inline-block mb-6 relative"
        >
          <span className="text-6xl">🎉</span>
          {/* Burst particles */}
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
          className="text-3xl sm:text-4xl font-bold text-[var(--color-foreground)] mb-4"
        >
          당신에게 딱 맞는 러닝화를 찾았어요!
        </TextReveal>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-[var(--color-foreground)]/60 max-w-2xl mx-auto"
        >
          {reasoning}
        </motion.p>
      </div>

      {/* Primary Recommendation with spring entrance */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          delay: 0.5,
          type: 'spring',
          stiffness: 200,
          damping: 20,
        }}
        className="relative bg-gradient-to-br from-[var(--color-card)] to-[var(--color-card-hover)] rounded-3xl overflow-hidden border border-[var(--color-asics-accent)]/30 mb-12"
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-asics-blue)]/5 to-[var(--color-asics-accent)]/10" />

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Image with ImageDistortion glow */}
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

          {/* Info */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="category" categoryId={primaryRecommendation.categoryId}>
                {category?.name}
              </Badge>
            </div>

            <h2 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">
              {primaryRecommendation.name}
            </h2>
            <p className="text-[var(--color-foreground)]/60 mb-4">
              {primaryRecommendation.nameKo}
            </p>

            <p className="text-[var(--color-foreground)]/80 mb-6 leading-relaxed">
              {primaryRecommendation.shortDescription}
            </p>

            <div className="mb-6">
              <span className="text-3xl font-bold text-gradient">
                {primaryRecommendation.priceFormatted}
              </span>
            </div>

            {/* Specs */}
            <div className="mb-6 p-4 bg-[var(--color-background)] rounded-xl">
              <ShoeSpecChart specs={primaryRecommendation.specs} />
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <Button href={`/shoe/${primaryRecommendation.slug}`} size="lg">
                자세히 보기
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Alternatives - horizontal scroll */}
      {alternatives.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-6">
            이런 선택지도 있어요
          </h3>
          <div
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
            data-cursor="drag"
          >
            {alternatives.map((shoe, index) => (
              <div key={shoe.id} className="min-w-[280px] sm:min-w-[320px] flex-shrink-0">
                <ShoeCard shoe={shoe} index={index} />
              </div>
            ))}
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
