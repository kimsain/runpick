'use client';

import { useEffect, useMemo, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShoeCard from '@/components/shoe/ShoeCard';
import Badge from '@/components/common/Badge';
import BrandSwitcher from '@/components/common/BrandSwitcher';
import TextReveal from '@/components/effects/TextReveal';
import MagneticElement from '@/components/effects/MagneticElement';
import { categories } from '@/data/categories';
import { getShoesByBrand, getBrandById } from '@/utils/shoe-utils';
import { getBrandThemeVars } from '@/utils/brand-utils';
import Link from 'next/link';
import { DUR_FAST } from '@/constants/animation';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { useScrollVisibility } from '@/hooks/useScrollVisibility';
import { useInteractionCapabilities } from '@/hooks/useInteractionCapabilities';

interface BrandPageClientProps {
  brandId: string;
}

export default function BrandPageClient({ brandId }: BrandPageClientProps) {
  const brand = useMemo(() => getBrandById(brandId), [brandId]);
  const shoes = useMemo(() => getShoesByBrand(brandId), [brandId]);
  const shoesByCategory = useMemo(() => {
    const grouped = new Map<string, typeof shoes>();
    for (const category of categories) {
      grouped.set(category.id, []);
    }
    for (const shoe of shoes) {
      const bucket = grouped.get(shoe.categoryId);
      if (bucket) {
        bucket.push(shoe);
      } else {
        grouped.set(shoe.categoryId, [shoe]);
      }
    }
    return grouped;
  }, [shoes]);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const { hasMotionBudget } = useInteractionCapabilities();
  const animateEnabled = !useReducedMotion() && hasMotionBudget;
  const { isHidden: headerHidden } = useScrollVisibility({ enabled: isDesktop });

  useEffect(() => {
    if (brandId) {
      window.localStorage.setItem('runpick.preferredBrand', brandId);
    }
  }, [brandId]);

  if (!brand) {
    return (
      <>
        <Header />
        <main id="main-content" className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="type-h1 text-[var(--color-foreground)]">
              브랜드를 찾을 수 없습니다
            </h1>
            <p className="mt-3 type-body text-[var(--color-foreground)]/60">
              요청하신 브랜드 경로가 유효하지 않습니다.
            </p>
            <Link
              href="/brand"
              className="mt-6 inline-flex items-center min-h-11 type-body text-[var(--color-asics-accent)]"
            >
              ← 브랜드 선택으로 돌아가기
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const brandThemeVars = useMemo(
    () => getBrandThemeVars(brand.id, brand.color),
    [brand.id, brand.color]
  );

  return (
    <>
      <Header />
      <main id="main-content" className="pt-20" style={brandThemeVars}>
        {/* Hero Section */}
        <section className="section-space-tight bg-gradient-to-b from-[var(--color-card)] to-[var(--color-background)] relative overflow-hidden">
          <div className="relative layout-shell">
            <div className="text-center">
              <TextReveal
                as="h1"
                mode="clip"
                className="type-h1 text-balance"
              >
                <span style={{ color: brand.color }}>{brand.name}</span>
              </TextReveal>
              <motion.p
                initial={animateEnabled ? { opacity: 0, y: 10 } : false}
                animate={animateEnabled ? { opacity: 1, y: 0 } : undefined}
                transition={animateEnabled ? { delay: 0.3 } : undefined}
                className="mt-4 type-lead text-[var(--color-foreground)]/62 reading-measure text-pretty"
              >
                {brand.description}
              </motion.p>
              <motion.p
                initial={animateEnabled ? { opacity: 0 } : false}
                animate={animateEnabled ? { opacity: 1 } : undefined}
                transition={animateEnabled ? { delay: 0.5 } : undefined}
                className="mt-2 type-caption text-[var(--color-foreground)]/42"
              >
                {shoes.length}개 모델
              </motion.p>
              <div className="mt-5">
                <BrandSwitcher currentBrandId={brand.id} className="justify-center" />
              </div>
            </div>
          </div>
        </section>

        {/* Category Navigation — fixed below header, follows header hide/show */}
        <motion.section
          animate={animateEnabled ? { y: headerHidden ? -64 : 0 } : undefined}
          initial={animateEnabled ? false : undefined}
          transition={animateEnabled ? { duration: DUR_FAST, ease: 'easeOut' } : undefined}
          className="fixed top-16 left-0 right-0 pt-2 pb-3 sm:py-3 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur-sm z-40"
        >
          <div className="layout-shell">
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto overscroll-x-contain scrollbar-hide pb-2 snap-x snap-mandatory touch-pan-x">
              {categories.map((category) => (
                  <MagneticElement key={category.id} strength={0.2} radius={120}>
                    <Link href={`/brand/${brandId}/${category.id}`}>
                      <motion.div
                      whileHover={animateEnabled ? { scale: 1.05 } : undefined}
                      whileTap={animateEnabled ? { scale: 0.95 } : undefined}
                      className="px-3.5 py-2 min-h-11 sm:px-6 sm:py-3 rounded-full border border-[var(--color-border)] hover:border-transparent transition-all cursor-pointer whitespace-nowrap shrink-0 snap-start"
                      style={{
                        background: `linear-gradient(135deg, transparent, ${category.color}10)`,
                      }}
                    >
                      <span className="mr-1 sm:mr-2">{category.icon}</span>
                      <span style={{ color: category.color }} className="type-body">
                        {category.name}
                      </span>
                      <span className="type-caption ml-0.5 sm:ml-2 text-[var(--color-foreground)]/40">
                        {shoesByCategory.get(category.id)?.length || 0}
                      </span>
                    </motion.div>
                  </Link>
                </MagneticElement>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Spacer for fixed category nav */}
        <div className="h-16 sm:h-12" />

        {/* All Shoes by Category */}
        <div ref={sectionsRef}>
          {categories.map((category) => {
            const categoryShoes = shoesByCategory.get(category.id) || [];
            if (categoryShoes.length === 0) return null;

            return (
              <section
                key={category.id}
                className="category-section py-10"
                id={category.id}
              >
                <div className="layout-shell">
              <motion.div
                initial={animateEnabled ? { opacity: 0, y: 20 } : false}
                whileInView={animateEnabled ? { opacity: 1, y: 0 } : undefined}
                viewport={{ once: true }}
                className="mb-8"
              >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{category.icon}</span>
                      <h2
                        className="type-h2 text-balance"
                        style={{ color: category.color }}
                      >
                        {category.name}
                      </h2>
                      <Badge variant="category" categoryId={category.id}>
                        {category.nameKo}
                      </Badge>
                    </div>
                    <p className="type-body text-[var(--color-foreground)]/62 text-pretty">
                      {category.description}
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryShoes.map((shoe, index) => (
                      <ShoeCard key={shoe.id} shoe={shoe} index={index} />
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
