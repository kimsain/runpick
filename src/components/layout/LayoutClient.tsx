'use client';

import { usePathname } from 'next/navigation';
import SmoothScroll from './SmoothScroll';
import CustomCursor from './CustomCursor';
import PageTransition from './PageTransition';

interface LayoutClientProps {
  children: React.ReactNode;
}

export default function LayoutClient({ children }: LayoutClientProps) {
  const pathname = usePathname();

  return (
    <>
      <CustomCursor />
      <SmoothScroll key={pathname}>
        <PageTransition>
          {children}
        </PageTransition>
      </SmoothScroll>
    </>
  );
}
