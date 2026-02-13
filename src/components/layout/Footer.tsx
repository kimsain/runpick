'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger, gsap, ensureScrollTriggerRegistration } from '@/lib/scroll-trigger';
import TextReveal from '@/components/effects/TextReveal';
import { STAGGER_NORMAL } from '@/constants/animation';
import { getAllBrands } from '@/utils/shoe-utils';
import { useInteractionCapabilities } from '@/hooks/useInteractionCapabilities';

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const brands = getAllBrands();
  const { isDesktop, hasMotionBudget } = useInteractionCapabilities();
  const isEnabled = isDesktop && hasMotionBudget;

  useEffect(() => {
    if (!isEnabled) return;
    ensureScrollTriggerRegistration();

    const ctx = gsap.context(() => {
      if (linksRef.current) {
        const items = linksRef.current.querySelectorAll('.footer-link-item');
        gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: STAGGER_NORMAL,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: linksRef.current,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          });
      }
    }, footerRef);

    return () => ctx.revert();
  }, [isEnabled]);

  return (
    <footer ref={footerRef} className="relative bg-[var(--color-card)] border-t border-[var(--color-border)] overflow-hidden">
      {/* Subtle gradient glow at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-asics-blue)]/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-gradient-to-b from-[var(--color-asics-blue)]/5 to-transparent blur-3xl pointer-events-none" />

      {/* Floating shoe animation */}
      <FloatingShoe />

      <div className="relative layout-shell section-space-tight">
        <div ref={linksRef} className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          <div className="col-span-1 md:col-span-2 footer-link-item">
            <TextReveal as="span" mode="clip" className="type-h3 text-gradient inline-block">
              RunPick
            </TextReveal>
            <p className="mt-4 type-body text-[var(--color-foreground)]/65 max-w-md">
              당신에게 딱 맞는 러닝화를 찾아드립니다.
              카테고리별로 정리된 러닝화 카탈로그와 맞춤 추천 퀴즈로
              완벽한 러닝화를 찾아보세요.
            </p>
          </div>

          <div className="footer-link-item">
            <h3 className="type-h3 text-[var(--color-foreground)] mb-4">
              카탈로그
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/brand">전체 브랜드</FooterLink>
              {brands.map((brand) => (
                <FooterLink key={brand.id} href={`/brand/${brand.id}`}>
                  {brand.name}
                </FooterLink>
              ))}
            </ul>
          </div>

          <div className="footer-link-item">
            <h3 className="type-h3 text-[var(--color-foreground)] mb-4">
              도움말
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/quiz">추천 퀴즈</FooterLink>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[var(--color-border)] relative footer-link-item">
          <motion.p
            className="text-center type-caption text-[var(--color-foreground)]/40"
            initial={{ opacity: 0.4 }}
            whileHover={{ opacity: 0.7 }}
            transition={{ duration: 0.3 }}
          >
            &copy; 2024 RunPick. 러닝화 정보는 공식 사이트 기준이며, 가격은 변동될 수 있습니다.
          </motion.p>
        </div>
      </div>
    </footer>
  );
}

function FloatingShoe() {
  return (
    <div className="absolute right-8 top-8 text-4xl opacity-20 pointer-events-none select-none hidden md:block">
      <span role="img" aria-label="running shoe">👟</span>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href}>
        <motion.span
          className="type-body text-[var(--color-foreground)]/60 hover:text-[var(--color-foreground)] transition-colors inline-flex items-center gap-2 relative min-h-[44px]"
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
      </Link>
    </li>
  );
}
