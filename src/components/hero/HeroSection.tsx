'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Button from '@/components/common/Button';
import TextReveal from '@/components/effects/TextReveal';
import FloatingShapes from '@/components/effects/FloatingShapes';
import MagneticElement from '@/components/effects/MagneticElement';
import { EASE_OUT_EXPO, STAGGER_NORMAL } from '@/constants/animation';

// Animated star/sparkle component
function Sparkle({ delay, x, y }: { delay: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0, 1, 0],
        rotate: [0, 180],
      }}
      transition={{
        duration: 2.5,
        delay,
        repeat: Infinity,
        repeatDelay: 3,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z"
          fill="var(--color-asics-accent)"
          opacity="0.5"
        />
      </svg>
    </motion.div>
  );
}

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
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--color-asics-blue)] to-[var(--color-asics-accent)]"
          animate={{
            opacity: [0.4, 0.7, 0.4],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ filter: 'blur(18px)' }}
        />
      )}
      <Button href={href} size="lg" variant={variant === 'outline' ? 'outline' : undefined}>
        {children}
      </Button>
    </motion.div>
  );
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient with parallax - 60% speed */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[var(--color-background)] via-[var(--color-background)] to-[var(--color-asics-blue)]/10"
        style={{ y: backgroundY }}
      />

      {/* Animated gradient wave background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(45deg, transparent 0%, var(--color-asics-blue) 25%, var(--color-asics-accent) 50%, var(--color-asics-blue) 75%, transparent 100%)',
            backgroundSize: '400% 400%',
            filter: 'blur(100px)',
          }}
        />
      </div>

      {/* FloatingShapes replacing 20 particles */}
      <FloatingShapes color="var(--color-asics-blue)" count={4} />

      {/* Subtle sparkles (keep 5) */}
      <div className="absolute inset-0 pointer-events-none">
        <Sparkle delay={0} x="12%" y="25%" />
        <Sparkle delay={1.2} x="88%" y="35%" />
        <Sparkle delay={2.4} x="8%" y="75%" />
        <Sparkle delay={0.8} x="92%" y="65%" />
        <Sparkle delay={1.6} x="50%" y="15%" />
      </div>

      {/* Content with parallax - 20% speed */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        style={{ y: contentY, opacity: contentOpacity, scale }}
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
            <motion.span
              className="relative z-10 text-sm font-medium tracking-wider uppercase px-4 py-2 rounded-full border border-[var(--color-asics-accent)]/30 bg-[var(--color-asics-accent)]/5"
              animate={{
                boxShadow: [
                  '0 0 0 0 var(--color-asics-accent)',
                  '0 0 20px 2px var(--color-asics-accent)',
                  '0 0 0 0 var(--color-asics-accent)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ color: 'var(--color-asics-accent)' }}
            >
              Running Shoe Catalog & Recommendation
            </motion.span>
          </motion.div>

          {/* Main headline with TextReveal */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight" data-cursor="text">
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
              <motion.span
                className="absolute inset-0 blur-2xl"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  background: 'linear-gradient(90deg, var(--color-asics-blue), var(--color-asics-accent), var(--color-asics-blue))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                aria-hidden="true"
              >
                러닝화를 찾아드립니다
              </motion.span>

              <TextReveal
                as="span"
                mode="clip"
                delay={0.7}
                className="inline-block font-extrabold text-white relative"
              >
                <motion.span
                  className="inline-block"
                  animate={{
                    textShadow: [
                      '0 0 10px rgba(0, 209, 255, 0.5), 0 0 20px rgba(0, 61, 165, 0.3)',
                      '0 0 25px rgba(0, 209, 255, 0.8), 0 0 50px rgba(0, 61, 165, 0.5)',
                      '0 0 10px rgba(0, 209, 255, 0.5), 0 0 20px rgba(0, 61, 165, 0.3)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  러닝화를 찾아드립니다
                </motion.span>
              </TextReveal>
            </span>
          </h1>

          {/* Subtitle with fade in */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6, ease: EASE_OUT_EXPO as unknown as number[] }}
            className="mt-8 text-lg sm:text-xl text-[var(--color-foreground)]/60 max-w-2xl mx-auto"
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

      </motion.div>

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
