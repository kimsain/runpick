'use client';

// Shoe detail page client component. Sections: hero image, info, specs, pros/cons, bestFor, similar shoes.
// GSAP: pros slide-in from left, cons from right (desktop only).
// CSS initial state: .shoe-detail-pros/.shoe-detail-cons in globals.css.

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShoeCard from '@/components/shoe/ShoeCard';
import ShoeSpecChart from '@/components/shoe/ShoeSpecChart';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import BrandSwitcher from '@/components/common/BrandSwitcher';
import TextReveal from '@/components/effects/TextReveal';
import ImageDistortion from '@/components/effects/ImageDistortion';
import SmartShoeImage from '@/components/common/SmartShoeImage';
import { hasShoeImage } from '@/data/image-manifest';
import { getBrandById, getShoeBySlug, getSimilarShoes } from '@/utils/shoe-utils';
import { getBrandThemeVars } from '@/utils/brand-utils';
import { getCategoryById, getSubcategoryById } from '@/data/categories';
import { CategoryId } from '@/types/shoe';
import Link from 'next/link';
import { SPRING_SNAPPY, STAGGER_NORMAL } from '@/constants/animation';
import { useIsDesktop } from '@/hooks/useIsDesktop';

interface ShoeDetailClientProps {
  shoeId: string;
}

export default function ShoeDetailClient({ shoeId }: ShoeDetailClientProps) {
  const shoe = getShoeBySlug(shoeId);
  const prosRef = useRef<HTMLDivElement>(null);
  const consRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (!isDesktop) return;
    gsap.registerPlugin(ScrollTrigger);
    const triggers: ScrollTrigger[] = [];

    // Pros slide-in from left
    if (prosRef.current) {
      const tween = gsap.to(prosRef.current, {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: prosRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    }

    // Cons slide-in from right
    if (consRef.current) {
      const tween = gsap.to(consRef.current, {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: consRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    }

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [isDesktop]);

  if (!shoe) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-[var(--color-foreground)]">
              러닝화를 찾을 수 없습니다
            </h1>
            <Link
              href="/brand"
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
  const brand = getBrandById(shoe.brandId);
  const similarShoes = getSimilarShoes(shoe, 3, { sameBrandFirst: true });
  const brandThemeVars = getBrandThemeVars(shoe.brandId, brand?.color);

  return (
    <>
      <Header />
      <main className="pt-20" style={brandThemeVars}>
        {/* Breadcrumb */}
        <div className="bg-[var(--color-card)] border-b border-[var(--color-border)]">
          <div className="layout-shell py-4">
            <nav className="flex items-center gap-2 type-caption text-[var(--color-foreground)]/60">
              <Link href={`/brand/${shoe.brandId}`} className="hover:text-[var(--color-foreground)]">
                {brand?.name || shoe.brandId.toUpperCase()}
              </Link>
              <span>/</span>
              <Link
                href={`/brand/${shoe.brandId}/${shoe.categoryId}`}
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

        <div className="border-b border-[var(--color-border)] bg-[var(--color-card)]/50">
          <div className="layout-shell py-3">
            <BrandSwitcher
              currentBrandId={shoe.brandId}
              categoryId={shoe.categoryId as CategoryId}
              className="justify-start"
            />
          </div>
        </div>

        {/* Hero Section */}
        <section className="section-space-tight bg-gradient-to-b from-[var(--color-card)] to-[var(--color-background)]">
          <div className="layout-shell">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
              {/* Image with ImageDistortion glow */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden border border-[var(--color-border)]"
              >
                <ImageDistortion variant="glow">
                  <div
                    className="relative aspect-[4/3] lg:aspect-square bg-gradient-to-br from-[var(--color-card)] to-[var(--color-card-hover)]"
                    data-cursor="view"
                  >
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      <SmartShoeImage
                        src={shoe.imageUrl}
                        alt={shoe.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain drop-shadow-2xl p-8"
                        priority
                        showFallbackBadge
                        forceFallback={!hasShoeImage(shoe.imageUrl)}
                        fallbackBadgeLabel={`${shoe.brandId.toUpperCase()} 이미지 준비중`}
                        fallbackBadgeClassName="absolute bottom-6 right-6 z-20 rounded-full border border-white/20 bg-black/70 px-2.5 py-1 text-[11px] font-medium text-white"
                      />
                    </div>

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
                  </div>
                </ImageDistortion>
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

                <TextReveal
                  as="h1"
                  mode="clip"
                  className="type-h1 text-[var(--color-foreground)] mb-2 text-balance"
                >
                  {shoe.name}
                </TextReveal>
                <p className="type-lead text-[var(--color-foreground)]/62 mb-6 text-pretty">
                  {shoe.nameKo}
                </p>

                <p className="type-body text-[var(--color-foreground)]/82 mb-8 text-pretty">
                  {shoe.description}
                </p>

                {/* Price */}
                <div className="mb-8">
                  <span className="type-h1 text-gradient">
                    {shoe.priceFormatted}
                  </span>
                </div>

                {/* Technologies with spring cascade */}
                <div className="mb-8">
                  <h3 className="type-caption font-medium text-[var(--color-foreground)]/60 mb-3">
                    탑재 기술
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {shoe.technologies.map((tech, i) => (
                      <motion.div
                        key={tech}
                        initial={{ opacity: 0, scale: 0.5, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                          type: 'spring',
                          ...SPRING_SNAPPY,
                          delay: 0.4 + i * STAGGER_NORMAL,
                        }}
                      >
                        <Badge variant="spec">
                          {tech}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  {shoe.officialUrl ? (
                    <Button size="lg" href={shoe.officialUrl}>
                      공식 스토어에서 보기
                    </Button>
                  ) : (
                    <Button size="lg" href={`/brand/${shoe.brandId}/${shoe.categoryId}`}>
                      같은 카테고리 더 보기
                    </Button>
                  )}
                  <Button variant="outline" size="lg" href="/quiz">
                    나에게 맞을까?
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Specs & Details */}
        <section className="section-space-tight">
          <div className="layout-shell">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Spec Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-1 bg-[var(--color-card)] rounded-2xl p-6 border border-[var(--color-border)]"
              >
                <h2 className="type-h3 text-[var(--color-foreground)] mb-6">
                  스펙
                </h2>
                <ShoeSpecChart specs={shoe.specs} />
              </motion.div>

              {/* Pros & Cons with GSAP scrub slide-in */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pros */}
                <div
                  ref={prosRef}
                  className="shoe-detail-pros h-full flex flex-col bg-[var(--color-card)] rounded-2xl p-6 border border-[var(--color-border)]"
                >
                  <h2 className="type-h3 text-[var(--color-daily)] mb-4 flex items-center gap-2">
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
                        className="flex items-start gap-2 type-body text-[var(--color-foreground)]/80"
                      >
                        <span className="text-[var(--color-daily)] mt-1">•</span>
                        {pro}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div
                  ref={consRef}
                  className="shoe-detail-cons h-full flex flex-col bg-[var(--color-card)] rounded-2xl p-6 border border-[var(--color-border)]"
                >
                  <h2 className="type-h3 text-[var(--color-racing)] mb-4 flex items-center gap-2">
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
                        className="flex items-start gap-2 type-body text-[var(--color-foreground)]/80"
                      >
                        <span className="text-[var(--color-racing)] mt-1">•</span>
                        {con}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Best For - wave stagger animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 bg-gradient-to-r from-[var(--color-asics-blue)]/10 to-[var(--color-asics-accent)]/10 rounded-2xl p-6 border border-[var(--color-asics-accent)]/20"
            >
              <h2 className="type-h3 text-[var(--color-foreground)] mb-4 flex items-center gap-2">
                <span>🎯</span> 이런 분에게 추천
              </h2>
              <div className="flex flex-wrap gap-3">
                {shoe.bestFor.map((item, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.08,
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                    }}
                    className="px-4 py-2 bg-[var(--color-card)] rounded-full type-body text-[var(--color-foreground)]/80 border border-[var(--color-border)]"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Similar Shoes - horizontal scroll carousel */}
        {similarShoes.length > 0 && (
          <section className="section-space-tight bg-[var(--color-card)] overflow-x-clip">
            <div className="layout-shell">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <h2 className="type-h2 text-[var(--color-foreground)] text-balance">
                  비슷한 러닝화
                </h2>
                <p className="type-body text-[var(--color-foreground)]/62 text-pretty">
                  같은 카테고리의 다른 모델도 살펴보세요
                </p>
              </motion.div>
            </div>

            <div
              className="flex gap-4 lg:gap-6 overflow-x-auto md:overflow-visible pb-4 scrollbar-hide layout-shell"
              data-cursor="drag"
            >
              {similarShoes.map((similarShoe, index) => (
                <div key={similarShoe.id} className="min-w-[260px] sm:min-w-[340px] md:min-w-0 md:flex-1 shrink-0 md:shrink">
                  <ShoeCard shoe={similarShoe} index={index} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
