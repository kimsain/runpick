'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import Button from '@/components/common/Button';

// Floating particle component
function FloatingParticle({ delay, duration, size, x, y }: {
  delay: number;
  duration: number;
  size: number;
  x: string;
  y: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0.6, 0],
        scale: [0.5, 1, 1, 0.5],
        y: [0, -100, -200, -300],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
      className="absolute rounded-full bg-gradient-to-r from-[var(--color-asics-blue)] to-[var(--color-asics-accent)]"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        filter: 'blur(1px)',
      }}
    />
  );
}

// Animated letter component for headline
function AnimatedLetter({ letter, index, totalDelay }: { letter: string; index: number; totalDelay: number }) {
  if (letter === ' ') return <span>&nbsp;</span>;

  return (
    <motion.span
      initial={{ opacity: 0, y: 50, rotateX: -90 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        duration: 0.6,
        delay: totalDelay + index * 0.05,
        ease: [0.215, 0.61, 0.355, 1],
      }}
      className="inline-block"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {letter}
    </motion.span>
  );
}

// Accent headline letter with enhanced glow animation
function AccentLetter({ letter, index, totalDelay }: { letter: string; index: number; totalDelay: number }) {
  if (letter === ' ') return <span>&nbsp;</span>;

  return (
    <motion.span
      initial={{ opacity: 0, y: 60, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: totalDelay + index * 0.04,
        ease: [0.34, 1.56, 0.64, 1], // spring-like bounce
      }}
      className="inline-block relative"
    >
      <motion.span
        className="relative z-10"
        animate={{
          color: ['#ffffff', '#00D1FF', '#ffffff'],
        }}
        transition={{
          duration: 3,
          delay: totalDelay + index * 0.1 + 1.5,
          repeat: Infinity,
          repeatDelay: 2,
        }}
      >
        {letter}
      </motion.span>
    </motion.span>
  );
}

// Pulsing CTA button wrapper
function PulsingButton({ children, href, variant = 'primary' }: {
  children: React.ReactNode;
  href: string;
  variant?: 'primary' | 'outline';
}) {
  const isPrimary = variant === 'primary';

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glow effect behind button */}
      {isPrimary && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--color-asics-blue)] to-[var(--color-asics-accent)]"
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ filter: 'blur(15px)' }}
        />
      )}
      <Button href={href} size="lg" variant={variant === 'outline' ? 'outline' : undefined}>
        {children}
      </Button>
    </motion.div>
  );
}

export default function HeroSection() {
  const [particles, setParticles] = useState<Array<{ id: number; delay: number; duration: number; size: number; x: string; y: string }>>([]);
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  // Generate particles on mount (client-side only)
  useEffect(() => {
    const generatedParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 3,
      size: 4 + Math.random() * 8,
      x: `${10 + Math.random() * 80}%`,
      y: `${60 + Math.random() * 30}%`,
    }));
    setParticles(generatedParticles);
  }, []);

  const headlineText1 = '당신에게 딱 맞는';
  const headlineText2 = '러닝화를 찾아드립니다';

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient with parallax */}
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

      {/* Animated background shapes - enhanced */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-[var(--color-asics-blue)]/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [180, 0, 180],
            x: [0, -50, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-[var(--color-asics-accent)]/10 to-transparent rounded-full blur-3xl"
        />
        {/* Additional pulsing orb */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-[var(--color-asics-blue)]/20 to-[var(--color-asics-accent)]/20 rounded-full blur-3xl"
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <FloatingParticle key={particle.id} {...particle} />
        ))}
      </div>

      {/* Content with parallax */}
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

          {/* Main headline with staggered letter animation */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight">
            <span className="block text-[var(--color-foreground)] overflow-hidden">
              {headlineText1.split('').map((letter, i) => (
                <AnimatedLetter key={i} letter={letter} index={i} totalDelay={0.4} />
              ))}
            </span>
            <motion.span
              className="block mt-2 overflow-hidden relative"
            >
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
                {headlineText2}
              </motion.span>

              {/* Main text with shimmer */}
              <motion.span
                className="inline-block font-extrabold text-white relative"
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
                {/* Shimmer sweep effect */}
                <motion.span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundSize: '200% 100%',
                  }}
                  animate={{
                    backgroundPosition: ['-200% 0', '200% 0'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: 'easeInOut',
                  }}
                  aria-hidden="true"
                >
                  {headlineText2}
                </motion.span>

                {headlineText2.split('').map((letter, i) => (
                  <AccentLetter key={i} letter={letter} index={i} totalDelay={0.8} />
                ))}
              </motion.span>
            </motion.span>
          </h1>

          {/* Subtitle with fade in */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="mt-8 text-lg sm:text-xl text-[var(--color-foreground)]/60 max-w-2xl mx-auto"
          >
            Daily, Super Trainer, Racing 카테고리별로 정리된 러닝화 카탈로그와
            맞춤 추천 퀴즈로 완벽한 러닝화를 찾아보세요.
          </motion.p>

          {/* CTA Buttons with pulsing glow */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <PulsingButton href="/quiz">
              나에게 맞는 신발 찾기
            </PulsingButton>
            <PulsingButton href="/brand/asics" variant="outline">
              카탈로그 둘러보기
            </PulsingButton>
          </motion.div>
        </motion.div>

      </motion.div>

      {/* Enhanced scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.6 }}
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
      className="flex flex-col items-center gap-3 cursor-pointer group"
      whileHover={{ scale: 1.1 }}
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
