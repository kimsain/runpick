'use client';

// Featured shoes horizontal scroll section. Manual shoe order (not sorted).
// Desktop (1024px+): GSAP pin + horizontal scrub scroll.
// Mobile/Tablet: CSS scroll-snap carousel. Uses isPinDesktop(1024), not 768.

import { motion } from 'framer-motion';
import { useState, useEffect, useRef, useMemo } from 'react';
import ShoeCard from '@/components/shoe/ShoeCard';
import { getAllShoes } from '@/utils/shoe-utils';
import { gsap, ensureScrollTriggerRegistration } from '@/lib/scroll-trigger';
import TextReveal from '@/components/effects/TextReveal';
import { EASE_OUT_EXPO, DUR_REVEAL } from '@/constants/animation';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { useReducedMotion } from 'framer-motion';
import { useInteractionCapabilities } from '@/hooks/useInteractionCapabilities';

// Enhanced shoe card wrapper with spotlight effect
function SpotlightShoeCard({
  shoe,
  index,
  animateEnabled,
}: {
  shoe: NonNullable<ReturnType<typeof getAllShoes>[0]>;
  index: number;
  animateEnabled: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative shrink-0 w-[86vw] sm:w-[72vw] md:w-[33vw] px-2 sm:px-4 snap-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Spotlight/glow effect behind card */}
      <motion.div
        className="absolute -inset-4 rounded-3xl pointer-events-none"
        animate={animateEnabled
          ? {
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.9,
            }
          : undefined}
        transition={animateEnabled ? { duration: 0.3 } : undefined}
        style={{
          background: `radial-gradient(circle at 50% 50%, var(--color-asics-blue)30 0%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
      />

      {/* The actual shoe card */}
      <motion.div
        whileHover={animateEnabled ? { y: -8, scale: 1.02, zIndex: 20 } : undefined}
        transition={animateEnabled ? { duration: 0.3 } : undefined}
        className="relative z-10"
      >
        {/* Ranking badge - moves with hovered/scaled card wrapper */}
        <motion.div
          className="pointer-events-none absolute -top-3 -left-1 z-40 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
          style={{
            background: `linear-gradient(135deg, var(--color-asics-blue), var(--color-asics-accent))`,
            boxShadow: '0 4px 15px var(--color-asics-blue)',
          }}
          initial={animateEnabled ? { scale: 0, rotate: -180 } : false}
          whileInView={animateEnabled ? { scale: 1, rotate: 0 } : undefined}
          viewport={{ once: true }}
          transition={
            animateEnabled
              ? {
                  duration: 0.5,
                  delay: 0.4 + index * 0.15,
                  type: 'spring',
                  stiffness: 200,
                }
              : undefined
          }
        >
          #{index + 1}
        </motion.div>

        {/* Popular tag for first item - follows card transform too */}
        {index === 0 && (
          <motion.div
            className="pointer-events-none absolute -top-3 right-5 z-40 px-3 py-1 rounded-full type-caption font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
              boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
            }}
            initial={animateEnabled ? { scale: 0, y: -20 } : false}
            whileInView={animateEnabled ? { scale: 1, y: 0 } : undefined}
            viewport={{ once: true }}
            transition={
              animateEnabled
                ? {
                    duration: 0.4,
                    delay: 0.6,
                    type: 'spring',
                  }
                : undefined
            }
          >
            <span>MOST POPULAR</span>
          </motion.div>
        )}

        <ShoeCard shoe={shoe} index={index} />
      </motion.div>

      {/* Bottom highlight line */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 rounded-full"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--color-asics-accent), transparent)',
          width: '80%',
          opacity: 0,
        }}
        initial={animateEnabled ? { width: 0, opacity: 0 } : undefined}
        animate={animateEnabled ? {
          width: isHovered ? '80%' : '0%',
          opacity: isHovered ? 1 : 0,
        } : {
          width: '0%',
          opacity: 0,
        }}
        transition={animateEnabled ? { duration: 0.3 } : undefined}
      />
    </div>
  );
}

export default function FeaturedShoes() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { hasMotionBudget } = useInteractionCapabilities();
  const animateEnabled = !useReducedMotion() && hasMotionBudget;

  const allShoes = useMemo(() => getAllShoes(), []);
  // 각 카테고리에서 인기 모델 Top 5
  const featuredShoes = useMemo(
    () =>
      [
        allShoes.find((s) => s.id === 'novablast-5'),
        allShoes.find((s) => s.id === 'superblast-2'),
        allShoes.find((s) => s.id === 'metaspeed-sky-tokyo'),
        allShoes.find((s) => s.id === 'gel-nimbus-28'),
        allShoes.find((s) => s.id === 'magic-speed-5'),
      ].filter(Boolean),
    [allShoes]
  );

  // GSAP pin needs wider viewport (1024px+) — at 768px cards are too narrow
  const isPinDesktop = useIsDesktop(1024);
  const isEnabled = isPinDesktop && animateEnabled;

  // Desktop: GSAP horizontal scroll with pin
  useEffect(() => {
    if (!isEnabled) return;
    ensureScrollTriggerRegistration();

    const ctx = gsap.context(() => {
      const container = scrollContainerRef.current;
      const cards = container?.querySelector('.horizontal-cards') as HTMLElement | null;
      if (cards && container) {
        const headerHeight = headerRef.current?.offsetHeight ?? 0;
        // Nudge pin start slightly lower so card bottom area (price) is visible before horizontal scroll begins.
        const startOffset = Math.min(
          Math.max(Math.round(headerHeight * 0.22) + 18, 40),
          84
        );

        gsap.to(cards, {
          x: () => -(cards.scrollWidth - window.innerWidth + 100),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: () => `top+=${startOffset} top`,
            end: () => `+=${cards.scrollWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isEnabled]);

  return (
    <section ref={sectionRef} className="relative bg-[var(--color-background)] section-space-tight">
      <div
        ref={scrollContainerRef}
        className={`relative flex flex-col justify-center overflow-x-hidden overflow-y-visible ${!isPinDesktop ? '' : 'min-h-screen'}`}
        data-cursor="drag"
      >
        {/* Section header */}
        <div ref={headerRef} className="text-center pt-6 md:pt-8 pb-8 md:pb-4 layout-shell">
          <TextReveal
            as="h2"
            mode="clip"
            className="type-h1 text-balance"
          >
            <span
              className="inline-block"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, var(--color-foreground), var(--color-asics-blue), var(--color-asics-accent))',
                backgroundSize: '100% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              인기 러닝화
            </span>
          </TextReveal>

          <motion.div
            className="mt-4 type-lead h-[1.7em]"
            initial={animateEnabled ? { opacity: 0 } : false}
            whileInView={animateEnabled ? { opacity: 1 } : undefined}
            viewport={{ once: true }}
            transition={
              animateEnabled
                ? { duration: DUR_REVEAL, delay: 0.2, ease: EASE_OUT_EXPO as unknown as number[] }
                : undefined
            }
            aria-hidden="true"
          />

          <p className="mt-2 type-caption text-[var(--color-foreground)]/45 md:hidden">
            좌우로 넘겨서 비교해보세요
          </p>
        </div>

        {/* Horizontal scrolling cards */}
        <div
          className={`horizontal-cards flex items-start md:items-center gap-4 sm:gap-8 pt-5 md:pt-0 pl-[4vw] md:pl-[10vw] pr-[8vw] md:pr-[10vw] pb-20 md:pb-6 overscroll-x-contain touch-pan-x ${
            !isPinDesktop ? 'mobile-scroll-snap scrollbar-hide' : ''
          }`}
        >
          {featuredShoes.map((shoe, index) => (
            shoe && (
              <SpotlightShoeCard
                key={shoe.id}
                shoe={shoe}
                index={index}
                animateEnabled={animateEnabled}
              />
            )
          ))}
        </div>
      </div>
    </section>
  );
}
