'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import ShoeCard from '@/components/shoe/ShoeCard';
import { getAllShoes } from '@/utils/shoe-utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextReveal from '@/components/effects/TextReveal';
import { EASE_OUT_EXPO, DUR_REVEAL } from '@/constants/animation';
import { useIsDesktop } from '@/hooks/useIsDesktop';

// Featured badge component
function FeaturedBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="inline-flex items-center gap-2 mb-8"
    >
      <div
        className="featured-badge-pulse flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[var(--color-asics-blue)]/20 to-[var(--color-asics-accent)]/20 border border-[var(--color-asics-accent)]/30"
        style={{
          boxShadow: '0 0 8px 1px rgba(0, 209, 255, 0.15)',
        }}
      >
        <span className="text-lg">⭐</span>
        <span className="text-sm font-semibold text-[var(--color-asics-accent)]">
          RUNNER&apos;S CHOICE
        </span>
        <span className="text-lg">🔥</span>
      </div>
    </motion.div>
  );
}

// Enhanced shoe card wrapper with spotlight effect
function SpotlightShoeCard({ shoe, index }: { shoe: NonNullable<ReturnType<typeof getAllShoes>[0]>; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative shrink-0 w-[80vw] md:w-[33vw] px-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Spotlight/glow effect behind card */}
      <motion.div
        className="absolute -inset-4 rounded-3xl pointer-events-none"
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.9,
        }}
        transition={{ duration: 0.3 }}
        style={{
          background: `radial-gradient(circle at 50% 50%, var(--color-asics-blue)30 0%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
      />

      {/* Ranking badge */}
      <motion.div
        className="absolute -top-3 -left-1 z-20 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
        style={{
          background: `linear-gradient(135deg, var(--color-asics-blue), var(--color-asics-accent))`,
          boxShadow: '0 4px 15px var(--color-asics-blue)',
        }}
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.5,
          delay: 0.4 + index * 0.15,
          type: 'spring',
          stiffness: 200,
        }}
        whileHover={{ scale: 1.1, rotate: 10 }}
      >
        #{index + 1}
      </motion.div>

      {/* Popular tag for first item */}
      {index === 0 && (
        <motion.div
          className="absolute -top-3 right-5 z-20 px-3 py-1 rounded-full text-xs font-bold text-white"
          style={{
            background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
            boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
          }}
          initial={{ scale: 0, y: -20 }}
          whileInView={{ scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.4,
            delay: 0.6,
            type: 'spring',
          }}
        >
          <span>MOST POPULAR</span>
        </motion.div>
      )}

      {/* The actual shoe card */}
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="relative z-10"
      >
        <ShoeCard shoe={shoe} index={index} />
      </motion.div>

      {/* Bottom highlight line */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 rounded-full"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--color-asics-accent), transparent)',
        }}
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: isHovered ? '80%' : '0%',
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}

export default function FeaturedShoes() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const allShoes = getAllShoes();
  // 각 카테고리에서 인기 모델 Top 5
  const featuredShoes = [
    allShoes.find((s) => s.id === 'novablast-5'),
    allShoes.find((s) => s.id === 'superblast-2'),
    allShoes.find((s) => s.id === 'metaspeed-sky-tokyo'),
    allShoes.find((s) => s.id === 'gel-nimbus-28'),
    allShoes.find((s) => s.id === 'magic-speed-5'),
  ].filter(Boolean);

  // GSAP pin needs wider viewport (1024px+) — at 768px cards are too narrow
  const isPinDesktop = useIsDesktop(1024);

  // Desktop: GSAP horizontal scroll with pin
  useEffect(() => {
    if (!isPinDesktop) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const container = scrollContainerRef.current;
      const cards = container?.querySelector('.horizontal-cards') as HTMLElement | null;
      if (cards && container) {
        gsap.to(cards, {
          x: () => -(cards.scrollWidth - window.innerWidth + 100),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${cards.scrollWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isPinDesktop]);

  return (
    <section ref={sectionRef} className="relative bg-[var(--color-background)]">
      <div
        ref={scrollContainerRef}
        className={`relative flex flex-col justify-center overflow-hidden ${!isPinDesktop ? '' : 'min-h-screen'}`}
        data-cursor="drag"
      >
        {/* Section header */}
        <div className="text-center pt-20 md:pt-8 pb-12 md:pb-4 px-4">
          <FeaturedBadge />

          <TextReveal
            as="h2"
            mode="clip"
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-balance leading-tight"
          >
            <span
              className="inline-block"
              style={{
                backgroundImage: 'linear-gradient(90deg, var(--color-foreground), var(--color-asics-blue), var(--color-asics-accent))',
                backgroundSize: '100% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              인기 러닝화
            </span>
          </TextReveal>

          <motion.p
            className="mt-5 text-lg sm:text-xl text-[var(--color-foreground)]/60 text-pretty"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: DUR_REVEAL, delay: 0.2, ease: EASE_OUT_EXPO as unknown as number[] }}
          >
            러너들이 가장 사랑하는 모델들
          </motion.p>
        </div>

        {/* Horizontal scrolling cards */}
        <div
          className={`horizontal-cards flex items-center gap-8 pl-[5vw] md:pl-[10vw] pr-[10vw] pb-20 md:pb-6 ${
            !isPinDesktop ? 'mobile-scroll-snap scrollbar-hide' : ''
          }`}
        >
          {featuredShoes.map((shoe, index) => (
            shoe && <SpotlightShoeCard key={shoe.id} shoe={shoe} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
