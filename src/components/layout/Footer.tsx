'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-[var(--color-card)] border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <motion.span
              className="text-2xl font-bold text-gradient"
              whileHover={{ scale: 1.05 }}
            >
              RunPick
            </motion.span>
            <p className="mt-4 text-sm text-[var(--color-foreground)]/60 max-w-md">
              당신에게 딱 맞는 러닝화를 찾아드립니다.
              카테고리별로 정리된 러닝화 카탈로그와 맞춤 추천 퀴즈로
              완벽한 러닝화를 찾아보세요.
            </p>
          </div>

          <div>
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

          <div>
            <h3 className="text-sm font-semibold text-[var(--color-foreground)] mb-4">
              도움말
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/quiz">추천 퀴즈</FooterLink>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[var(--color-border)]">
          <p className="text-center text-sm text-[var(--color-foreground)]/40">
            © 2024 RunPick. 러닝화 정보는 공식 사이트 기준이며, 가격은 변동될 수 있습니다.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-[var(--color-foreground)]/60 hover:text-[var(--color-foreground)] transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}
