'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import TextReveal from '@/components/effects/TextReveal';
import MagneticElement from '@/components/effects/MagneticElement';
import { gsap, ScrollTrigger, ensureScrollTriggerRegistration } from '@/lib/scroll-trigger';
import { EASE_OUT_EXPO } from '@/constants/animation';
import { useInteractionCapabilities } from '@/hooks/useInteractionCapabilities';

export default function QuizCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animateEnabled = !useReducedMotion();
  const { isDesktop, hasMotionBudget } = useInteractionCapabilities();
  const isEnabled = isDesktop && hasMotionBudget && animateEnabled;

  useEffect(() => {
    if (!isEnabled) return;
    ensureScrollTriggerRegistration();

    const ctx = gsap.context(() => {
      if (containerRef.current) {
        gsap.to(containerRef.current, {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isEnabled]);

  return (
    <section ref={sectionRef} className="section-space relative">
      <div className="layout-shell max-w-5xl">
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-[2rem] quiz-cta-container"
          style={{
            background: 'linear-gradient(135deg, #0a1628 0%, #0d2847 40%, #0a3a6b 70%, #084c8a 100%)',
          }}
        >
          {/* Noise texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'256\' height=\'256\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")',
              backgroundSize: '128px 128px',
            }}
          />

          {/* Static gradient orbs */}
          <div
            className="absolute -top-32 -right-32 w-80 h-80 rounded-full hidden md:block"
            style={{ background: 'radial-gradient(circle, rgba(0,209,255,0.15) 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full hidden md:block"
            style={{ background: 'radial-gradient(circle, rgba(0,61,165,0.2) 0%, transparent 70%)' }}
          />

          {/* Accent light streak */}
          <div
            className="absolute top-0 left-0 right-0 h-px hidden md:block"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, var(--color-asics-accent) 50%, transparent 100%)',
              opacity: 0.5,
            }}
          />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Content */}
          <div className="relative py-11 px-5 sm:py-16 sm:px-8 md:py-20 md:px-14 text-center">
            {/* Pill badge */}
            <motion.div
              initial={animateEnabled ? { opacity: 0, y: 10 } : false}
              whileInView={animateEnabled ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true }}
              transition={
                animateEnabled
                  ? { delay: 0.1, duration: 0.5, ease: EASE_OUT_EXPO as unknown as number[] }
                  : undefined
              }
              className="inline-flex items-center gap-2 mb-8"
            >
              <span
                className="type-caption px-5 py-2 rounded-full font-medium tracking-wide"
                style={{
                  background: 'rgba(0,209,255,0.08)',
                  border: '1px solid rgba(0,209,255,0.2)',
                  color: 'var(--color-asics-accent)',
                }}
              >
                <span className="inline-block mr-2">🎯</span>
                5개 질문 &middot; 1분 소요
              </span>
            </motion.div>

            {/* Headline */}
            <TextReveal
              as="h2"
              mode="clip"
              className="type-h1 text-white mb-4 text-balance"
            >
              어떤 러닝화가 나에게 맞을까?
            </TextReveal>

            <motion.p
              className="type-lead text-white/58 reading-measure mb-9 text-pretty"
              initial={animateEnabled ? { opacity: 0 } : false}
              whileInView={animateEnabled ? { opacity: 1 } : undefined}
              viewport={{ once: true }}
              transition={animateEnabled ? { delay: 0.3, duration: 0.6 } : undefined}
            >
              러닝 스타일, 목표, 발 유형을 분석해서
              <br className="hidden sm:block" />
              딱 맞는 러닝화를 추천해드려요.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={animateEnabled ? { opacity: 0, y: 15 } : false}
              whileInView={animateEnabled ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true }}
              transition={animateEnabled ? { delay: 0.4, duration: 0.5 } : undefined}
            >
              <MagneticElement strength={0.2}>
                <Link href="/quiz" data-cursor="hover">
                  <motion.span
                    className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-semibold overflow-hidden"
                    style={{
                      background: 'white',
                      color: 'var(--color-asics-blue)',
                    }}
                    whileHover={animateEnabled ? {
                      scale: 1.04,
                      boxShadow: '0 20px 50px -12px rgba(0,209,255,0.35), 0 0 0 1px rgba(255,255,255,0.1)',
                    } : undefined}
                    whileTap={animateEnabled ? { scale: 0.97 } : undefined}
                    transition={animateEnabled ? { type: 'spring', stiffness: 400, damping: 20 } : undefined}
                  >
                    <span className="relative z-10">추천 퀴즈 시작하기</span>
                    <span className="relative z-10">→</span>
                  </motion.span>
                </Link>
              </MagneticElement>
            </motion.div>

            {/* Bottom decorative dots */}
            <div className="hidden md:flex justify-center gap-1.5 mt-10">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-white/30" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
