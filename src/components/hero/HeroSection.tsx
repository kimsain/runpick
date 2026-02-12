'use client';

import { motion } from 'framer-motion';
import Button from '@/components/common/Button';
import TextReveal from '@/components/effects/TextReveal';
import FloatingShapes from '@/components/effects/FloatingShapes';
import MagneticElement from '@/components/effects/MagneticElement';
import { EASE_OUT_EXPO, STAGGER_NORMAL } from '@/constants/animation';
import Sparkle from '@/components/effects/Sparkle';

// Pulsing CTA button wrapper
function PulsingButton({ children, href, variant = 'primary', delay = 0 }: {
  children: React.ReactNode;
  href: string;
  variant?: 'primary' | 'outline';
  delay?: number;
}) {
  const isPrimary = variant === 'primary';

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
      {/* Glow effect behind button */}
      {isPrimary && (
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--color-asics-blue)] to-[var(--color-asics-accent)] hidden md:block"
          style={{
            filter: 'blur(18px)',
            willChange: 'opacity, transform',
            animation: 'button-glow 2s ease-in-out infinite',
          }}
        />
      )}
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

      {/* Animated gradient wave background - CSS animation to avoid JS/scroll conflicts */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 hero-gradient-wave"
        />
      </div>

      {/* FloatingShapes replacing 20 particles */}
      <FloatingShapes color="var(--color-asics-blue)" count={4} />

      {/* Subtle sparkles (keep 5) */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        <Sparkle delay={0} x="12%" y="25%" />
        <Sparkle delay={1.2} x="88%" y="35%" />
        <Sparkle delay={2.4} x="8%" y="75%" />
        <Sparkle delay={0.8} x="92%" y="65%" />
        <Sparkle delay={1.6} x="50%" y="15%" />
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
                animation: 'badge-pulse 3s ease-in-out infinite',
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
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
      <motion.span
        className="text-xs tracking-wider uppercase font-medium text-[var(--color-foreground)]/50 group-hover:text-[var(--color-asics-accent)] transition-colors"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Scroll to explore
      </motion.span>

      {/* Mouse icon with animated scroll wheel */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        <div className="w-6 h-10 rounded-full border-2 border-[var(--color-foreground)]/30 group-hover:border-[var(--color-asics-accent)]/50 transition-colors flex items-start justify-center p-1.5">
          <motion.div
            animate={{
              y: [0, 8, 0],
              opacity: [1, 0.5, 1],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-3 rounded-full bg-gradient-to-b from-[var(--color-asics-accent)] to-[var(--color-asics-blue)]"
          />
        </div>

        {/* Pulsing ring effect */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[var(--color-asics-accent)]"
          animate={{
            scale: [1, 1.5, 1.5],
            opacity: [0.5, 0, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      </motion.div>

      {/* Bouncing arrow */}
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="text-[var(--color-foreground)]/40 group-hover:text-[var(--color-asics-accent)] transition-colors"
        >
          <motion.path
            d="M7 13l5 5 5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{
              opacity: [0.4, 1, 0.4],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.path
            d="M7 7l5 5 5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
