'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { MOBILE_BREAKPOINT } from '@/constants/animation';

// Cache grain texture at module level — generated once per browser session
let cachedGrainUrl: string | null = null;

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
    addEventListener?: (type: string, listener: EventListenerOrEventListenerObject) => void;
    removeEventListener?: (type: string, listener: EventListenerOrEventListenerObject) => void;
  };
};

const LOW_POWER_CONNECTION_TYPES = new Set(['slow-2g', '2g']);

function shouldDisableGrain(animateEnabled: boolean): boolean {
  if (!animateEnabled) return true;

  const prefersCoarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches || 'ontouchstart' in window;
  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  const conn = (navigator as NavigatorWithConnection).connection;
  const isSaveData = Boolean(conn?.saveData) ||
    !!(conn?.effectiveType && LOW_POWER_CONNECTION_TYPES.has(conn.effectiveType));

  return prefersCoarsePointer || isMobile || isSaveData;
}

function getGrainTexture(): string {
  if (cachedGrainUrl) return cachedGrainUrl;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const imageData = ctx.createImageData(256, 256);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const value = Math.random() * 255;
    imageData.data[i] = value;
    imageData.data[i + 1] = value;
    imageData.data[i + 2] = value;
    imageData.data[i + 3] = 25;
  }
  ctx.putImageData(imageData, 0, 0);
  cachedGrainUrl = canvas.toDataURL('image/png');
  return cachedGrainUrl;
}

export default function GrainOverlay() {
  const [grainUrl, setGrainUrl] = useState<string | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const animateEnabled = !useReducedMotion();

  useEffect(() => {
    const handleResize = () => {
      setIsEnabled(!shouldDisableGrain(animateEnabled));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const connection = (navigator as NavigatorWithConnection).connection;
    const handleConnectionChange = () => {
      handleResize();
    };

    connection?.addEventListener?.('change', handleConnectionChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      connection?.removeEventListener?.('change', handleConnectionChange);
    };
  }, [animateEnabled]);

  useEffect(() => {
    if (!isEnabled) return;
    if (!grainUrl) {
      setGrainUrl(getGrainTexture());
    }
  }, [isEnabled, grainUrl]);

  if (!isEnabled || !grainUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[9990] pointer-events-none"
      style={{
        backgroundImage: `url(${grainUrl})`,
        backgroundRepeat: 'repeat',
        mixBlendMode: 'overlay',
        opacity: 0.4,
      }}
    />
  );
}
