'use client';

import { useSyncExternalStore } from 'react';
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
const LISTENERS = new Set<() => void>();

interface InteractionSnapshot {
  isPointerRestricted: boolean;
  isSaveDataEnabled: boolean;
}

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

let pointerMediaQuery: MediaQueryList | null = null;
let navConnection: NavigatorWithConnection['connection'] | undefined;
let snapshot: InteractionSnapshot = {
  isPointerRestricted: false,
  isSaveDataEnabled: false,
};

function setSnapshot(next: InteractionSnapshot) {
  snapshot = {
    ...snapshot,
    ...next,
  };
}

function notify() {
  for (const listener of LISTENERS) {
    listener();
  }
}

function evaluate() {
  const nextPointer = getPointerRestriction();
  const nextSaveData = getConnectionSaveData(navConnection);

  if (
    nextPointer !== snapshot.isPointerRestricted ||
    nextSaveData !== snapshot.isSaveDataEnabled
  ) {
    setSnapshot({
      isPointerRestricted: nextPointer,
      isSaveDataEnabled: nextSaveData,
    });
    notify();
  }
}

function addGlobalListeners() {
  if (typeof window === 'undefined' || pointerMediaQuery) return;

  pointerMediaQuery = window.matchMedia(COARSE_POINTER_QUERY);
  navConnection = (navigator as NavigatorWithConnection).connection;

  if (typeof pointerMediaQuery.addEventListener === 'function') {
    pointerMediaQuery.addEventListener('change', evaluate);
  } else {
    pointerMediaQuery.addListener(evaluate);
  }
  window.addEventListener('orientationchange', evaluate);

  navConnection?.addEventListener?.('change', evaluate);
  navConnection?.addEventListener?.('typechange', evaluate);

  // Evaluate immediately so late-mounted components receive up-to-date values.
  evaluate();
}

function removeGlobalListeners() {
  if (!pointerMediaQuery) return;

  window.removeEventListener('orientationchange', evaluate);
  if (typeof pointerMediaQuery.removeEventListener === 'function') {
    pointerMediaQuery.removeEventListener('change', evaluate);
  } else {
    pointerMediaQuery.removeListener(evaluate);
  }
  navConnection?.removeEventListener?.('change', evaluate);
  navConnection?.removeEventListener?.('typechange', evaluate);

  pointerMediaQuery = null;
  navConnection = undefined;
  snapshot = {
    isPointerRestricted: false,
    isSaveDataEnabled: false,
  };
}

function subscribe(listener: () => void): () => void {
  LISTENERS.add(listener);

  if (typeof window !== 'undefined' && !pointerMediaQuery) {
    addGlobalListeners();
  } else {
    evaluate();
  }

  return () => {
    LISTENERS.delete(listener);
    if (!LISTENERS.size) {
      removeGlobalListeners();
    }
  };
}

function getSnapshot(): InteractionSnapshot {
  return snapshot;
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

  const { isPointerRestricted, isSaveDataEnabled } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => ({ isPointerRestricted: false, isSaveDataEnabled: false })
  );

  const hasMotionBudget = !(reduceMotion || isSaveDataEnabled || isPointerRestricted);

  return {
    isDesktop,
    isPointerRestricted,
    isSaveDataEnabled,
    hasMotionBudget,
  };
}
