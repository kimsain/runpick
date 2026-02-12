'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShoeCard from '@/components/shoe/ShoeCard';
import Badge from '@/components/common/Badge';
import TextReveal from '@/components/effects/TextReveal';
import MagneticElement from '@/components/effects/MagneticElement';
import FloatingShapes from '@/components/effects/FloatingShapes';
import { categories } from '@/data/categories';
import { getShoesByBrand, getShoesByCategory } from '@/utils/shoe-utils';
import asicsData from '@/data/brands/asics.json';
import Link from 'next/link';
import { STAGGER_NORMAL } from '@/constants/animation';

interface BrandPageClientProps {
  brandId: string;
}

export default function BrandPageClient({ brandId }: BrandPageClientProps) {
  const brand = asicsData.brand;
  const shoes = getShoesByBrand(brandId);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const triggers: ScrollTrigger[] = [];

    // Stagger reveal for each category section's shoe cards
    const sections = sectionsRef.current?.querySelectorAll('.category-section');
    sections?.forEach((section) => {
      const cards = section.querySelectorAll('.shoe-card-wrapper');
      if (cards.length === 0) return;

      cards.forEach((card, i) => {
        const tween = gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
            delay: i * STAGGER_NORMAL,
          }
        );
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      });
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-[var(--color-card)] to-[var(--color-background)] relative overflow-hidden">
          <FloatingShapes />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <TextReveal
                as="h1"
                mode="clip"
                className="text-5xl sm:text-6xl font-bold"
              >
                <span style={{ color: brand.color }}>{brand.name}</span>
              </TextReveal>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-lg text-[var(--color-foreground)]/60 max-w-2xl mx-auto"
              >
                {brand.description}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-2 text-sm text-[var(--color-foreground)]/40"
              >
                {shoes.length}개 모델
              </motion.p>
            </div>
          </div>
        </section>

        {/* Category Navigation with MagneticElement */}
        <section className="py-8 border-b border-[var(--color-border)] sticky top-16 bg-[var(--color-background)]/95 backdrop-blur-sm z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {categories.map((category) => (
                <MagneticElement key={category.id} strength={0.2} radius={120}>
                  <Link href={`/brand/${brandId}/${category.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-full border border-[var(--color-border)] hover:border-transparent transition-all cursor-pointer"
                      style={{
                        background: `linear-gradient(135deg, transparent, ${category.color}10)`,
                      }}
                    >
                      <span className="mr-2">{category.icon}</span>
                      <span style={{ color: category.color }} className="font-medium">
                        {category.name}
                      </span>
                      <span className="ml-2 text-sm text-[var(--color-foreground)]/40">
                        {getShoesByCategory(category.id).length}
                      </span>
                    </motion.div>
                  </Link>
                </MagneticElement>
              ))}
            </div>
          </div>
        </section>

        {/* All Shoes by Category */}
        <div ref={sectionsRef}>
          {categories.map((category) => {
            const categoryShoes = shoes.filter((s) => s.categoryId === category.id);
            if (categoryShoes.length === 0) return null;

            return (
              <section
                key={category.id}
                className="category-section py-16"
                id={category.id}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-8"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{category.icon}</span>
                      <h2
                        className="text-2xl font-bold"
                        style={{ color: category.color }}
                      >
                        {category.name}
                      </h2>
                      <Badge variant="category" categoryId={category.id}>
                        {category.nameKo}
                      </Badge>
                    </div>
                    <p className="text-[var(--color-foreground)]/60">
                      {category.description}
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryShoes.map((shoe, index) => (
                      <div key={shoe.id} className="shoe-card-wrapper">
                        <ShoeCard shoe={shoe} index={index} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
