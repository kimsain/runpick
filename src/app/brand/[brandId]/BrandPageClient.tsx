'use client';

import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShoeCard from '@/components/shoe/ShoeCard';
import Badge from '@/components/common/Badge';
import { categories } from '@/data/categories';
import { getShoesByBrand, getShoesByCategory } from '@/utils/shoe-utils';
import asicsData from '@/data/brands/asics.json';
import Link from 'next/link';

interface BrandPageClientProps {
  brandId: string;
}

export default function BrandPageClient({ brandId }: BrandPageClientProps) {
  const brand = asicsData.brand;
  const shoes = getShoesByBrand(brandId);

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-[var(--color-card)] to-[var(--color-background)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <motion.h1
                className="text-5xl sm:text-6xl font-bold"
                style={{ color: brand.color }}
              >
                {brand.name}
              </motion.h1>
              <p className="mt-4 text-lg text-[var(--color-foreground)]/60 max-w-2xl mx-auto">
                {brand.description}
              </p>
              <p className="mt-2 text-sm text-[var(--color-foreground)]/40">
                {shoes.length}개 모델
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category Navigation */}
        <section className="py-8 border-b border-[var(--color-border)] sticky top-16 bg-[var(--color-background)]/95 backdrop-blur-sm z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/brand/${brandId}/${category.id}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 rounded-full border border-[var(--color-border)] hover:border-transparent transition-all cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, transparent, ${category.color}10)`,
                    }}
                  >
                    <span className="mr-2">{category.icon}</span>
                    <span style={{ color: category.color }} className="font-medium">
                      {category.name}
                    </span>
                    <span className="ml-2 text-sm text-[var(--color-foreground)]/40">
                      {getShoesByCategory(category.id).length}
                    </span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* All Shoes by Category */}
        {categories.map((category) => {
          const categoryShoes = shoes.filter((s) => s.categoryId === category.id);
          if (categoryShoes.length === 0) return null;

          return (
            <section
              key={category.id}
              className="py-16"
              id={category.id}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-8"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{category.icon}</span>
                    <h2
                      className="text-2xl font-bold"
                      style={{ color: category.color }}
                    >
                      {category.name}
                    </h2>
                    <Badge variant="category" categoryId={category.id}>
                      {category.nameKo}
                    </Badge>
                  </div>
                  <p className="text-[var(--color-foreground)]/60">
                    {category.description}
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryShoes.map((shoe, index) => (
                    <ShoeCard key={shoe.id} shoe={shoe} index={index} />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </main>
      <Footer />
    </>
  );
}
