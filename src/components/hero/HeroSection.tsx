'use client';

// Home page hero section. Static background (no parallax — causes flickering).
// Contains: eyebrow badge, headline with TextReveal, subtitle, CTA buttons,
// and ScrollIndicator (desktop only, CSS @keyframes animation).

import { motion } from 'framer-motion';
import Button from '@/components/common/Button';
import TextReveal from '@/components/effects/TextReveal';
import MagneticElement from '@/components/effects/MagneticElement';
import { EASE_OUT_EXPO, STAGGER_NORMAL } from '@/constants/animation';

// Pulsing CTA button wrapper
function PulsingButton({ children, href, variant = 'primary', delay = 0 }: {
  children: React.ReactNode;
  href: string;
  variant?: 'primary' | 'outline';
  delay?: number;
}) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: EASE_OUT_EXPO as unknown as number[],
      }}
    >
      <Button href={href} size="lg" variant={variant === 'outline' ? 'outline' : undefined}>
        {children}
      </Button>
    </motion.div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient - static to prevent flicker */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[var(--color-background)] via-[var(--color-background)] to-[var(--color-asics-blue)]/10"
      />

      {/* Static gradient overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'linear-gradient(135deg, transparent 20%, var(--color-asics-blue) 50%, var(--color-asics-accent) 80%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Content */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Eyebrow with shimmer effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative inline-block mb-6"
          >
            <span
              className="hero-eyebrow-badge relative z-10 text-[11px] sm:text-sm font-medium tracking-wider uppercase px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[var(--color-asics-accent)]/30 bg-[var(--color-asics-accent)]/5 text-center text-[var(--color-asics-accent)]"
              style={{
                boxShadow: '0 0 8px 1px rgba(0, 209, 255, 0.15)',
              }}
            >
              Running Shoe Catalog & Recommendation
            </span>
          </motion.div>

          {/* Main headline with TextReveal */}
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-balance leading-[1.15]" data-cursor="text">
            <TextReveal
              as="span"
              mode="clip"
              delay={0.4}
              className="block text-[var(--color-foreground)]"
            >
              당신에게 딱 맞는
            </TextReveal>
            <span className="block mt-2 relative">
              {/* Glow backdrop */}
              <span
                className="absolute inset-0 blur-2xl hidden md:block"
                style={{
                  opacity: 0.4,
                  background: 'linear-gradient(90deg, var(--color-asics-blue), var(--color-asics-accent), var(--color-asics-blue))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                aria-hidden="true"
              >
                러닝화를 찾아드립니다
              </span>

              <TextReveal
                as="span"
                mode="clip"
                delay={0.7}
                className="inline-block font-extrabold text-white relative"
              >
                <span
                  className="inline-block hero-headline-glow"
                  style={{
                    textShadow: '0 0 15px rgba(0, 209, 255, 0.6), 0 0 30px rgba(0, 61, 165, 0.4)',
                  }}
                >
                  러닝화를 찾아드립니다
                </span>
              </TextReveal>
            </span>
          </h1>

          {/* Subtitle with fade in */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6, ease: EASE_OUT_EXPO as unknown as number[] }}
            className="mt-8 text-lg sm:text-xl text-[var(--color-foreground)]/60 max-w-2xl mx-auto text-pretty leading-relaxed"
          >
            Daily, Super Trainer, Racing 카테고리별로 정리된 러닝화 카탈로그와
            맞춤 추천 퀴즈로 완벽한 러닝화를 찾아보세요.
          </motion.p>

          {/* CTA Buttons with stagger clip-path reveal */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <PulsingButton href="/quiz" delay={1.5}>
              나에게 맞는 신발 찾기
            </PulsingButton>
            <PulsingButton href="/brand/asics" variant="outline" delay={1.5 + STAGGER_NORMAL}>
              카탈로그 둘러보기
            </PulsingButton>
          </div>
        </motion.div>

      </div>

      {/* Enhanced scroll indicator wrapped with MagneticElement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <MagneticElement strength={0.25}>
          <ScrollIndicator />
        </MagneticElement>
      </motion.div>
    </section>
  );
}

function ScrollIndicator() {
  return (
    <motion.div
      className="flex flex-col items-center gap-3 cursor-pointer group"
      whileHover={{ scale: 1.1 }}
      data-cursor="pointer"
    >
      <span className="text-xs tracking-wider uppercase font-medium text-[var(--color-foreground)]/50 group-hover:text-[var(--color-asics-accent)] transition-colors">
        Scroll to explore
      </span>

      <div className="relative scroll-indicator-mouse">
        <div className="w-6 h-10 rounded-full border-2 border-[var(--color-foreground)]/30 group-hover:border-[var(--color-asics-accent)]/50 transition-colors flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 rounded-full bg-gradient-to-b from-[var(--color-asics-accent)] to-[var(--color-asics-blue)] scroll-indicator-dot" />
        </div>
      </div>

      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        className="text-[var(--color-foreground)]/40 group-hover:text-[var(--color-asics-accent)] transition-colors"
      >
        <path d="M7 13l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 7l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
      </svg>
    </motion.div>
  );
}
