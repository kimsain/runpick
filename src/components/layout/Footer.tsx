'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextReveal from '@/components/effects/TextReveal';
import MagneticElement from '@/components/effects/MagneticElement';
import { STAGGER_NORMAL } from '@/constants/animation';

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (linksRef.current) {
        const items = linksRef.current.querySelectorAll('.footer-link-item');
        gsap.fromTo(
          items,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: STAGGER_NORMAL,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: linksRef.current,
              start: 'top 90%',
              end: 'top 60%',
              scrub: 1,
            },
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative bg-[var(--color-card)] border-t border-[var(--color-border)] overflow-hidden">
      {/* Subtle gradient glow at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-asics-blue)]/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-gradient-to-b from-[var(--color-asics-blue)]/5 to-transparent blur-3xl pointer-events-none" />

      {/* Floating shoe animation */}
      <FloatingShoe />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div ref={linksRef} className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 footer-link-item">
            <TextReveal as="span" mode="clip" className="text-2xl font-bold text-gradient inline-block">
              RunPick
            </TextReveal>
            <p className="mt-4 text-sm text-[var(--color-foreground)]/60 max-w-md leading-relaxed">
              당신에게 딱 맞는 러닝화를 찾아드립니다.
              카테고리별로 정리된 러닝화 카탈로그와 맞춤 추천 퀴즈로
              완벽한 러닝화를 찾아보세요.
            </p>
          </div>

          <div className="footer-link-item">
            <h3 className="text-sm font-semibold text-[var(--color-foreground)] mb-4">
              카탈로그
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/brand/asics">ASICS</FooterLink>
              <FooterLink href="/brand/asics/daily">Daily</FooterLink>
              <FooterLink href="/brand/asics/super-trainer">Super Trainer</FooterLink>
              <FooterLink href="/brand/asics/racing">Racing</FooterLink>
            </ul>
          </div>

          <div className="footer-link-item">
            <h3 className="text-sm font-semibold text-[var(--color-foreground)] mb-4">
              도움말
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/quiz">추천 퀴즈</FooterLink>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[var(--color-border)] relative footer-link-item">
          <motion.p
            className="text-center text-sm text-[var(--color-foreground)]/40"
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
    <motion.div
      className="absolute right-8 top-8 text-4xl opacity-20 pointer-events-none select-none hidden md:block"
      animate={{
        y: [0, -10, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <span role="img" aria-label="running shoe">
        👟
      </span>
    </motion.div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li>
      <MagneticElement strength={0.1}>
        <Link href={href}>
          <motion.span
            className="text-sm text-[var(--color-foreground)]/60 hover:text-[var(--color-foreground)] transition-colors inline-flex items-center gap-2 relative"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            {/* Arrow indicator */}
            <motion.span
              className="text-[var(--color-asics-accent)]"
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                x: isHovered ? 0 : -10,
              }}
              transition={{ duration: 0.2 }}
            >
              &rarr;
            </motion.span>
            <span className="relative">
              {children}
              {/* Underline effect */}
              <motion.span
                className="absolute -bottom-0.5 left-0 h-px bg-gradient-to-r from-[var(--color-asics-blue)] to-[var(--color-asics-accent)]"
                initial={{ width: 0 }}
                animate={{ width: isHovered ? '100%' : 0 }}
                transition={{ duration: 0.2 }}
              />
            </span>
          </motion.span>
        </Link>
      </MagneticElement>
    </li>
  );
}
