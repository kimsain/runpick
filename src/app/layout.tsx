// Root layout (Server Component). Sets metadata, fonts (Pretendard + Inter),
// and wraps children in LayoutClient for animations/smooth scroll.
// lang="ko" for Korean content. Fonts loaded via CDN, not next/font.

import type { Metadata } from "next";
import "./globals.css";
import LayoutClient from "@/components/layout/LayoutClient";

export const metadata: Metadata = {
  title: "RunPick - 당신에게 딱 맞는 러닝화를 찾아드립니다",
  description: "Asics 러닝화 카탈로그 및 추천 퀴즈. Daily, Super Trainer, Racing 카테고리별로 완벽한 러닝화를 찾아보세요.",
  keywords: ["러닝화", "아식스", "Asics", "러닝", "마라톤", "조깅", "운동화"],
  openGraph: {
    title: "RunPick - 당신에게 딱 맞는 러닝화",
    description: "Asics 러닝화 카탈로그 및 추천 퀴즈",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        <a href="#main-content" className="skip-link">
          본문으로 바로가기
        </a>
        <LayoutClient>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
