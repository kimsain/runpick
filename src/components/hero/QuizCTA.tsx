'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import Button from '@/components/common/Button';
import TextReveal from '@/components/effects/TextReveal';
import FloatingShapes from '@/components/effects/FloatingShapes';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function QuizCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current,
          { scale: 0.9 },
          {
            scale: 1,
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
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-[var(--color-background)] to-[var(--color-card)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-3xl"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-asics-blue)] to-[var(--color-asics-accent)]" />

          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }}
            />
          </div>

          {/* FloatingShapes replacing static floating emojis */}
          <FloatingShapes color="rgba(255,255,255,0.15)" count={3} />

          {/* Content */}
          <div className="relative py-16 px-8 sm:py-20 sm:px-16 text-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm text-white font-medium mb-6"
            >
              7개 질문으로 찾는 나의 러닝화
            </motion.span>

            <TextReveal
              as="h2"
              mode="clip"
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              어떤 러닝화가 나에게 맞을까?
            </TextReveal>
            <motion.p
              className="text-lg text-white/80 max-w-xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              러닝 스타일, 목표, 발 유형을 분석해서
              <br className="hidden sm:block" />
              딱 맞는 러닝화를 추천해드려요.
            </motion.p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                href="/quiz"
                variant="secondary"
                size="lg"
                className="bg-white text-[var(--color-asics-blue)] hover:bg-white/90"
              >
                추천 퀴즈 시작하기
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
