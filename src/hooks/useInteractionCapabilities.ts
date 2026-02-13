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
  const [isPointerRestricted, setIsPointerRestricted] = useState(true);
  const [isSaveDataEnabled, setIsSaveDataEnabled] = useState(false);

  useEffect(() => {
    const navConnection = (navigator as NavigatorWithConnection).connection;
    const pointerMediaQuery = window.matchMedia(COARSE_POINTER_QUERY);

    const evaluate = () => {
      const nextPointer = getPointerRestriction();
      const nextSaveData = getConnectionSaveData(navConnection);

      setIsPointerRestricted((prev) => (prev === nextPointer ? prev : nextPointer));
      setIsSaveDataEnabled((prev) => (prev === nextSaveData ? prev : nextSaveData));
    };

    evaluate();
    pointerMediaQuery.addEventListener?.('change', evaluate);
    window.addEventListener('orientationchange', evaluate);
    navConnection?.addEventListener?.('change', evaluate);
    navConnection?.addEventListener?.('typechange', evaluate);

    return () => {
      pointerMediaQuery.removeEventListener?.('change', evaluate);
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
