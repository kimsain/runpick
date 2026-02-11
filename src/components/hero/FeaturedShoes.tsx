'use client';

import { motion } from 'framer-motion';
import ShoeCard from '@/components/shoe/ShoeCard';
import { getAllShoes } from '@/utils/shoe-utils';

export default function FeaturedShoes() {
  const allShoes = getAllShoes();
  // 각 카테고리에서 인기 모델 선택
  const featuredShoes = [
    allShoes.find((s) => s.id === 'novablast-5'),
    allShoes.find((s) => s.id === 'superblast-2'),
    allShoes.find((s) => s.id === 'metaspeed-sky-tokyo'),
  ].filter(Boolean);

  return (
    <section className="py-24 bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-foreground)]">
            인기 러닝화
          </h2>
          <p className="mt-4 text-lg text-[var(--color-foreground)]/60">
            러너들이 가장 사랑하는 모델들
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredShoes.map((shoe, index) => (
            shoe && <ShoeCard key={shoe.id} shoe={shoe} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
