'use client';

import Image, { ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

interface SmartShoeImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackSrc?: string;
  forceFallback?: boolean;
  showFallbackBadge?: boolean;
  fallbackBadgeLabel?: string;
  fallbackBadgeClassName?: string;
}

const DEFAULT_FALLBACK_SRC = '/shoes/placeholder-shoe.svg';

export default function SmartShoeImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK_SRC,
  forceFallback = false,
  showFallbackBadge = false,
  fallbackBadgeLabel = '사진 준비중',
  fallbackBadgeClassName = 'absolute bottom-3 right-3 z-20 rounded-full border border-white/20 bg-black/60 px-2 py-1 text-[10px] font-medium text-white',
  onError,
  ...props
}: SmartShoeImageProps) {
  const [resolvedSrc, setResolvedSrc] = useState(
    forceFallback ? fallbackSrc : src || fallbackSrc
  );
  const [isFallback, setIsFallback] = useState(forceFallback || !src || src === fallbackSrc);

  useEffect(() => {
    if (forceFallback) {
      setResolvedSrc(fallbackSrc);
      setIsFallback(true);
      return;
    }
    setResolvedSrc(src || fallbackSrc);
    setIsFallback(!src || src === fallbackSrc);
  }, [src, fallbackSrc, forceFallback]);

  return (
    <>
      <Image
        {...props}
        alt={alt}
        src={resolvedSrc}
        onError={(e) => {
          if (resolvedSrc !== fallbackSrc) {
            setResolvedSrc(fallbackSrc);
            setIsFallback(true);
          }
          onError?.(e);
        }}
      />
      {isFallback && showFallbackBadge && (
        <span className={fallbackBadgeClassName}>{fallbackBadgeLabel}</span>
      )}
    </>
  );
}
