'use client';
import { useEffect, useState } from 'react';
import { MOBILE_BREAKPOINT } from '@/constants/animation';

// Cache grain texture at module level — generated once per browser session
let cachedGrainUrl: string | null = null;

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
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    if (window.innerWidth >= MOBILE_BREAKPOINT) {
      setGrainUrl(getGrainTexture());
    }
  }, []);

  if (isMobile || !grainUrl) return null;

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
