'use client';

import { motion } from 'framer-motion';
import Button from '@/components/common/Button';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-background)] via-[var(--color-background)] to-[var(--color-asics-blue)]/10" />

      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-[var(--color-asics-blue)]/5 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-[var(--color-asics-accent)]/5 to-transparent rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-medium text-[var(--color-asics-accent)] tracking-wider uppercase mb-4"
          >
            Running Shoe Catalog & Recommendation
          </motion.p>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="block text-[var(--color-foreground)]"
            >
              당신에게 딱 맞는
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="block text-gradient mt-2"
            >
              러닝화를 찾아드립니다
            </motion.span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-lg sm:text-xl text-[var(--color-foreground)]/60 max-w-2xl mx-auto"
          >
            Daily, Super Trainer, Racing 카테고리별로 정리된 러닝화 카탈로그와
            맞춤 추천 퀴즈로 완벽한 러닝화를 찾아보세요.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button href="/quiz" size="lg">
              나에게 맞는 신발 찾기
            </Button>
            <Button href="/brand/asics" variant="outline" size="lg">
              카탈로그 둘러보기
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating shoe icons */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.span
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 text-4xl opacity-20"
          >
            👟
          </motion.span>
          <motion.span
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-1/3 right-1/4 text-3xl opacity-20"
          >
            🏃
          </motion.span>
          <motion.span
            animate={{ y: [-5, 15, -5] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute bottom-1/3 left-1/3 text-5xl opacity-20"
          >
            ⚡
          </motion.span>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ScrollIndicator />
      </motion.div>
    </section>
  );
}

function ScrollIndicator() {
  return (
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="flex flex-col items-center gap-2 text-[var(--color-foreground)]/40"
    >
      <span className="text-xs tracking-wider uppercase">Scroll</span>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5v14M19 12l-7 7-7-7" />
      </svg>
    </motion.div>
  );
}
