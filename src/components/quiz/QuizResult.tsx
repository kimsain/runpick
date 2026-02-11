'use client';

import { motion } from 'framer-motion';
import { QuizResult as QuizResultType } from '@/types/quiz';
import ShoeCard from '@/components/shoe/ShoeCard';
import Button from '@/components/common/Button';
import ShoeSpecChart from '@/components/shoe/ShoeSpecChart';
import { getCategoryById } from '@/data/categories';
import Badge from '@/components/common/Badge';

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
    >
      {/* Hero Result */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="inline-block mb-6"
        >
          <span className="text-6xl">🎉</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl sm:text-4xl font-bold text-[var(--color-foreground)] mb-4"
        >
          당신에게 딱 맞는 러닝화를 찾았어요!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-[var(--color-foreground)]/60 max-w-2xl mx-auto"
        >
          {reasoning}
        </motion.p>
      </div>

      {/* Primary Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative bg-gradient-to-br from-[var(--color-card)] to-[var(--color-card-hover)] rounded-3xl overflow-hidden border border-[var(--color-asics-accent)]/30 mb-12"
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-asics-blue)]/5 to-[var(--color-asics-accent)]/10" />

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Image */}
          <div className="relative aspect-square bg-[var(--color-background)] rounded-2xl flex items-center justify-center">
            <motion.span
              className="text-[10rem] opacity-30"
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              👟
            </motion.span>
            <div className="absolute top-4 left-4">
              <Badge variant="category" categoryId={primaryRecommendation.categoryId}>
                {category?.icon} 1순위 추천
              </Badge>
            </div>
          </div>

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

      {/* Alternatives */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {alternatives.map((shoe, index) => (
              <ShoeCard key={shoe.id} shoe={shoe} index={index} />
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
