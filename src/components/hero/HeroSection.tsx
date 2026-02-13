'use client';

// Home page hero section. Static background (no parallax — causes flickering).
// Contains: eyebrow badge, headline with TextReveal, subtitle, CTA buttons,
// and ScrollIndicator (desktop only, CSS @keyframes animation).

import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import Button from '@/components/common/Button';
import TextReveal from '@/components/effects/TextReveal';
import MagneticElement from '@/components/effects/MagneticElement';
import { EASE_OUT_EXPO, STAGGER_NORMAL } from '@/constants/animation';

// Pulsing CTA button wrapper
function PulsingButton({
  children,
  href,
  variant = 'primary',
  delay = 0,
  animateEnabled = true,
}: {
  children: React.ReactNode;
  href: string;
  variant?: 'primary' | 'outline';
  delay?: number;
  animateEnabled?: boolean;
}) {
  return (
    <motion.div
      className="relative"
      initial={animateEnabled ? { opacity: 0, y: 20 } : false}
      animate={animateEnabled ? { opacity: 1, y: 0 } : undefined}
      transition={
        animateEnabled
          ? {
              duration: 0.6,
              delay,
              ease: EASE_OUT_EXPO as unknown as number[],
            }
          : undefined
      }
    >
      <Button href={href} size="lg" variant={variant === 'outline' ? 'outline' : undefined}>
        {children}
      </Button>
    </motion.div>
  );
}

export default function HeroSection() {
  const animateEnabled = !useReducedMotion();

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
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
        className="relative z-10 layout-shell pt-24 pb-16 sm:pt-28 sm:pb-20 text-center"
      >
        <motion.div
          initial={animateEnabled ? { opacity: 0 } : false}
          animate={animateEnabled ? { opacity: 1 } : undefined}
          transition={animateEnabled ? { duration: 0.5 } : undefined}
        >
          {/* Eyebrow with shimmer effect */}
          <motion.div
            initial={animateEnabled ? { opacity: 0, y: 20 } : false}
            animate={animateEnabled ? { opacity: 1, y: 0 } : undefined}
            transition={
              animateEnabled
                ? { delay: 0.2, duration: 0.6 }
                : undefined
            }
            className="relative inline-block mb-6"
          >
            <span
              className="hero-eyebrow-badge type-eyebrow relative z-10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[var(--color-asics-accent)]/30 bg-[var(--color-asics-accent)]/5 text-center text-[var(--color-asics-accent)]"
              style={{
                boxShadow: '0 0 8px 1px rgba(0, 209, 255, 0.15)',
              }}
            >
              Running Shoe Catalog & Recommendation
            </span>
          </motion.div>

          {/* Main headline with TextReveal */}
          <h1 className="type-display text-balance" data-cursor="text">
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
                className="inline-block text-white relative"
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
            initial={animateEnabled ? { opacity: 0, y: 20 } : false}
            animate={animateEnabled ? { opacity: 1, y: 0 } : undefined}
            transition={
              animateEnabled
                ? { delay: 1.2, duration: 0.6, ease: EASE_OUT_EXPO as unknown as number[] }
                : undefined
            }
            className="mt-7 sm:mt-8 type-lead text-[var(--color-foreground)]/65 reading-measure text-pretty"
          >
            Daily, Super Trainer, Racing 카테고리별로 정리된 러닝화 카탈로그와
            맞춤 추천 퀴즈로 완벽한 러닝화를 찾아보세요.
          </motion.p>

          {/* CTA Buttons with stagger clip-path reveal */}
          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <PulsingButton href="/quiz" delay={1.5} animateEnabled={animateEnabled}>
              나에게 맞는 신발 찾기
            </PulsingButton>
            <PulsingButton
              href="/brand"
              variant="outline"
              delay={1.5 + STAGGER_NORMAL}
              animateEnabled={animateEnabled}
            >
              카탈로그 둘러보기
            </PulsingButton>
          </div>
        </motion.div>

      </div>

      {/* Enhanced scroll indicator wrapped with MagneticElement */}
      <motion.div
        initial={animateEnabled ? { opacity: 0, y: 20 } : false}
        animate={animateEnabled ? { opacity: 1, y: 0 } : undefined}
        transition={animateEnabled ? { delay: 2.0, duration: 0.6 } : undefined}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <MagneticElement strength={0.25}>
          <ScrollIndicator animateEnabled={animateEnabled} />
        </MagneticElement>
      </motion.div>
    </section>
  );
}

function ScrollIndicator({ animateEnabled = true }: { animateEnabled?: boolean }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-3 group"
      whileHover={animateEnabled ? { scale: 1.1 } : undefined}
      data-cursor="pointer"
    >
      <a
        href="#category-nav"
        aria-label="카테고리 섹션으로 이동"
        className="flex flex-col items-center gap-3"
      >
        <span className="text-xs tracking-wider uppercase font-medium text-[var(--color-foreground)]/50 group-hover:text-[var(--color-asics-accent)] transition-colors">
          카테고리로 이동
        </span>

        <span className="relative scroll-indicator-mouse block">
          <div className="w-6 h-10 rounded-full border-2 border-[var(--color-foreground)]/30 group-hover:border-[var(--color-asics-accent)]/50 transition-colors flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 rounded-full bg-gradient-to-b from-[var(--color-asics-accent)] to-[var(--color-asics-blue)] scroll-indicator-dot" />
          </div>
        </span>

        <span className="text-[var(--color-foreground)]/40 group-hover:text-[var(--color-asics-accent)] transition-colors">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path d="M7 13l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 7l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
          </svg>
        </span>
      </a>
    </motion.div>
  );
}
