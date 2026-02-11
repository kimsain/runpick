'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShoeCard from '@/components/shoe/ShoeCard';
import { getCategoryById, getSubcategoriesByCategory } from '@/data/categories';
import { getShoesByCategory, getShoesBySubcategory } from '@/utils/shoe-utils';
import { CategoryId, SubcategoryId } from '@/types/shoe';
import Link from 'next/link';

interface CategoryPageClientProps {
  brandId: string;
  category: string;
}

export default function CategoryPageClient({ brandId, category }: CategoryPageClientProps) {
  const categoryData = getCategoryById(category as CategoryId);
  const subcategories = getSubcategoriesByCategory(category as CategoryId);
  const allCategoryShoes = getShoesByCategory(category as CategoryId);

  const [selectedSubcategory, setSelectedSubcategory] = useState<SubcategoryId | 'all'>(
    'all'
  );

  if (!categoryData) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[var(--color-foreground)]">
              카테고리를 찾을 수 없습니다
            </h1>
            <Link
              href={`/brand/${brandId}`}
              className="mt-4 inline-block text-[var(--color-asics-accent)]"
            >
              ← 브랜드 페이지로 돌아가기
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const displayedShoes =
    selectedSubcategory === 'all'
      ? allCategoryShoes
      : getShoesBySubcategory(selectedSubcategory);

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section
          className="py-20 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, var(--color-card) 0%, var(--color-background) 100%)`,
          }}
        >
          {/* Glow effect */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at 50% 100%, ${categoryData.color} 0%, transparent 50%)`,
            }}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link
                href={`/brand/${brandId}`}
                className="inline-flex items-center gap-2 text-sm text-[var(--color-foreground)]/60 hover:text-[var(--color-foreground)] mb-4"
              >
                ← ASICS
              </Link>

              <motion.span
                className="block text-6xl mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                {categoryData.icon}
              </motion.span>

              <h1
                className="text-4xl sm:text-5xl font-bold mb-4"
                style={{ color: categoryData.color }}
              >
                {categoryData.name}
              </h1>
              <p className="text-xl text-[var(--color-foreground)]/60 max-w-2xl mx-auto">
                {categoryData.description}
              </p>
              <p className="mt-4 text-sm text-[var(--color-foreground)]/40">
                {allCategoryShoes.length}개 모델
              </p>
            </motion.div>
          </div>
        </section>

        {/* Subcategory Tabs */}
        <section className="py-6 border-b border-[var(--color-border)] sticky top-16 bg-[var(--color-background)]/95 backdrop-blur-sm z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSubcategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedSubcategory === 'all'
                    ? 'bg-[var(--color-foreground)] text-[var(--color-background)]'
                    : 'bg-[var(--color-card)] text-[var(--color-foreground)]/70 hover:text-[var(--color-foreground)]'
                }`}
              >
                전체 ({allCategoryShoes.length})
              </motion.button>

              {subcategories.map((sub) => {
                const count = getShoesBySubcategory(sub.id).length;
                return (
                  <motion.button
                    key={sub.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSubcategory(sub.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      selectedSubcategory === sub.id
                        ? 'text-[var(--color-background)]'
                        : 'bg-[var(--color-card)] text-[var(--color-foreground)]/70 hover:text-[var(--color-foreground)]'
                    }`}
                    style={
                      selectedSubcategory === sub.id
                        ? { backgroundColor: categoryData.color }
                        : {}
                    }
                  >
                    {sub.nameKo} ({count})
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Shoes Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {selectedSubcategory !== 'all' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                {(() => {
                  const sub = subcategories.find((s) => s.id === selectedSubcategory);
                  return sub ? (
                    <>
                      <h2 className="text-xl font-bold text-[var(--color-foreground)]">
                        {sub.name}
                      </h2>
                      <p className="text-[var(--color-foreground)]/60">
                        {sub.description}
                      </p>
                    </>
                  ) : null;
                })()}
              </motion.div>
            )}

            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {displayedShoes.map((shoe, index) => (
                <ShoeCard key={shoe.id} shoe={shoe} index={index} />
              ))}
            </motion.div>

            {displayedShoes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[var(--color-foreground)]/60">
                  해당 서브카테고리에 모델이 없습니다.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
