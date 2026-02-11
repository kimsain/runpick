'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import ShoeCard from '@/components/shoe/ShoeCard';
import { getAllShoes } from '@/utils/shoe-utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Animated star/sparkle component
function Sparkle({ delay, x, y }: { delay: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        rotate: [0, 180],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        repeatDelay: 3,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z"
          fill="var(--color-asics-accent)"
          opacity="0.6"
        />
      </svg>
    </motion.div>
  );
}

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
      <motion.div
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[var(--color-asics-blue)]/20 to-[var(--color-asics-accent)]/20 border border-[var(--color-asics-accent)]/30"
        animate={{
          boxShadow: [
            '0 0 0 0 var(--color-asics-accent)',
            '0 0 20px 2px var(--color-asics-accent)',
            '0 0 0 0 var(--color-asics-accent)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="text-lg"
        >
          ⭐
        </motion.span>
        <span className="text-sm font-semibold text-[var(--color-asics-accent)]">
          RUNNER&apos;S CHOICE
        </span>
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-lg"
        >
          🔥
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

// Enhanced shoe card wrapper with spotlight effect
function SpotlightShoeCard({ shoe, index }: { shoe: NonNullable<ReturnType<typeof getAllShoes>[0]>; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: 0.2 + index * 0.15,
        ease: [0.215, 0.61, 0.355, 1],
      }}
      className="relative"
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
        className="absolute -top-3 -left-3 z-20 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
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
          className="absolute -top-3 -right-3 z-20 px-3 py-1 rounded-full text-xs font-bold text-white"
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
          animate={{
            y: [0, -3, 0],
          }}
        >
          <motion.span
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            MOST POPULAR
          </motion.span>
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
    </motion.div>
  );
}

export default function FeaturedShoes() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const allShoes = getAllShoes();
  // 각 카테고리에서 인기 모델 선택
  const featuredShoes = [
    allShoes.find((s) => s.id === 'novablast-5'),
    allShoes.find((s) => s.id === 'superblast-2'),
    allShoes.find((s) => s.id === 'metaspeed-sky-tokyo'),
  ].filter(Boolean);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Title animation with scale and opacity
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          {
            opacity: 0,
            y: 100,
            scale: 0.8,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 1,
            },
          }
        );
      }

      // Card stagger animation with 3D rotation
      if (cardsRef.current) {
        const cards = cardsRef.current.children;
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 150,
            rotateX: 45,
            rotateY: -15,
            scale: 0.8,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 1.2,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
              end: 'top 30%',
              scrub: 1.2,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-28 bg-[var(--color-background)] overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle gradient orbs */}
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, var(--color-asics-blue)10 0%, transparent 70%)',
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, var(--color-asics-accent)10 0%, transparent 70%)',
          }}
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Sparkles */}
        <Sparkle delay={0} x="15%" y="20%" />
        <Sparkle delay={1} x="85%" y="30%" />
        <Sparkle delay={2} x="10%" y="70%" />
        <Sparkle delay={1.5} x="90%" y="80%" />
        <Sparkle delay={0.5} x="50%" y="10%" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated section header */}
        <div
          ref={titleRef}
          className="text-center mb-16"
        >
          <FeaturedBadge />

          {/* Main title with gradient animation */}
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.span
              className="inline-block"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{
                backgroundImage: 'linear-gradient(90deg, var(--color-foreground), var(--color-asics-blue), var(--color-asics-accent), var(--color-foreground))',
                backgroundSize: '300% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              인기 러닝화
            </motion.span>

            {/* Animated fire emoji */}
            <motion.span
              className="inline-block ml-3"
              animate={{
                y: [0, -5, 0],
                rotate: [-5, 5, -5],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              🏆
            </motion.span>
          </motion.h2>

          <motion.p
            className="mt-5 text-lg sm:text-xl text-[var(--color-foreground)]/60"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            러너들이 가장 사랑하는 모델들
          </motion.p>

          {/* Decorative underline */}
          <motion.div
            className="mt-6 mx-auto h-1 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, var(--color-asics-blue), var(--color-asics-accent), transparent)',
            }}
            initial={{ width: 0 }}
            whileInView={{ width: 120 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </div>

        {/* Shoe cards grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10" style={{ perspective: '1000px' }}>
          {featuredShoes.map((shoe, index) => (
            shoe && <SpotlightShoeCard key={shoe.id} shoe={shoe} index={index} />
          ))}
        </div>

        {/* Bottom CTA hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.p
            className="text-sm text-[var(--color-foreground)]/50"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            카테고리를 탐색하여 더 많은 러닝화를 발견하세요
          </motion.p>
          <motion.div
            className="mt-3 flex justify-center gap-1"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-[var(--color-foreground)]/30">↓</span>
            <span className="text-[var(--color-foreground)]/50">↓</span>
            <span className="text-[var(--color-foreground)]/30">↓</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
