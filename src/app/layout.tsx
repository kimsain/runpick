import type { Metadata } from "next";
import "./globals.css";

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
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
