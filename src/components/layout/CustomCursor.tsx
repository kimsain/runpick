'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import { SPRING_SNAPPY } from '@/constants/animation';

type CursorState = 'default' | 'hover' | 'text' | 'view' | 'drag';

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
    addEventListener?: (type: string, listener: EventListenerOrEventListenerObject) => void;
    removeEventListener?: (type: string, listener: EventListenerOrEventListenerObject) => void;
  };
};

const LOW_POWER_CONNECTION_TYPES = new Set(['slow-2g', '2g']);

function getSaveDataPreference(): boolean {
  const connection = (navigator as NavigatorWithConnection).connection;
  if (!connection) return false;

  return Boolean(connection.saveData) ||
    !!(connection.effectiveType && LOW_POWER_CONNECTION_TYPES.has(connection.effectiveType));
}

export default function CustomCursor() {
  const animateEnabled = !useReducedMotion();
  const [cursorState, setCursorState] = useState<CursorState>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isPointerRestricted, setIsPointerRestricted] = useState(true);
  const [isSaveData, setIsSaveData] = useState(false);
  const cursorStateRef = useRef<CursorState>('default');

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: SPRING_SNAPPY.damping, stiffness: SPRING_SNAPPY.stiffness };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const updateCursorState = useCallback((next: CursorState) => {
    if (cursorStateRef.current === next) return;
    cursorStateRef.current = next;
    setCursorState(next);
  }, []);

  const moveCursor = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible((prev) => (prev ? prev : true));
    },
    [cursorX, cursorY]
  );

  useEffect(() => {
    const nav = navigator as NavigatorWithConnection;
    const connection = nav.connection;

    const checkEnv = () => {
      const pointerRestricted =
        window.matchMedia('(hover: none), (pointer: coarse)').matches || 'ontouchstart' in window;
      const saveDataEnabled = getSaveDataPreference();

      setIsPointerRestricted((prev) => (prev === pointerRestricted ? prev : pointerRestricted));
      setIsSaveData((prev) => (prev === saveDataEnabled ? prev : saveDataEnabled));
    };

    const handleConnectionChange = () => {
      const saveDataEnabled = getSaveDataPreference();
      setIsSaveData((prev) => (prev === saveDataEnabled ? prev : saveDataEnabled));
    };

    checkEnv();
    window.addEventListener('resize', checkEnv);
    connection?.addEventListener?.('change', handleConnectionChange);
    connection?.addEventListener?.('typechange', handleConnectionChange);

    const shouldRenderCursor = animateEnabled && !isPointerRestricted && !isSaveData;
    if (!shouldRenderCursor) {
      return () => {
        window.removeEventListener('resize', checkEnv);
        connection?.removeEventListener?.('change', handleConnectionChange);
        connection?.removeEventListener?.('typechange', handleConnectionChange);
      };
    }

    window.addEventListener('mousemove', moveCursor, { passive: true });

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursorAttr = target.closest('[data-cursor]')?.getAttribute('data-cursor');
      if (cursorAttr === 'view' || cursorAttr === 'drag' || cursorAttr === 'text' || cursorAttr === 'hover') {
        updateCursorState(cursorAttr);
        return;
      }

      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        target.closest('.cursor-pointer')
      ) {
        updateCursorState('hover');
        return;
      }

      if (
        target.tagName === 'P' ||
        target.tagName === 'SPAN' ||
        target.tagName === 'H1' ||
        target.tagName === 'H2' ||
        target.tagName === 'H3' ||
        target.tagName === 'LI' ||
        target.tagName === 'LABEL'
      ) {
        updateCursorState('text');
        return;
      }

      updateCursorState('default');
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const relatedTarget = e.relatedTarget as HTMLElement | null;

      if (target.closest('[data-cursor]') && !relatedTarget?.closest('[data-cursor]')) {
        updateCursorState('default');
        return;
      }

      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        target.closest('.cursor-pointer') ||
        target.tagName === 'P' ||
        target.tagName === 'SPAN' ||
        target.tagName === 'H1' ||
        target.tagName === 'H2' ||
        target.tagName === 'H3' ||
        target.tagName === 'LI' ||
        target.tagName === 'LABEL'
      ) {
        updateCursorState('default');
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
      window.removeEventListener('resize', checkEnv);
      connection?.removeEventListener?.('change', handleConnectionChange);
      connection?.removeEventListener?.('typechange', handleConnectionChange);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [animateEnabled, isPointerRestricted, isSaveData, moveCursor, updateCursorState]);

  if (!animateEnabled || isPointerRestricted || isSaveData) return null;

  const getCursorSize = () => {
    switch (cursorState) {
      case 'hover':
        return 60;
      case 'text':
        return 2;
      case 'view':
      case 'drag':
        return 80;
      default:
        return 12;
    }
  };

  const isTextState = cursorState === 'text';
  const isLabelState = cursorState === 'view' || cursorState === 'drag';
  const dotSize = getCursorSize();

  return (
    <>
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>

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
          className="flex items-center justify-center bg-white"
          animate={{
            width: isTextState ? 2 : dotSize,
            height: isTextState ? 24 : dotSize,
            borderRadius: isTextState ? 1 : dotSize / 2,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25,
          }}
        >
          <AnimatePresence>
            {isLabelState && (
              <motion.span
                className="text-[10px] font-bold tracking-widest text-black uppercase select-none"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                {cursorState === 'view' ? 'VIEW' : 'DRAG'}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

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
          }}
          animate={{
            width: cursorState === 'hover'
              ? 80
              : cursorState === 'view' || cursorState === 'drag'
                ? 100
                : isTextState ? 0 : 40,
            height: cursorState === 'hover'
              ? 80
              : cursorState === 'view' || cursorState === 'drag'
                ? 100
                : isTextState ? 0 : 40,
            opacity: isVisible
              ? (cursorState === 'default' ? 0.3 : cursorState === 'text' ? 0 : 0.8)
              : 0,
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
