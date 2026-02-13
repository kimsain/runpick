'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import MagneticElement from '@/components/effects/MagneticElement';
import { DUR_FAST } from '@/constants/animation';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { useScrollVisibility } from '@/hooks/useScrollVisibility';
import { useInteractionCapabilities } from '@/hooks/useInteractionCapabilities';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDesktop = useIsDesktop();
  const { hasMotionBudget } = useInteractionCapabilities();
  const animateEnabled = !useReducedMotion() && hasMotionBudget;
  const pathname = usePathname();
  const { isScrolled, isHidden } = useScrollVisibility({ enabled: isDesktop });

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const hideByScroll = isHidden && !mobileMenuOpen;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: hideByScroll ? -100 : 0 }}
        transition={animateEnabled ? { duration: DUR_FAST, ease: 'easeOut' } : undefined}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || mobileMenuOpen
            ? 'glass shadow-lg shadow-[var(--color-asics-blue)]/10 backdrop-blur-xl border-b border-white/10'
            : 'bg-transparent backdrop-blur-none border-b border-transparent'
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo - Left */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <motion.span
                className="type-h3 text-gradient relative"
                whileHover={animateEnabled ? { scale: 1.05 } : undefined}
                whileTap={animateEnabled ? { scale: 0.95 } : undefined}
                style={{ textShadow: '0 0 20px rgba(0, 61, 165, 0.3)' }}
              >
                RunPick
              </motion.span>
            </Link>

            {/* Desktop Navigation - Right aligned */}
            <div className="hidden md:flex items-center gap-8">
              <MagneticElement strength={0.15}>
                <NavLink href="/brand" animateEnabled={animateEnabled}>
                  Catalog
                </NavLink>
              </MagneticElement>
              <MagneticElement strength={0.15}>
                <NavLink href="/quiz" animateEnabled={animateEnabled}>
                  Quiz
                </NavLink>
              </MagneticElement>
            </div>

            {/* Mobile Menu Button - Right */}
            <div className="flex items-center gap-4 md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-[var(--color-card)] transition-colors"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav-panel"
              >
                <motion.div animate={mobileMenuOpen ? 'open' : 'closed'} className="w-6 h-5 flex flex-col justify-between">
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: 45, y: 8 },
                    }}
                    className="w-full h-0.5 bg-[var(--color-foreground)] origin-left"
                  />
                  <motion.span
                    variants={{
                      closed: { opacity: 1 },
                      open: { opacity: 0 },
                    }}
                    className="w-full h-0.5 bg-[var(--color-foreground)]"
                  />
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: -45, y: -8 },
                    }}
                    className="w-full h-0.5 bg-[var(--color-foreground)] origin-left"
                  />
                </motion.div>
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={animateEnabled ? { opacity: 0 } : false}
            animate={animateEnabled ? { opacity: 1 } : undefined}
            exit={animateEnabled ? { opacity: 0 } : undefined}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={animateEnabled ? { opacity: 0 } : false}
              animate={animateEnabled ? { opacity: 1 } : undefined}
              exit={animateEnabled ? { opacity: 0 } : undefined}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Menu Content */}
            <motion.div
              initial={animateEnabled ? { x: '100%' } : false}
              animate={animateEnabled ? { x: 0 } : undefined}
              exit={animateEnabled ? { x: '100%' } : undefined}
              transition={animateEnabled ? { type: 'spring', damping: 25, stiffness: 200 } : undefined}
              className="absolute top-16 right-0 bottom-0 w-full max-w-sm bg-[var(--color-card)] border-l border-[var(--color-border)] overflow-y-auto pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
              id="mobile-nav-panel"
              role="dialog"
              aria-modal="true"
              aria-label="모바일 메뉴"
            >
              <div className="p-6 space-y-4">
                <p className="type-kicker text-[var(--color-foreground)]/45">
                  Menu
                </p>
                <MobileNavLink href="/brand" onClick={() => setMobileMenuOpen(false)} animateEnabled={animateEnabled}>
                  🏷️ Catalog
                </MobileNavLink>
                <MobileNavLink href="/quiz" onClick={() => setMobileMenuOpen(false)} animateEnabled={animateEnabled}>
                  🎯 Quiz
                </MobileNavLink>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({
  href,
  children,
  animateEnabled,
}: {
  href: string;
  children: React.ReactNode;
  animateEnabled: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={href}>
      <motion.span
        className="type-body font-semibold text-[var(--color-foreground)]/70 hover:text-[var(--color-foreground)] transition-all duration-300 relative px-3 py-2 rounded-lg min-h-[44px] inline-flex items-center"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={animateEnabled ? { y: -2, color: 'var(--color-asics-accent)' } : undefined}
        animate={{
          backgroundColor: isHovered ? 'rgba(0, 61, 165, 0.1)' : 'transparent',
        }}
        transition={animateEnabled ? { duration: 0.2 } : undefined}
      >
        {children}
        {/* Animated underline using clip-path reveal */}
        <motion.span
          className="absolute -bottom-0 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[var(--color-asics-blue)] to-[var(--color-asics-accent)] rounded-full"
          style={{
            clipPath: isHovered ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
            transition: 'clip-path 0.3s ease-out',
          }}
        />
        {/* Subtle glow on hover */}
        <motion.span
          className="absolute inset-0 rounded-lg pointer-events-none"
          animate={
            animateEnabled
              ? {
                  boxShadow: isHovered
                    ? '0 0 15px rgba(0, 61, 165, 0.3)'
                    : '0 0 0px rgba(0, 61, 165, 0)',
                }
              : undefined
          }
          transition={animateEnabled ? { duration: 0.3 } : undefined}
        />
      </motion.span>
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
  animateEnabled,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
  animateEnabled: boolean;
}) {
  return (
    <Link href={href} onClick={onClick}>
      <motion.div
        whileHover={animateEnabled ? { x: 10, backgroundColor: 'rgba(0, 61, 165, 0.1)' } : undefined}
        whileTap={animateEnabled ? { scale: 0.98 } : undefined}
        className="type-body py-4 px-4 -mx-4 border-b border-[var(--color-border)]/50 rounded-lg transition-colors relative overflow-hidden"
      >
        <motion.span
          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--color-asics-blue)] to-[var(--color-asics-accent)]"
          initial={animateEnabled ? { scaleY: 0 } : false}
          whileHover={animateEnabled ? { scaleY: 1 } : undefined}
          transition={animateEnabled ? { duration: 0.2 } : undefined}
        />
        {children}
      </motion.div>
    </Link>
  );
}
