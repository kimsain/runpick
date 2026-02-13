// Root layout (Server Component). Sets metadata, fonts (Pretendard + Inter),
// and wraps children in LayoutClient for animations/smooth scroll.
// lang="ko" for Korean content. Fonts loaded via CDN, not next/font.

import type { Metadata } from "next";
import "./globals.css";
import LayoutClient from "@/components/layout/LayoutClient";

export const metadata: Metadata = {
  title: "RunPick - 나이키, 아디다스, 아식스 런닝화 카탈로그",
  description:
    "러닝화 카탈로그 및 맞춤 추천 퀴즈. Daily, Super Trainer, Racing 카테고리별로 나이키·아디다스·아식스 러닝화를 쉽게 비교하세요.",
  keywords: ["러닝화", "나이키", "Nike", "아디다스", "Adidas", "아식스", "Asics", "카탈로그", "러닝", "퀴즈", "추천", "마라톤", "조깅", "운동화"],
  openGraph: {
    title: "RunPick - 나이키/아디다스/아식스 런닝화 매칭",
    description: "브랜드·카테고리 기반 런닝화 카탈로그와 5개 질문 추천 퀴즈로 내게 맞는 신발을 찾습니다.",
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
