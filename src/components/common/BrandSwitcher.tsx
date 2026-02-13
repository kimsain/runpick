'use client';

import Link from 'next/link';
import { CategoryId } from '@/types/shoe';
import { getAllBrands } from '@/utils/shoe-utils';

interface BrandSwitcherProps {
  currentBrandId: string;
  categoryId?: CategoryId;
  className?: string;
}

export default function BrandSwitcher({
  currentBrandId,
  categoryId,
  className = '',
}: BrandSwitcherProps) {
  const brands = getAllBrands();

  return (
    <div className={`flex items-center gap-2 overflow-x-auto overscroll-x-contain scrollbar-hide pb-1 snap-x snap-mandatory ${className}`}>
      {brands.map((brand) => {
        const isActive = brand.id === currentBrandId;
        const href = categoryId
          ? `/brand/${brand.id}/${categoryId}`
          : `/brand/${brand.id}`;

        return (
          <Link
            key={brand.id}
            href={href}
            className={`inline-flex shrink-0 snap-start items-center gap-2 rounded-full border px-3.5 py-2 min-h-11 type-caption transition-all ${
              isActive
                ? 'border-transparent bg-[var(--color-asics-accent)]/15 text-[var(--color-asics-accent)]'
                : 'border-[var(--color-border)] text-[var(--color-foreground)]/70 hover:text-[var(--color-foreground)]'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: brand.color }}
              aria-hidden="true"
            />
            <span>{brand.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
