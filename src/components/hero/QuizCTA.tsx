'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import TextReveal from '@/components/effects/TextReveal';
import MagneticElement from '@/components/effects/MagneticElement';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASE_OUT_EXPO } from '@/constants/animation';

export default function QuizCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.innerWidth < 768) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current,
          { scale: 0.92, opacity: 0.8 },
          {
            scale: 1,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 85%',
              end: 'top 40%',
              scrub: 1,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-32 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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

          {/* Animated gradient orbs */}
          <motion.div
            className="absolute -top-32 -right-32 w-80 h-80 rounded-full hidden md:block"
            style={{
              background: 'radial-gradient(circle, rgba(0,209,255,0.15) 0%, transparent 70%)',
            }}
            animate={{
              x: [0, 20, 0],
              y: [0, -15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full hidden md:block"
            style={{
              background: 'radial-gradient(circle, rgba(0,61,165,0.2) 0%, transparent 70%)',
            }}
            animate={{
              x: [0, -15, 0],
              y: [0, 20, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Accent light streak */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px hidden md:block"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, var(--color-asics-accent) 50%, transparent 100%)',
            }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
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
          <div className="relative py-12 px-5 sm:py-20 sm:px-8 md:py-24 md:px-16 text-center">
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5, ease: EASE_OUT_EXPO as unknown as number[] }}
              className="inline-flex items-center gap-2 mb-8"
            >
              <span
                className="px-5 py-2 rounded-full text-sm font-medium tracking-wide"
                style={{
                  background: 'rgba(0,209,255,0.08)',
                  border: '1px solid rgba(0,209,255,0.2)',
                  color: 'var(--color-asics-accent)',
                }}
              >
                <motion.span
                  className="inline-block mr-2"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  🎯
                </motion.span>
                7개 질문 &middot; 1분 소요
              </span>
            </motion.div>

            {/* Headline */}
            <TextReveal
              as="h2"
              mode="clip"
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 leading-tight text-balance"
            >
              어떤 러닝화가 나에게 맞을까?
            </TextReveal>

            <motion.p
              className="text-base sm:text-lg text-white/50 max-w-lg mx-auto mb-10 leading-relaxed text-pretty"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              러닝 스타일, 목표, 발 유형을 분석해서
              <br className="hidden sm:block" />
              딱 맞는 러닝화를 추천해드려요.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <MagneticElement strength={0.2}>
                <Link href="/quiz" data-cursor="hover">
                  <motion.span
                    className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-semibold overflow-hidden"
                    style={{
                      background: 'white',
                      color: 'var(--color-asics-blue)',
                    }}
                    whileHover={{
                      scale: 1.04,
                      boxShadow: '0 20px 50px -12px rgba(0,209,255,0.35), 0 0 0 1px rgba(255,255,255,0.1)',
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    {/* Shimmer on hover */}
                    <motion.span
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(0,209,255,0.08), transparent)',
                      }}
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                    <span className="relative z-10">추천 퀴즈 시작하기</span>
                    <motion.span
                      className="relative z-10"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      →
                    </motion.span>
                  </motion.span>
                </Link>
              </MagneticElement>
            </motion.div>

            {/* Bottom decorative dots */}
            <motion.div
              className="hidden md:flex justify-center gap-1.5 mt-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 rounded-full bg-white/20"
                  animate={{
                    opacity: [0.2, 0.6, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.3,
                    repeat: Infinity,
                  }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
