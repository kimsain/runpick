'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes or scroll
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

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || mobileMenuOpen
            ? 'glass shadow-lg shadow-[var(--color-asics-blue)]/10 backdrop-blur-xl'
            : 'bg-transparent backdrop-blur-none'
        }`}
        style={{
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.1)' : 'none',
        }}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo - Left */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <motion.span
                className="text-2xl font-bold text-gradient relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  textShadow: [
                    '0 0 20px rgba(0, 51, 141, 0.3)',
                    '0 0 30px rgba(0, 51, 141, 0.5)',
                    '0 0 20px rgba(0, 51, 141, 0.3)',
                  ],
                }}
                transition={{
                  textShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
              >
                RunPick
              </motion.span>
            </Link>

            {/* Desktop Navigation - Right aligned */}
            <div className="hidden md:flex items-center gap-8">
              <NavLink href="/brand/asics">Catalog</NavLink>
              <NavLink href="/quiz">Quiz</NavLink>
            </div>

            {/* Mobile Menu Button - Right */}
            <div className="flex items-center gap-4 md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-[var(--color-card)] transition-colors"
                aria-label="Toggle menu"
              >
                <motion.div
                  animate={mobileMenuOpen ? 'open' : 'closed'}
                  className="w-6 h-5 flex flex-col justify-between"
                >
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-16 right-0 bottom-0 w-full max-w-sm bg-[var(--color-card)] border-l border-[var(--color-border)]"
            >
              <div className="p-6 space-y-6">
                <MobileNavLink
                  href="/brand/asics"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🏷️ Catalog
                </MobileNavLink>
                <MobileNavLink href="/quiz" onClick={() => setMobileMenuOpen(false)}>
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

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={href}>
      <motion.span
        className="text-sm font-semibold text-[var(--color-foreground)]/70 hover:text-[var(--color-foreground)] transition-all duration-300 relative px-3 py-2 rounded-lg"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{
          y: -2,
          color: 'var(--color-asics-accent)',
        }}
        animate={{
          backgroundColor: isHovered ? 'rgba(0, 51, 141, 0.1)' : 'transparent',
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
        {/* Animated underline */}
        <motion.span
          className="absolute -bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-[var(--color-asics-blue)] to-[var(--color-asics-accent)] rounded-full"
          initial={{ width: 0, x: '-50%' }}
          animate={{
            width: isHovered ? '80%' : 0,
            x: '-50%',
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
        {/* Subtle glow on hover */}
        <motion.span
          className="absolute inset-0 rounded-lg pointer-events-none"
          animate={{
            boxShadow: isHovered
              ? '0 0 15px rgba(0, 51, 141, 0.3)'
              : '0 0 0px rgba(0, 51, 141, 0)',
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.span>
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link href={href} onClick={onClick}>
      <motion.div
        whileHover={{
          x: 10,
          backgroundColor: 'rgba(0, 51, 141, 0.1)',
        }}
        whileTap={{ scale: 0.98 }}
        className="text-lg font-medium text-[var(--color-foreground)] py-4 px-4 -mx-4 border-b border-[var(--color-border)]/50 rounded-lg transition-colors relative overflow-hidden"
      >
        <motion.span
          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--color-asics-blue)] to-[var(--color-asics-accent)]"
          initial={{ scaleY: 0 }}
          whileHover={{ scaleY: 1 }}
          transition={{ duration: 0.2 }}
        />
        {children}
      </motion.div>
    </Link>
  );
}
