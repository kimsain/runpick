'use client';

import { useEffect, useState } from 'react';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { useReducedMotion } from 'framer-motion';

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
    addEventListener?: (type: string, listener: EventListenerOrEventListenerObject) => void;
    removeEventListener?: (type: string, listener: EventListenerOrEventListenerObject) => void;
  };
};

const LOW_POWER_CONNECTION_TYPES = new Set(['slow-2g', '2g']);
const COARSE_POINTER_QUERY = '(hover: none), (pointer: coarse)';

function getConnectionSaveData(connection?: NavigatorWithConnection['connection']): boolean {
  if (!connection) return false;

  return (
    Boolean(connection.saveData) ||
    !!(connection.effectiveType && LOW_POWER_CONNECTION_TYPES.has(connection.effectiveType))
  );
}

function getPointerRestriction(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(COARSE_POINTER_QUERY).matches || 'ontouchstart' in window;
}

export interface InteractionCapabilities {
  isDesktop: boolean;
  isPointerRestricted: boolean;
  isSaveDataEnabled: boolean;
  hasMotionBudget: boolean;
}

export function useInteractionCapabilities(): InteractionCapabilities {
  const isDesktop = useIsDesktop();
  const reduceMotion = useReducedMotion();
  const [isPointerRestricted, setIsPointerRestricted] = useState(() =>
    getPointerRestriction()
  );
  const [isSaveDataEnabled, setIsSaveDataEnabled] = useState(() => {
    if (typeof navigator === 'undefined') return false;
    return getConnectionSaveData((navigator as NavigatorWithConnection).connection);
  });

  useEffect(() => {
    const navConnection = (navigator as NavigatorWithConnection).connection;
    const pointerMediaQuery = window.matchMedia(COARSE_POINTER_QUERY);
    const addQueryListener = pointerMediaQuery.addEventListener
      ? (listener: EventListenerOrEventListenerObject) => pointerMediaQuery.addEventListener('change', listener)
      : (listener: EventListenerOrEventListenerObject) => pointerMediaQuery.addListener(listener as () => void);
    const removeQueryListener = pointerMediaQuery.removeEventListener
      ? (listener: EventListenerOrEventListenerObject) => pointerMediaQuery.removeEventListener('change', listener)
      : (listener: EventListenerOrEventListenerObject) =>
        pointerMediaQuery.removeListener(listener as () => void);

    const evaluate = () => {
      const nextPointer = getPointerRestriction();
      const nextSaveData = getConnectionSaveData(navConnection);

      setIsPointerRestricted((prev) => (prev === nextPointer ? prev : nextPointer));
      setIsSaveDataEnabled((prev) => (prev === nextSaveData ? prev : nextSaveData));
    };

    evaluate();
    addQueryListener(evaluate);
    window.addEventListener('orientationchange', evaluate);
    navConnection?.addEventListener?.('change', evaluate);
    navConnection?.addEventListener?.('typechange', evaluate);

    return () => {
      removeQueryListener(evaluate);
      window.removeEventListener('orientationchange', evaluate);
      navConnection?.removeEventListener?.('change', evaluate);
      navConnection?.removeEventListener?.('typechange', evaluate);
    };
  }, []);

  const hasMotionBudget = !(reduceMotion || isSaveDataEnabled || isPointerRestricted);

  return {
    isDesktop,
    isPointerRestricted,
    isSaveDataEnabled,
    hasMotionBudget,
  };
}
