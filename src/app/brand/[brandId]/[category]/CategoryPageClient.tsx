'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShoeCard from '@/components/shoe/ShoeCard';
import TextReveal from '@/components/effects/TextReveal';
import { getCategoryById, getSubcategoriesByCategory } from '@/data/categories';
import { getShoesByCategory, getShoesBySubcategory } from '@/utils/shoe-utils';
import { CategoryId, SubcategoryId } from '@/types/shoe';
import Link from 'next/link';
import { DUR_FAST } from '@/constants/animation';

interface CategoryPageClientProps {
  brandId: string;
  category: string;
}

export default function CategoryPageClient({ brandId, category }: CategoryPageClientProps) {
  const categoryData = getCategoryById(category as CategoryId);
  const subcategories = getSubcategoriesByCategory(category as CategoryId);
  const allCategoryShoes = getShoesByCategory(category as CategoryId);

  const [selectedSubcategory, setSelectedSubcategory] = useState<SubcategoryId | 'all'>(
    'all'
  );

  // Track header visibility (mirrors Header.tsx logic)
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const isDown = currentY > lastScrollY.current;
      const scrolled = currentY > 20;
      lastScrollY.current = currentY;
      setHeaderHidden(isDown && scrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!categoryData) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[var(--color-foreground)]">
              카테고리를 찾을 수 없습니다
            </h1>
            <Link
              href={`/brand/${brandId}`}
              className="mt-4 inline-block text-[var(--color-asics-accent)]"
            >
              ← 브랜드 페이지로 돌아가기
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const displayedShoes =
    selectedSubcategory === 'all'
      ? allCategoryShoes
      : getShoesBySubcategory(selectedSubcategory);

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section
          className="py-8 sm:py-14 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, var(--color-card) 0%, var(--color-background) 100%)`,
          }}
        >
          {/* Glow effect */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at 50% 100%, ${categoryData.color} 0%, transparent 50%)`,
            }}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link
                href={`/brand/${brandId}`}
                className="inline-flex items-center gap-2 text-sm text-[var(--color-foreground)]/60 hover:text-[var(--color-foreground)] mb-4"
              >
                ← ASICS
              </Link>

              <motion.span
                className="block text-4xl sm:text-6xl mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                {categoryData.icon}
              </motion.span>

              <TextReveal
                as="h1"
                mode="clip"
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance leading-tight"
              >
                <span style={{ color: categoryData.color }}>
                  {categoryData.name}
                </span>
              </TextReveal>
              <p className="text-lg sm:text-xl text-[var(--color-foreground)]/60 max-w-2xl mx-auto text-pretty leading-relaxed">
                {categoryData.description}
              </p>
              <p className="mt-4 text-sm text-[var(--color-foreground)]/40">
                {allCategoryShoes.length}개 모델
              </p>
            </motion.div>
          </div>
        </section>

        {/* Subcategory Tabs — fixed below header, follows header hide/show */}
        <motion.section
          animate={{ y: headerHidden ? -64 : 0 }}
          transition={{ duration: DUR_FAST, ease: 'easeOut' }}
          className="fixed top-16 left-0 right-0 py-3 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur-sm z-40"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setSelectedSubcategory('all')}
                className="relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
              >
                {selectedSubcategory === 'all' && (
                  <motion.div
                    layoutId="subcategory-indicator"
                    className="absolute inset-0 rounded-full bg-[var(--color-foreground)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 ${
                  selectedSubcategory === 'all'
                    ? 'text-[var(--color-background)]'
                    : 'text-[var(--color-foreground)]/70 hover:text-[var(--color-foreground)]'
                }`}>
                  전체 ({allCategoryShoes.length})
                </span>
              </button>

              {subcategories.filter((sub) => getShoesBySubcategory(sub.id).length > 0).map((sub) => {
                const count = getShoesBySubcategory(sub.id).length;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubcategory(sub.id)}
                    className="relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
                  >
                    {selectedSubcategory === sub.id && (
                      <motion.div
                        layoutId="subcategory-indicator"
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: categoryData.color }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-10 ${
                      selectedSubcategory === sub.id
                        ? 'text-[var(--color-background)]'
                        : 'text-[var(--color-foreground)]/70 hover:text-[var(--color-foreground)]'
                    }`}>
                      {sub.nameKo} ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Spacer for fixed subcategory nav */}
        <div className="h-12" />

        {/* Shoes Grid with AnimatePresence layout */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {selectedSubcategory !== 'all' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                {(() => {
                  const sub = subcategories.find((s) => s.id === selectedSubcategory);
                  return sub ? (
                    <>
                      <h2 className="text-xl font-bold text-[var(--color-foreground)] text-balance">
                        {sub.name}
                      </h2>
                      <p className="text-[var(--color-foreground)]/60 text-pretty leading-relaxed">
                        {sub.description}
                      </p>
                    </>
                  ) : null;
                })()}
              </motion.div>
            )}

            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {displayedShoes.map((shoe, index) => (
                  <motion.div
                    key={shoe.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ShoeCard shoe={shoe} index={0} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {displayedShoes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[var(--color-foreground)]/60">
                  해당 서브카테고리에 모델이 없습니다.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
