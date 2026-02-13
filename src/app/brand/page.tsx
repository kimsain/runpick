'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SentenceLineBreakText from '@/components/common/SentenceLineBreakText';
import { categories } from '@/data/categories';
import { CategoryId } from '@/types/shoe';
import { getAllBrandIds, getAllBrands, getShoesByBrand } from '@/utils/shoe-utils';

function isCategoryId(value: string): value is CategoryId {
  return categories.some((category) => category.id === value);
}

export default function BrandIndexPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const selectedCategory = categoryParam && isCategoryId(categoryParam) ? categoryParam : null;
  const [preferredBrand, setPreferredBrand] = useState<string | null>(null);
  const selectedCategoryInfo = useMemo(
    () => (selectedCategory ? categories.find((item) => item.id === selectedCategory) : null),
    [selectedCategory]
  );
  const brandCards = useMemo(
    () =>
      getAllBrands().map((brand) => ({
        ...brand,
        shoeCount: getShoesByBrand(brand.id).length,
      })),
    []
  );
  const allBrandIds = useMemo(() => getAllBrandIds(), []);

  useEffect(() => {
    const stored = window.localStorage.getItem('runpick.preferredBrand');
    const valid = stored && allBrandIds.includes(stored) ? stored : null;
    setPreferredBrand(valid);
  }, [allBrandIds]);

  return (
    <>
      <Header />
      <main id="main-content" className="pt-20 min-h-screen bg-[var(--color-background)]">
        <section className="section-space-tight border-b border-[var(--color-border)] bg-gradient-to-b from-[var(--color-card)] to-[var(--color-background)]">
          <div className="layout-shell text-center">
            <p className="type-eyebrow text-[var(--color-foreground)]/45">
              Brand Catalog
            </p>
            <h1 className="mt-3 type-h1 text-[var(--color-foreground)] text-balance">
              브랜드를 선택하세요
            </h1>
            <p className="mt-4 type-lead text-[var(--color-foreground)]/62 reading-measure text-pretty">
              <SentenceLineBreakText
                text={
                  selectedCategoryInfo
                    ? `${selectedCategoryInfo.name} 카테고리로 바로 이동할 브랜드를 선택하세요.`
                    : '관심 있는 브랜드를 선택하면 카탈로그로 이동합니다.'
                }
                variant="lead"
              />
            </p>

            {selectedCategoryInfo && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2">
                <span className="type-caption text-[var(--color-foreground)]/60">선택 카테고리:</span>
                <span style={{ color: selectedCategoryInfo.color }}>
                  {selectedCategoryInfo.icon} {selectedCategoryInfo.name}
                </span>
              </div>
            )}

            {!selectedCategoryInfo && preferredBrand && (
              <div className="mt-6">
                <Link
                  href={`/brand/${preferredBrand}`}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2 type-caption text-[var(--color-foreground)]/75 hover:text-[var(--color-foreground)]"
                >
                  최근 선호 브랜드 바로가기: {preferredBrand.toUpperCase()} →
                </Link>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <Link
                  href="/brand"
                  className={`rounded-full border px-3 py-2 sm:px-3.5 sm:py-2.5 min-h-11 type-caption transition-all ${
                    selectedCategoryInfo
                      ? 'border-[var(--color-border)] text-[var(--color-foreground)]/60 hover:text-[var(--color-foreground)]'
                      : 'border-transparent bg-[var(--color-asics-accent)]/15 text-[var(--color-asics-accent)]'
                }`}
              >
                전체 카테고리
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/brand?category=${category.id}`}
                  className={`rounded-full border px-3 py-2 sm:px-3.5 sm:py-2.5 min-h-11 type-caption transition-all ${
                    selectedCategoryInfo?.id === category.id
                      ? 'border-transparent'
                      : 'border-[var(--color-border)] text-[var(--color-foreground)]/60 hover:text-[var(--color-foreground)]'
                  }`}
                  style={
                    selectedCategoryInfo?.id === category.id
                      ? {
                          backgroundColor: `${category.color}20`,
                          color: category.color,
                        }
                      : undefined
                  }
                >
                  {category.icon} {category.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section-space-tight">
          <div className="layout-shell">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {brandCards.map((brand) => {
                const href = selectedCategory
                  ? `/brand/${brand.id}/${selectedCategory}`
                  : `/brand/${brand.id}`;

                return (
                  <Link
                    key={brand.id}
                    href={href}
                    className="group rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 sm:p-7 transition-all hover:-translate-y-1 hover:border-[var(--color-border-hover)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="type-caption uppercase tracking-wider text-[var(--color-foreground)]/40">
                          {brand.id}
                        </p>
                        <h2 className="mt-1 type-h3 text-[var(--color-foreground)]">
                          {brand.name}
                        </h2>
                        <p className="mt-1 type-body text-[var(--color-foreground)]/65">
                          {brand.nameKo}
                        </p>
                      </div>
                      <span
                        className="inline-flex h-3 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: brand.color }}
                        aria-hidden="true"
                      />
                    </div>

                    <p className="mt-4 type-body text-[var(--color-foreground)]/56">
                      <SentenceLineBreakText text={brand.description} variant="body" />
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                      <span className="type-body text-[var(--color-foreground)]/60">
                        {brand.shoeCount}개 모델
                      </span>
                      <span className="type-body text-[var(--color-foreground)]/70 group-hover:text-[var(--color-foreground)]">
                        카탈로그 보기 →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
