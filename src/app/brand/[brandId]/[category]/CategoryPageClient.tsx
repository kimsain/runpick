'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useState, useEffect, useRef, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShoeCard from '@/components/shoe/ShoeCard';
import BrandSwitcher from '@/components/common/BrandSwitcher';
import TextReveal from '@/components/effects/TextReveal';
import { getCategoryById, getSubcategoriesByCategory } from '@/data/categories';
import { getBrandById, getShoesByBrandAndCategory } from '@/utils/shoe-utils';
import { getBrandThemeVars } from '@/utils/brand-utils';
import { CategoryId, SubcategoryId } from '@/types/shoe';
import Link from 'next/link';
import { DUR_FAST } from '@/constants/animation';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { useScrollVisibility } from '@/hooks/useScrollVisibility';
import { useInteractionCapabilities } from '@/hooks/useInteractionCapabilities';

interface CategoryPageClientProps {
  brandId: string;
  category: string;
}

export default function CategoryPageClient({ brandId, category }: CategoryPageClientProps) {
  const categoryId = category as CategoryId;
  const categoryData = useMemo(() => getCategoryById(categoryId), [categoryId]);
  const subcategories = useMemo(() => getSubcategoriesByCategory(categoryId), [categoryId]);
  const allCategoryShoes = useMemo(
    () => getShoesByBrandAndCategory(brandId, categoryId),
    [brandId, categoryId]
  );
  const brand = useMemo(() => getBrandById(brandId), [brandId]);
  const isDesktop = useIsDesktop();
  const { hasMotionBudget } = useInteractionCapabilities();
  const animateEnabled = !useReducedMotion() && hasMotionBudget;

  const [selectedSubcategory, setSelectedSubcategory] = useState<SubcategoryId | 'all'>(
    'all'
  );
  const listSectionRef = useRef<HTMLElement>(null);

  const { isHidden: headerHidden } = useScrollVisibility({ enabled: isDesktop });

  useEffect(() => {
    if (brandId) {
      window.localStorage.setItem('runpick.preferredBrand', brandId);
    }
  }, [brandId]);

  if (!categoryData) {
    return (
      <>
        <Header />
        <main id="main-content" className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="type-h1 text-[var(--color-foreground)]">
              카테고리를 찾을 수 없습니다
            </h1>
            <Link
              href={`/brand/${brandId}`}
              className="mt-4 inline-flex min-h-11 items-center type-body text-[var(--color-asics-accent)]"
            >
              ← 브랜드 페이지로 돌아가기
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const displayedShoes = useMemo(
    () =>
      selectedSubcategory === 'all'
        ? allCategoryShoes
        : allCategoryShoes.filter((s) => s.subcategoryId === selectedSubcategory),
    [allCategoryShoes, selectedSubcategory]
  );
  const subcategoryCounts = useMemo(() => {
    const counts = new Map<SubcategoryId, number>();
    allCategoryShoes.forEach((shoe) => {
      const key = shoe.subcategoryId as SubcategoryId;
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return counts;
  }, [allCategoryShoes]);
  const visibleSubcategories = useMemo(
    () => subcategories.filter((sub) => (subcategoryCounts.get(sub.id) || 0) > 0),
    [subcategories, subcategoryCounts]
  );
  const selectedSubcategoryInfo = useMemo(
    () =>
      selectedSubcategory === 'all'
        ? null
        : subcategories.find((sub) => sub.id === selectedSubcategory) || null,
    [selectedSubcategory, subcategories]
  );
  const brandThemeVars = useMemo(
    () => getBrandThemeVars(brandId, brand?.color),
    [brandId, brand?.color]
  );

  const handleSelectSubcategory = (next: SubcategoryId | 'all') => {
    setSelectedSubcategory(next);

    if (!isDesktop) {
      window.requestAnimationFrame(() => {
        const top = listSectionRef.current?.getBoundingClientRect().top;
        if (typeof top !== 'number') return;
        const targetY = window.scrollY + top - 116;
        window.scrollTo({ top: Math.max(targetY, 0), behavior: 'smooth' });
      });
    }
  };

  return (
    <>
      <Header />
      <main id="main-content" className="pt-20" style={brandThemeVars}>
        {/* Hero Section */}
        <section
          className="section-space-tight relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, var(--color-card) 0%, var(--color-background) 100%)`,
          }}
        >
          {/* Glow effect */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 100%, ${categoryData.color} 0%, transparent 50%)`,
            }}
          />

          <div className="relative layout-shell text-center">
            <motion.div
              initial={animateEnabled ? { opacity: 0, y: 20 } : false}
              animate={animateEnabled ? { opacity: 1, y: 0 } : undefined}
              transition={animateEnabled ? { duration: DUR_FAST } : undefined}
            >
              <Link
                href={`/brand/${brandId}`}
                className="inline-flex items-center gap-2 type-caption text-[var(--color-foreground)]/60 hover:text-[var(--color-foreground)] mb-4"
              >
                ← {brand?.name || brandId.toUpperCase()}
              </Link>

              <motion.span
                className="block text-4xl sm:text-6xl mb-4"
                initial={animateEnabled ? { scale: 0 } : false}
                animate={animateEnabled ? { scale: 1 } : undefined}
                transition={animateEnabled ? { type: 'spring', delay: 0.2 } : undefined}
              >
                {categoryData.icon}
              </motion.span>

              <TextReveal
                as="h1"
                mode="clip"
                className="type-h1 mb-4 text-balance"
              >
                <span style={{ color: categoryData.color }}>
                  {categoryData.name}
                </span>
              </TextReveal>
              <p className="type-lead text-[var(--color-foreground)]/62 reading-measure text-pretty">
                {categoryData.description}
              </p>
              <p className="mt-4 type-caption text-[var(--color-foreground)]/42">
                {allCategoryShoes.length}개 모델
              </p>
              <div className="mt-5">
                <BrandSwitcher
                  currentBrandId={brandId}
                  categoryId={categoryId}
                  className="justify-center"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Subcategory Tabs — fixed below header, follows header hide/show */}
        <motion.section
          animate={animateEnabled ? { y: isDesktop && headerHidden ? -64 : 0 } : undefined}
          initial={animateEnabled ? false : undefined}
          transition={animateEnabled ? { duration: DUR_FAST, ease: 'easeOut' } : undefined}
          className="fixed top-16 left-0 right-0 pt-2 pb-3 sm:py-3 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur-sm z-40"
        >
          <div className="layout-shell">
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto overscroll-x-contain pb-2 scrollbar-hide snap-x snap-mandatory touch-pan-x">
              <button
                onClick={() => handleSelectSubcategory('all')}
                className="relative px-4 py-2 min-h-11 rounded-full type-caption whitespace-nowrap transition-all snap-start"
                aria-pressed={selectedSubcategory === 'all'}
              >
                {selectedSubcategory === 'all' && animateEnabled && (
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

              {visibleSubcategories.map((sub) => {
                const count = subcategoryCounts.get(sub.id) || 0;
                return (
                  <button
                    key={sub.id}
                    onClick={() => handleSelectSubcategory(sub.id)}
                    className="relative px-4 py-2 min-h-11 rounded-full type-caption whitespace-nowrap transition-all snap-start"
                    aria-pressed={selectedSubcategory === sub.id}
                  >
                    {selectedSubcategory === sub.id && animateEnabled && (
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
        <div className="h-16 sm:h-12" />

        {/* Shoes Grid with AnimatePresence layout */}
        <section ref={listSectionRef} className="py-10">
          <div className="layout-shell">
            {selectedSubcategory !== 'all' && (
              <motion.div
                initial={animateEnabled ? { opacity: 0, y: 10 } : false}
                animate={animateEnabled ? { opacity: 1, y: 0 } : undefined}
                transition={animateEnabled ? { duration: DUR_FAST } : undefined}
                className="mb-8"
              >
                {selectedSubcategoryInfo ? (
                  <>
                    <h2 className="type-h2 text-[var(--color-foreground)] text-balance">
                      {selectedSubcategoryInfo.name}
                    </h2>
                    <p className="type-body text-[var(--color-foreground)]/62 text-pretty">
                      {selectedSubcategoryInfo.description}
                    </p>
                  </>
                ) : null}
              </motion.div>
            )}

            <motion.div
              layout={animateEnabled}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode={animateEnabled ? 'popLayout' : undefined}>
                {displayedShoes.map((shoe, index) => (
                  animateEnabled ? (
                    <motion.div
                      key={shoe.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <ShoeCard shoe={shoe} index={index} />
                    </motion.div>
                  ) : (
                    <ShoeCard key={shoe.id} shoe={shoe} index={index} />
                  )
                ))}
              </AnimatePresence>
            </motion.div>

            {displayedShoes.length === 0 && (
              <div className="text-center py-12">
                <p className="type-body text-[var(--color-foreground)]/60">
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
