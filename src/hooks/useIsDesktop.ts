'use client';

import { useSyncExternalStore } from 'react';
import { MOBILE_BREAKPOINT } from '@/constants/animation';

type StoreListener = () => void;

interface DesktopStore {
  getSnapshot: () => boolean;
  subscribe: (listener: StoreListener) => () => void;
}

const desktopStoreByBreakpoint = new Map<number, DesktopStore>();

function createDesktopStore(breakpoint: number): DesktopStore {
  let mediaQuery: MediaQueryList | null = null;
  let matches = false;
  const listeners = new Set<StoreListener>();

  const emit = () => {
    for (const listener of listeners) {
      listener();
    }
  };

  const sync = () => {
    const next = mediaQuery?.matches ?? false;
    if (next === matches) return;
    matches = next;
    emit();
  };

  const setup = () => {
    if (typeof window === 'undefined' || mediaQuery) return;

    mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', sync);
    } else {
      mediaQuery.addListener(sync);
    }
    window.addEventListener('orientationchange', sync);
  };

  const teardown = () => {
    if (!mediaQuery) return;

    if (typeof mediaQuery.removeEventListener === 'function') {
      mediaQuery.removeEventListener('change', sync);
    } else {
      mediaQuery.removeListener(sync);
    }
    window.removeEventListener('orientationchange', sync);
    mediaQuery = null;
    matches = false;
  };

  return {
    getSnapshot: () => matches,
    subscribe: (listener: StoreListener) => {
      listeners.add(listener);
      setup();
      sync();

      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          teardown();
        }
      };
    },
  };
}

function getDesktopStore(breakpoint: number): DesktopStore {
  const existing = desktopStoreByBreakpoint.get(breakpoint);
  if (existing) return existing;

  const created = createDesktopStore(breakpoint);
  desktopStoreByBreakpoint.set(breakpoint, created);
  return created;
}

export function useIsDesktop(breakpoint = MOBILE_BREAKPOINT): boolean {
  const store = getDesktopStore(breakpoint);
  return useSyncExternalStore(store.subscribe, store.getSnapshot, () => false);
}
