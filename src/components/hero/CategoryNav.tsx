'use client';

// Category navigation grid (daily, super-trainer, racing).
// 6 core hover effects per card. GSAP header reveal (desktop only).
// Links to /brand?category={categoryId}. Colors from categories.ts.

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { categories } from '@/data/categories';
import { getAllBrandIds } from '@/utils/shoe-utils';
import { gsap, ensureScrollTriggerRegistration } from '@/lib/scroll-trigger';
import TextReveal from '@/components/effects/TextReveal';
import MagneticElement from '@/components/effects/MagneticElement';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { useInteractionCapabilities } from '@/hooks/useInteractionCapabilities';

// Category card component — 6 core hover effects only
function CategoryCard({
  category,
  index,
  preferredBrandId,
  animateEnabled,
}: {
  category: typeof categories[0];
  index: number;
  preferredBrandId: string | null;
  animateEnabled: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const href = preferredBrandId
    ? `/brand/${preferredBrandId}/${category.id}`
    : `/brand?category=${category.id}`;

  return (
    <motion.div
      initial={animateEnabled ? { opacity: 0, y: 50, rotateX: -5 } : false}
      whileInView={animateEnabled ? { opacity: 1, y: 0, rotateX: 0 } : undefined}
      viewport={{ once: true }}
      transition={
        animateEnabled
          ? {
              duration: 0.7,
              delay: index * 0.15,
              ease: [0.215, 0.61, 0.355, 1],
            }
          : undefined
      }
      style={{ perspective: '1000px' }}
    >
      <MagneticElement strength={0.15}>
        <Link href={href}>
          <motion.div
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={animateEnabled ? { y: -12, scale: 1.03, zIndex: 20 } : undefined}
            whileTap={animateEnabled ? { scale: 0.97 } : undefined}
            className="group relative h-[17.5rem] sm:h-[18.5rem] rounded-3xl overflow-hidden border border-[var(--color-border)] hover:border-transparent transition-all duration-500"
            style={{
              background: `linear-gradient(135deg, var(--color-card) 0%, var(--color-card-hover) 100%)`,
              transformStyle: 'preserve-3d',
            }}
            data-cursor="view"
          >
            {/* 1. Glowing border effect */}
            {animateEnabled && (
              <motion.div
                className="absolute inset-0 rounded-3xl"
                animate={{
                  boxShadow: isHovered
                    ? `inset 0 0 0 2px ${category.color}, 0 0 40px ${category.color}40, 0 20px 40px ${category.color}20`
                    : `inset 0 0 0 0px transparent, 0 0 0px transparent`,
                }}
                transition={{ duration: 0.4 }}
              />
            )}

            {/* 2. Top accent line */}
            {animateEnabled && (
              <motion.div
                className="absolute top-0 left-0 right-0 h-1"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isHovered ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  background: `linear-gradient(90deg, transparent, ${category.color}, transparent)`,
                  transformOrigin: 'center',
                }}
              />
            )}

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center p-5 sm:p-8 text-center">
              {/* 3. Icon container scale */}
              {animateEnabled ? (
                <motion.div
                  className="relative mb-3 sm:mb-6"
                  animate={{ scale: isHovered ? 1.2 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-4xl sm:text-6xl block">
                    {category.icon}
                  </span>
                </motion.div>
              ) : (
                <div className="relative mb-3 sm:mb-6">
                  <span className="text-4xl sm:text-6xl block">{category.icon}</span>
                </div>
              )}

              {/* 4. Category name with textShadow */}
              <motion.h3
                className="type-h3 mb-2 transition-all duration-300 text-balance"
                style={{
                  color: category.color,
                  textShadow: isHovered && animateEnabled ? `0 0 20px ${category.color}80` : 'none',
                }}
              >
                {category.name}
              </motion.h3>

              <p className="type-caption text-[var(--color-foreground)]/60 mb-2">
                {category.nameKo}
              </p>

              <p className="type-body text-[var(--color-foreground)]/52 line-clamp-2 max-w-[30ch]">
                {category.description}
              </p>

              {/* Subcategory badge */}
              <div className="mt-5 flex items-center gap-2">
                <span
                  className="type-caption px-3 py-1.5 rounded-full font-medium"
                  style={{
                    backgroundColor: `${category.color}20`,
                    color: category.color,
                    border: `1px solid ${category.color}40`,
                  }}
                >
                  {category.subcategories.length}개 서브카테고리
                </span>
              </div>

              {/* 5+6. Arrow with x + opacity */}
              <motion.div
                className="absolute bottom-5 right-5"
                animate={animateEnabled ? {
                  x: isHovered ? 5 : 0,
                  opacity: isHovered ? 1 : 0.4,
                } : undefined}
                transition={animateEnabled ? { duration: 0.3 } : undefined}
              >
                <span
                  className="text-xl"
                  style={{ color: isHovered ? category.color : 'var(--color-foreground)' }}
                >
                  →
                </span>
              </motion.div>
            </div>
          </motion.div>
        </Link>
      </MagneticElement>
    </motion.div>
  );
}

export default function CategoryNav() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const [preferredBrandId, setPreferredBrandId] = useState<string | null>(null);
  const { hasMotionBudget } = useInteractionCapabilities();
  const animateEnabled = !useReducedMotion() && hasMotionBudget;
  const isEnabled = isDesktop && animateEnabled;

  useEffect(() => {
    if (!isEnabled) return;
    ensureScrollTriggerRegistration();

    const ctx = gsap.context(() => {
      // Header reveal animation — play once, never reverse
      if (headerRef.current) {
        gsap.to(headerRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isEnabled]);

  useEffect(() => {
    const stored = window.localStorage.getItem('runpick.preferredBrand');
    const valid = stored && getAllBrandIds().includes(stored) ? stored : null;
    setPreferredBrandId(valid);
  }, []);

  return (
    <section
      id="category-nav"
      className="section-space bg-gradient-to-b from-[var(--color-background)] to-[var(--color-card)] scroll-anchor-safe"
      ref={sectionRef}
    >
      <div className="layout-shell">
        {/* Animated section header */}
        <div
          ref={headerRef}
          className="text-center mb-10 sm:mb-16 category-nav-header"
        >
          {/* Decorative line */}
          <motion.div
            initial={animateEnabled ? { scaleX: 0 } : false}
            whileInView={animateEnabled ? { scaleX: 1 } : undefined}
            viewport={{ once: true }}
            transition={animateEnabled ? { duration: 0.8, delay: 0.2 } : undefined}
            className="w-20 h-1 mx-auto mb-6 rounded-full bg-gradient-to-r from-[var(--color-asics-blue)] to-[var(--color-asics-accent)]"
          />

          <TextReveal
            as="h2"
            mode="clip"
            className="type-h1 text-[var(--color-foreground)] text-balance"
          >
            <span
              style={{
                backgroundImage: 'linear-gradient(90deg, var(--color-foreground), var(--color-asics-blue), var(--color-asics-accent))',
                backgroundSize: '100% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              러닝화 카테고리
            </span>
          </TextReveal>

          <motion.p
            className="mt-4 type-lead text-[var(--color-foreground)]/62 text-pretty reading-measure"
            initial={animateEnabled ? { opacity: 0 } : false}
            whileInView={animateEnabled ? { opacity: 1 } : undefined}
            viewport={{ once: true }}
            transition={animateEnabled ? { duration: 0.6, delay: 0.5 } : undefined}
          >
            목적에 맞는 카테고리를 선택해보세요
          </motion.p>

          <p className="mt-3 type-caption text-[var(--color-foreground)]/45">
            {preferredBrandId
              ? `선호 브랜드(${preferredBrandId.toUpperCase()}) 기준으로 바로 이동합니다.`
              : '카테고리 선택 후 브랜드를 고를 수 있습니다.'}
          </p>

          {/* Animated dots */}
          <motion.div
            className="hidden md:flex justify-center gap-2 mt-6"
            initial={animateEnabled ? { opacity: 0 } : false}
            whileInView={animateEnabled ? { opacity: 1 } : undefined}
            viewport={{ once: true }}
            transition={animateEnabled ? { delay: 0.6 } : undefined}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: i === 0
                    ? 'var(--color-daily)'
                    : i === 1
                      ? 'var(--color-super-trainer)'
                      : 'var(--color-racing)',
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Category cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7" style={{ perspective: '1000px' }}>
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={index}
              preferredBrandId={preferredBrandId}
              animateEnabled={animateEnabled}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
