'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const moveCursor = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    },
    [cursorX, cursorY, isVisible]
  );

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (!isMobile) {
      window.addEventListener('mousemove', moveCursor);

      // Track hover states
      const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (
          target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.closest('a') ||
          target.closest('button') ||
          target.classList.contains('cursor-pointer') ||
          target.closest('.cursor-pointer')
        ) {
          setIsHovering(true);
        }
      };

      const handleMouseOut = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (
          target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.closest('a') ||
          target.closest('button') ||
          target.classList.contains('cursor-pointer') ||
          target.closest('.cursor-pointer')
        ) {
          setIsHovering(false);
        }
      };

      const handleMouseLeave = () => {
        setIsVisible(false);
      };

      const handleMouseEnter = () => {
        setIsVisible(true);
      };

      document.addEventListener('mouseover', handleMouseOver);
      document.addEventListener('mouseout', handleMouseOut);
      document.documentElement.addEventListener('mouseleave', handleMouseLeave);
      document.documentElement.addEventListener('mouseenter', handleMouseEnter);

      return () => {
        window.removeEventListener('mousemove', moveCursor);
        window.removeEventListener('resize', checkMobile);
        document.removeEventListener('mouseover', handleMouseOver);
        document.removeEventListener('mouseout', handleMouseOut);
        document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
        document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      };
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [moveCursor, isMobile]);

  // Don't render on mobile
  if (isMobile) return null;

  return (
    <>
      {/* Hide default cursor */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full bg-white"
          animate={{
            width: isHovering ? 60 : 12,
            height: isHovering ? 60 : 12,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25,
          }}
        />
      </motion.div>

      {/* Outer ring / glow effect */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full border-2"
          style={{
            borderColor: 'var(--color-asics-accent)',
            boxShadow: '0 0 20px var(--color-asics-accent)',
          }}
          animate={{
            width: isHovering ? 80 : 40,
            height: isHovering ? 80 : 40,
            opacity: isVisible ? (isHovering ? 0.8 : 0.3) : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
        />
      </motion.div>
    </>
  );
}
