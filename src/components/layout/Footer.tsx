'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';
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
  const animateEnabled = !useReducedMotion() && hasMotionBudget;
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

      <div className="relative layout-shell section-space-tight">
        <div ref={linksRef} className="flex flex-col items-center gap-6">
          <div className="footer-link-item text-center">
            <TextReveal as="span" mode="clip" className="type-h3 text-gradient inline-block">
              RunPick
            </TextReveal>
          </div>

          <div className="footer-link-item text-center">
            <h3 className="type-h3 text-[var(--color-foreground)] mb-3">
              카탈로그
            </h3>
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <FooterLink href="/brand" animateEnabled={animateEnabled}>전체 브랜드</FooterLink>
              {brands.map((brand) => (
                <FooterLink key={brand.id} href={`/brand/${brand.id}`} animateEnabled={animateEnabled}>
                  {brand.name}
                </FooterLink>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[var(--color-border)] relative footer-link-item">
          <motion.p
            className="text-center type-caption text-[var(--color-foreground)]/40"
            initial={{ opacity: 0.4 }}
            whileHover={animateEnabled ? { opacity: 0.7 } : undefined}
            transition={animateEnabled ? { duration: 0.3 } : undefined}
          >
            &copy; 2024 RunPick. 러닝화 정보는 공식 사이트 기준이며, 가격은 변동될 수 있습니다.
          </motion.p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
  animateEnabled,
}: {
  href: string;
  children: React.ReactNode;
  animateEnabled: boolean;
}) {
  return (
    <li>
      <Link href={href}>
        <motion.span
          className="type-body text-[var(--color-foreground)]/60 hover:text-[var(--color-foreground)] transition-colors inline-flex items-center gap-2 relative min-h-[44px]"
          whileHover={animateEnabled ? { x: 4 } : undefined}
          transition={animateEnabled ? { duration: 0.2 } : undefined}
        >
          {children}
        </motion.span>
      </Link>
    </li>
  );
}
