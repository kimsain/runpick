'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { categories } from '@/data/categories';

// Particle effect for hover
function HoverParticles({ isHovered, color }: { isHovered: boolean; color: string }) {
  if (!isHovered) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            x: '50%',
            y: '50%',
            scale: 0,
          }}
          animate={{
            opacity: [0, 1, 0],
            x: `${50 + (Math.random() - 0.5) * 100}%`,
            y: `${50 + (Math.random() - 0.5) * 100}%`,
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 0.8,
            delay: i * 0.05,
            ease: 'easeOut',
          }}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: color,
            filter: 'blur(1px)',
          }}
        />
      ))}
    </div>
  );
}

// Category card component
function CategoryCard({ category, index }: { category: typeof categories[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.215, 0.61, 0.355, 1],
      }}
      style={{ perspective: '1000px' }}
    >
      <Link href={`/brand/asics/${category.id}`}>
        <motion.div
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ y: -12, scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="group relative h-72 rounded-3xl overflow-hidden border border-[var(--color-border)] hover:border-transparent transition-all duration-500"
          style={{
            background: `linear-gradient(135deg, var(--color-card) 0%, var(--color-card-hover) 100%)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background: `radial-gradient(circle at 50% 100%, ${category.color}30 0%, transparent 60%)`,
            }}
          />

          {/* Animated color sweep on hover */}
          <motion.div
            className="absolute inset-0"
            initial={{ x: '-100%', opacity: 0 }}
            animate={{
              x: isHovered ? '100%' : '-100%',
              opacity: isHovered ? 0.3 : 0,
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              background: `linear-gradient(90deg, transparent, ${category.color}40, transparent)`,
            }}
          />

          {/* Particle effects on hover */}
          <HoverParticles isHovered={isHovered} color={category.color} />

          {/* Glowing border effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            animate={{
              boxShadow: isHovered
                ? `inset 0 0 0 2px ${category.color}, 0 0 40px ${category.color}40, 0 20px 40px ${category.color}20`
                : `inset 0 0 0 0px transparent, 0 0 0px transparent`,
            }}
            transition={{ duration: 0.4 }}
          />

          {/* Top accent line */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background: `linear-gradient(90deg, transparent, ${category.color}, transparent)`,
              transformOrigin: 'center',
            }}
          />

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
            {/* Floating/breathing icon */}
            <motion.div
              className="relative mb-6"
              animate={{
                y: [0, -5, 0],
                scale: isHovered ? 1.2 : [1, 1.05, 1],
              }}
              transition={{
                y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                scale: { duration: 0.3 },
              }}
            >
              {/* Icon glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: isHovered
                    ? `0 0 30px ${category.color}60`
                    : `0 0 0px transparent`,
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="text-6xl relative z-10 block"
                animate={{
                  rotate: isHovered ? [0, -10, 10, 0] : 0,
                  filter: isHovered
                    ? `drop-shadow(0 0 20px ${category.color})`
                    : 'drop-shadow(0 0 0px transparent)',
                }}
                transition={{
                  rotate: { duration: 0.5 },
                  filter: { duration: 0.3 },
                }}
              >
                {category.icon}
              </motion.span>
            </motion.div>

            {/* Category name with glow on hover */}
            <motion.h3
              className="text-2xl font-bold mb-2 transition-all duration-300"
              style={{
                color: category.color,
                textShadow: isHovered ? `0 0 20px ${category.color}80` : 'none',
              }}
            >
              {category.name}
            </motion.h3>

            <motion.p
              className="text-sm text-[var(--color-foreground)]/60 mb-2"
              animate={{ opacity: isHovered ? 0.9 : 0.6 }}
            >
              {category.nameKo}
            </motion.p>

            <motion.p
              className="text-sm text-[var(--color-foreground)]/50 line-clamp-2 max-w-xs"
              animate={{ opacity: isHovered ? 0.8 : 0.5 }}
            >
              {category.description}
            </motion.p>

            {/* Subcategory badge */}
            <motion.div
              className="mt-5 flex items-center gap-2"
              animate={{
                y: isHovered ? 0 : 5,
                opacity: isHovered ? 1 : 0.7,
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.span
                className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{
                  backgroundColor: `${category.color}20`,
                  color: category.color,
                  border: `1px solid ${category.color}40`,
                }}
                whileHover={{ scale: 1.05 }}
              >
                {category.subcategories.length}개 서브카테고리
              </motion.span>
            </motion.div>

            {/* Animated arrow */}
            <motion.div
              className="absolute bottom-5 right-5"
              animate={{
                x: isHovered ? 5 : 0,
                opacity: isHovered ? 1 : 0.4,
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.span
                className="text-xl"
                style={{ color: isHovered ? category.color : 'var(--color-foreground)' }}
                animate={{
                  x: isHovered ? [0, 5, 0] : 0,
                }}
                transition={{ duration: 0.8, repeat: isHovered ? Infinity : 0 }}
              >
                →
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function CategoryNav() {
  return (
    <section className="py-28 bg-gradient-to-b from-[var(--color-background)] to-[var(--color-card)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-20 h-1 mx-auto mb-6 rounded-full bg-gradient-to-r from-[var(--color-asics-blue)] to-[var(--color-asics-accent)]"
          />

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-foreground)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{
                backgroundImage: 'linear-gradient(90deg, var(--color-foreground), var(--color-asics-blue), var(--color-asics-accent), var(--color-foreground))',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              러닝화 카테고리
            </motion.span>
          </motion.h2>

          <motion.p
            className="mt-5 text-lg sm:text-xl text-[var(--color-foreground)]/60"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            목적에 맞는 카테고리를 선택해보세요
          </motion.p>

          {/* Animated dots */}
          <motion.div
            className="flex justify-center gap-2 mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: i === 0
                    ? '#4CAF50'
                    : i === 1
                      ? '#FF9800'
                      : '#F44336'
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Infinity,
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Category cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
