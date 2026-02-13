'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShoeCard from '@/components/shoe/ShoeCard';
import Badge from '@/components/common/Badge';
import TextReveal from '@/components/effects/TextReveal';
import MagneticElement from '@/components/effects/MagneticElement';
import { categories } from '@/data/categories';
import { getShoesByBrand, getShoesByBrandAndCategory, getBrandById } from '@/utils/shoe-utils';
import Link from 'next/link';
import { STAGGER_NORMAL, DUR_FAST } from '@/constants/animation';
import { useIsDesktop } from '@/hooks/useIsDesktop';

interface BrandPageClientProps {
  brandId: string;
}

export default function BrandPageClient({ brandId }: BrandPageClientProps) {
  const brand = getBrandById(brandId);
  const shoes = getShoesByBrand(brandId);

  if (!brand) return null;
  const sectionsRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();

  // Track header visibility (mirrors Header.tsx logic)
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastScrollY = useRef(0);
  const headerHiddenRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const isDown = currentY > lastScrollY.current;
      const scrolled = currentY > 20;
      const newHidden = isDown && scrolled;
      lastScrollY.current = currentY;

      if (newHidden !== headerHiddenRef.current) {
        headerHiddenRef.current = newHidden;
        setHeaderHidden(newHidden);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    gsap.registerPlugin(ScrollTrigger);
    const triggers: ScrollTrigger[] = [];

    // Stagger reveal for each category section's shoe cards
    const sections = sectionsRef.current?.querySelectorAll('.category-section');
    sections?.forEach((section) => {
      const cards = section.querySelectorAll('.shoe-card-wrapper');
      if (cards.length === 0) return;

      cards.forEach((card, i) => {
        const tween = gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 95%',
              toggleActions: 'play none none none',
            },
            delay: i * STAGGER_NORMAL,
          });
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      });
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [isDesktop]);

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-8 sm:py-12 bg-gradient-to-b from-[var(--color-card)] to-[var(--color-background)] relative overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <TextReveal
                as="h1"
                mode="clip"
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-balance leading-tight"
              >
                <span style={{ color: brand.color }}>{brand.name}</span>
              </TextReveal>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-lg text-[var(--color-foreground)]/60 max-w-2xl mx-auto text-pretty leading-relaxed"
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

        {/* Category Navigation — fixed below header, follows header hide/show */}
        <motion.section
          animate={{ y: headerHidden ? -64 : 0 }}
          transition={{ duration: DUR_FAST, ease: 'easeOut' }}
          className="fixed top-16 left-0 right-0 py-3 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur-sm z-40"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-1.5 sm:gap-4">
              {categories.map((category) => (
                <MagneticElement key={category.id} strength={0.2} radius={120}>
                  <Link href={`/brand/${brandId}/${category.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-2.5 py-1.5 sm:px-6 sm:py-3 rounded-full border border-[var(--color-border)] hover:border-transparent transition-all cursor-pointer whitespace-nowrap"
                      style={{
                        background: `linear-gradient(135deg, transparent, ${category.color}10)`,
                      }}
                    >
                      <span className="mr-1 sm:mr-2">{category.icon}</span>
                      <span style={{ color: category.color }} className="text-xs sm:text-base font-medium">
                        {category.name}
                      </span>
                      <span className="ml-0.5 sm:ml-2 text-[10px] sm:text-sm text-[var(--color-foreground)]/40">
                        {getShoesByBrandAndCategory(brandId, category.id).length}
                      </span>
                    </motion.div>
                  </Link>
                </MagneticElement>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Spacer for fixed category nav */}
        <div className="h-12" />

        {/* All Shoes by Category */}
        <div ref={sectionsRef}>
          {categories.map((category) => {
            const categoryShoes = shoes.filter((s) => s.categoryId === category.id);
            if (categoryShoes.length === 0) return null;

            return (
              <section
                key={category.id}
                className="category-section py-10"
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
                        className="text-2xl font-bold text-balance"
                        style={{ color: category.color }}
                      >
                        {category.name}
                      </h2>
                      <Badge variant="category" categoryId={category.id}>
                        {category.nameKo}
                      </Badge>
                    </div>
                    <p className="text-[var(--color-foreground)]/60 text-pretty leading-relaxed">
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
