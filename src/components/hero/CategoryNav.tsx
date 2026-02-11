'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { categories } from '@/data/categories';

export default function CategoryNav() {
  return (
    <section className="py-24 bg-gradient-to-b from-[var(--color-background)] to-[var(--color-card)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-foreground)]">
            러닝화 카테고리
          </h2>
          <p className="mt-4 text-lg text-[var(--color-foreground)]/60">
            목적에 맞는 카테고리를 선택해보세요
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/brand/asics/${category.id}`}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative h-64 rounded-2xl overflow-hidden border border-[var(--color-border)] hover:border-transparent transition-colors"
                  style={{
                    background: `linear-gradient(135deg, var(--color-card) 0%, var(--color-card-hover) 100%)`,
                  }}
                >
                  {/* Category color glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 100%, ${category.color}20 0%, transparent 70%)`,
                    }}
                  />

                  {/* Border glow */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      boxShadow: `inset 0 0 0 1px ${category.color}50, 0 0 30px ${category.color}20`,
                    }}
                  />

                  {/* Content */}
                  <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                    <motion.span
                      className="text-5xl mb-4"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      {category.icon}
                    </motion.span>

                    <h3
                      className="text-2xl font-bold mb-2"
                      style={{ color: category.color }}
                    >
                      {category.name}
                    </h3>
                    <p className="text-sm text-[var(--color-foreground)]/60">
                      {category.nameKo}
                    </p>
                    <p className="mt-3 text-sm text-[var(--color-foreground)]/50 line-clamp-2">
                      {category.description}
                    </p>

                    {/* Subcategory count */}
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-xs text-[var(--color-foreground)]/40">
                        {category.subcategories.length}개 서브카테고리
                      </span>
                    </div>

                    {/* Arrow */}
                    <motion.span
                      className="absolute bottom-4 right-4 text-[var(--color-foreground)]/30 group-hover:text-[var(--color-foreground)]/70 transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      →
                    </motion.span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
