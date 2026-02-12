'use client';
import { useEffect, useState } from 'react';
import { MOBILE_BREAKPOINT } from '@/constants/animation';

interface FloatingShapesProps {
  color?: string;
  count?: number;
  className?: string;
}

interface Shape {
  id: number;
  size: number;
  x: string;
  y: string;
  duration: number;
  delay: number;
}

export default function FloatingShapes({
  color = 'var(--color-asics-accent)',
  count = 3,
  className = '',
}: FloatingShapesProps) {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const generated = Array.from({ length: count }, (_, i) => ({
      id: i,
      size: 200 + Math.random() * 200,
      x: `${Math.random() * 80}%`,
      y: `${Math.random() * 80}%`,
      duration: 20 + Math.random() * 10,
      delay: Math.random() * 5,
    }));
    setShapes(generated);

    return () => window.removeEventListener('resize', checkMobile);
  }, [count]);

  if (isMobile) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className="absolute rounded-full"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
            background: color,
            filter: `blur(80px)`,
            opacity: 0.08,
            willChange: 'transform',
            animation: `floating-shape ${shape.duration}s linear ${shape.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
