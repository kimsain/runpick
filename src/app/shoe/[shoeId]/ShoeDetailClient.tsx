'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShoeCard from '@/components/shoe/ShoeCard';
import ShoeSpecChart from '@/components/shoe/ShoeSpecChart';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { getShoeBySlug, getSimilarShoes } from '@/utils/shoe-utils';
import { getCategoryById, getSubcategoryById } from '@/data/categories';
import Link from 'next/link';

interface ShoeDetailClientProps {
  shoeId: string;
}

export default function ShoeDetailClient({ shoeId }: ShoeDetailClientProps) {
  const shoe = getShoeBySlug(shoeId);

  if (!shoe) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[var(--color-foreground)]">
              러닝화를 찾을 수 없습니다
            </h1>
            <Link
              href="/brand/asics"
              className="mt-4 inline-block text-[var(--color-asics-accent)]"
            >
              ← 카탈로그로 돌아가기
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const category = getCategoryById(shoe.categoryId);
  const subcategory = getSubcategoryById(shoe.subcategoryId);
  const similarShoes = getSimilarShoes(shoe);

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="bg-[var(--color-card)] border-b border-[var(--color-border)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm text-[var(--color-foreground)]/60">
              <Link href="/brand/asics" className="hover:text-[var(--color-foreground)]">
                ASICS
              </Link>
              <span>/</span>
              <Link
                href={`/brand/asics/${shoe.categoryId}`}
                className="hover:text-[var(--color-foreground)]"
                style={{ color: category?.color }}
              >
                {category?.name}
              </Link>
              <span>/</span>
              <span className="text-[var(--color-foreground)]">{shoe.name}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-[var(--color-card)] to-[var(--color-background)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative aspect-square bg-gradient-to-br from-[var(--color-card)] to-[var(--color-card-hover)] rounded-3xl overflow-hidden border border-[var(--color-border)]"
              >
                <motion.div
                  className="absolute inset-0 flex items-center justify-center p-8"
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image
                    src={shoe.imageUrl}
                    alt={shoe.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain drop-shadow-2xl p-8"
                    priority
                  />
                </motion.div>

                {/* Category badge */}
                <div className="absolute top-6 left-6 z-10">
                  <Badge variant="category" categoryId={shoe.categoryId}>
                    {category?.icon} {category?.name}
                  </Badge>
                </div>

                {/* Upcoming badge */}
                {shoe.isUpcoming && (
                  <div className="absolute top-6 right-6 z-10">
                    <span className="px-3 py-1.5 bg-orange-500/90 text-white text-xs font-bold rounded-full">
                      {shoe.upcomingNote || 'Coming Soon'}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col justify-center"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="category" categoryId={shoe.categoryId}>
                    {subcategory?.nameKo}
                  </Badge>
                  <Badge>{shoe.releaseYear}</Badge>
                </div>

                <h1 className="text-4xl sm:text-5xl font-bold text-[var(--color-foreground)] mb-2">
                  {shoe.name}
                </h1>
                <p className="text-xl text-[var(--color-foreground)]/60 mb-6">
                  {shoe.nameKo}
                </p>

                <p className="text-lg text-[var(--color-foreground)]/80 mb-8 leading-relaxed">
                  {shoe.description}
                </p>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-4xl font-bold text-gradient">
                    {shoe.priceFormatted}
                  </span>
                </div>

                {/* Technologies */}
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-[var(--color-foreground)]/60 mb-3">
                    탑재 기술
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {shoe.technologies.map((tech) => (
                      <Badge key={tech} variant="spec">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-4">
                  <Button size="lg">공식 스토어에서 보기</Button>
                  <Button variant="outline" size="lg" href="/quiz">
                    나에게 맞을까?
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Specs & Details */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Spec Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-1 bg-[var(--color-card)] rounded-2xl p-6 border border-[var(--color-border)]"
              >
                <h2 className="text-xl font-bold text-[var(--color-foreground)] mb-6">
                  스펙
                </h2>
                <ShoeSpecChart specs={shoe.specs} />
              </motion.div>

              {/* Pros & Cons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Pros */}
                <div className="bg-[var(--color-card)] rounded-2xl p-6 border border-[var(--color-border)]">
                  <h2 className="text-xl font-bold text-[var(--color-daily)] mb-4 flex items-center gap-2">
                    <span>👍</span> 장점
                  </h2>
                  <ul className="space-y-3">
                    {shoe.pros.map((pro, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2 text-[var(--color-foreground)]/80"
                      >
                        <span className="text-[var(--color-daily)] mt-1">•</span>
                        {pro}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="bg-[var(--color-card)] rounded-2xl p-6 border border-[var(--color-border)]">
                  <h2 className="text-xl font-bold text-[var(--color-racing)] mb-4 flex items-center gap-2">
                    <span>👎</span> 단점
                  </h2>
                  <ul className="space-y-3">
                    {shoe.cons.map((con, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2 text-[var(--color-foreground)]/80"
                      >
                        <span className="text-[var(--color-racing)] mt-1">•</span>
                        {con}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* Best For */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 bg-gradient-to-r from-[var(--color-asics-blue)]/10 to-[var(--color-asics-accent)]/10 rounded-2xl p-6 border border-[var(--color-asics-accent)]/20"
            >
              <h2 className="text-xl font-bold text-[var(--color-foreground)] mb-4 flex items-center gap-2">
                <span>🎯</span> 이런 분에게 추천
              </h2>
              <div className="flex flex-wrap gap-3">
                {shoe.bestFor.map((item, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="px-4 py-2 bg-[var(--color-card)] rounded-full text-sm text-[var(--color-foreground)]/80 border border-[var(--color-border)]"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Similar Shoes */}
        {similarShoes.length > 0 && (
          <section className="py-16 bg-[var(--color-card)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
                  비슷한 러닝화
                </h2>
                <p className="text-[var(--color-foreground)]/60">
                  같은 카테고리의 다른 모델도 살펴보세요
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarShoes.map((similarShoe, index) => (
                  <ShoeCard key={similarShoe.id} shoe={similarShoe} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
