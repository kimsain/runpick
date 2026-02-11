# 🏃 Asics 러닝화 카탈로그 웹앱 개발 프롬프트

## 프로젝트 개요

Asics 러닝화를 카테고리별로 소개하는 **인터랙티브 웹앱**을 만들어줘.
향후 Nike, Adidas, New Balance, Saucony, Puma 등 다른 브랜드도 추가할 예정이므로 **브랜드-독립적인 데이터 구조와 재사용 가능한 컴포넌트 아키텍처**로 설계해야 해.

---

## 기술 스택

- **Framework**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS + Framer Motion (애니메이션)
- **상태관리**: Zustand 또는 React Context (가벼운 수준)
- **데이터**: JSON 기반 정적 데이터 (브랜드별 별도 JSON 파일)
- 별도 백엔드 없이 정적 사이트로 운영

---

## 배포 & Git 연동

- **배포 플랫폼**: Vercel (Vercel과의 연결은 내가 직접 할 예정)
- **GitHub 저장소**: https://github.com/kimsain/runpick
- **작업 완료 후**: 코드 작성이 끝나면 위 저장소에 commit & push 해줘
- **Vercel 호환성 필수 확인사항**:
  - `next.config.js`에 `output: 'export'` 설정 또는 Vercel 기본 빌드 호환 확인
  - `npm run build` 시 에러 없이 빌드 성공하는지 확인 후 push
  - 이미지 최적화: `next/image` 사용 시 Vercel 환경에서 동작하도록 `unoptimized: true` 설정 또는 외부 이미지 도메인 등록
  - 환경 변수가 필요한 경우 `.env.example` 파일에 목록 정리
- **커밋 컨벤션**: 기능 단위로 의미 있는 커밋 메시지 작성 (e.g., `feat: add shoe detail page`, `data: add asics shoe data`)

---

## 데이터 구조 설계

### 카테고리 계층 (모든 브랜드 공통)

```
브랜드
├── 데일리 (Daily Trainer)
│   ├── 입문화 (Entry)
│   ├── 맥스쿠션화 (Max Cushion)
│   ├── 안정화 (Stability)
│   ├── 올라운더 (All-Rounder)
│   └── 경량트레이너 (Lightweight Trainer)
├── 슈퍼트레이너 (Super Trainer)
│   ├── 논플레이트 (No Plate)
│   ├── 라이트플레이트 (Light Plate)
│   └── 카본플레이트 (Carbon Plate)
└── 레이싱 (Racing)
    ├── 하프 (Half Marathon)
    └── 풀 (Full Marathon)
```

### 러닝화 데이터 스키마 (TypeScript 타입 정의 필수)

각 러닝화는 반드시 아래 필드를 포함해야 해:

```typescript
interface RunningShoe {
  id: string;                    // 고유 ID (e.g., "asics-gel-nimbus-28")
  brand: Brand;                  // 브랜드 enum
  name: string;                  // 한글 모델명 (e.g., "젤 님버스 28")
  nameEn: string;                // 영문 모델명 (e.g., "GEL-NIMBUS 28")
  version: number;               // 현재 세대 (최신 버전만 등록)
  category: Category;            // 대분류
  subcategory: Subcategory;      // 소분류
  imageUrl: string;              // 제품 이미지 URL (공식 사이트 or CDN)
  weight: {
    value: number;               // 무게 (g)
    size: string;                // 기준 사이즈 (e.g., "US 9" 또는 "270mm")
    gender: "men" | "women";     // 성별 기준
  };
  stack: {
    heel: number;                // 힐 스택 높이 (mm)
    forefoot: number;            // 포어풋 스택 높이 (mm)
    drop: number;                // 드랍 (mm) — heel - forefoot
  };
  price: {
    krw: number;                 // 한국 공식 가격 (원)
    currency: "KRW";
  };
  pros: string[];                // 장점 (3~5개, 톡톡 튀는 문체)
  cons: string[];                // 단점 (2~4개, 솔직하게)
  oneLiner: string;              // 한 줄 요약 (위트 있게, e.g., "쿠션의 끝판왕, 구름 위를 달리는 기분")
  releaseYear: number;           // 출시 연도
  tags: string[];                // 검색/필터용 태그 (e.g., ["쿠션", "장거리", "초보"])
  reviewSources?: {              // 장단점 작성 시 참고한 리뷰 출처 (선택)
    siteName: string;            // e.g., "RunRepeat", "Doctors of Running"
    url: string;                 // 해당 리뷰 URL
    rating?: number;             // 해당 사이트의 평점 (있을 경우)
  }[];
}
```

### Asics 러닝화 초기 데이터

아래 모델들을 **최신 버전** 기준으로 데이터를 채워줘. 웹 검색을 통해 2025~2026년 기준 최신 스펙을 확인하고, 확인이 안 되는 수치는 `null`로 표기하되 가능한 한 정확한 데이터를 넣어줘.

| 대분류 | 소분류 | 모델명 |
|--------|--------|--------|
| 데일리 | 입문화 | 젤 큐물러스 27 (GEL-CUMULUS 27) |
| 데일리 | 맥스쿠션화 | 젤 님버스 28 (GEL-NIMBUS 28) |
| 데일리 | 맥스쿠션화 | 글라이드라이드 맥스 2 (GLIDERIDE MAX 2) |
| 데일리 | 안정화 | 젤 카야노 32 (GEL-KAYANO 32) |
| 데일리 | 올라운더 | 노바블라스트 5 (NOVABLAST 5) |
| 데일리 | 경량트레이너 | 에보라이드 스피드 3 (EVORIDE SPEED 3) |
| 슈퍼트레이너 | 논플레이트 | 슈퍼블라스트 2 (SUPERBLAST 2) |
| 슈퍼트레이너 | 논플레이트 | 메가블라스트 (MEGABLAST) |
| 슈퍼트레이너 | 라이트플레이트 | 소닉블라스트 (SONICBLAST) |
| 슈퍼트레이너 | 카본플레이트 | 매직스피드 5 (MAGIC SPEED 5) |
| 레이싱 | 하프 | 메타스피드 레이 (METASPEED RAY) |
| 레이싱 | 풀 | 요기리 S4+ (YOGIRI S4+) |
| 레이싱 | 풀 | 메타스피드 스카이 도쿄 (METASPEED SKY TOKYO) |
| 레이싱 | 풀 | 메타스피드 엣지 도쿄 (METASPEED EDGE TOKYO) |

> ⚠️ **중요**: 각 모델의 세대(버전)가 현재(2026년) 기준 최신인지 반드시 확인해. 예를 들어 젤 님버스 28이 최신이면 27이 들어가면 안 됨. 불확실하면 웹 검색으로 확인할 것.

---

## 리뷰 데이터 참고 소스

러닝화의 장단점, 실착 평가, 전문 리뷰를 작성할 때 아래 **세계적으로 신뢰받는 러닝화 리뷰 사이트**를 우선 참고해. 각 모델별로 해당 사이트의 리뷰를 검색하여 장단점을 작성하고, 참고한 리뷰 URL을 `reviewSources` 필드에 기록해둬.

### 필수 참고 사이트 (우선순위 순)

| 사이트 | URL | 특징 |
|--------|-----|------|
| **RunRepeat** | https://runrepeat.com/ | 메타 리뷰 (수백 개 리뷰 종합 점수), 스펙 데이터 정확도 높음 |
| **Doctors of Running** | https://www.doctorsofrunning.com/ | 물리치료사/의사 기반 전문 바이오메카닉스 리뷰 |
| **Believe in the Run** | https://www.believeintherun.com/ | 실착 중심 영상+텍스트 리뷰, 러너 관점 솔직한 평가 |
| **Running Warehouse (Blog)** | https://www.runningwarehouse.com/learningcenter/ | 스펙 비교 데이터 풍부, 카테고리별 비교 리뷰 |
| **Road Trail Run** | https://www.roadtrailrun.com/ | 심층 멀티 테스터 리뷰, 로드/트레일 모두 커버 |
| **Solereview** | https://www.solereview.com/ | 러닝화 해부 수준의 상세 분석, 쿠셔닝/구조 깊이 있는 평가 |

### 리뷰 데이터 활용 규칙

1. **장단점 작성 시**: 위 사이트들에서 공통적으로 언급되는 장단점을 우선 반영. 한 사이트만의 의견이 아닌 **여러 소스의 교집합**을 기반으로 작성
2. **스펙 데이터 교차 검증**: 무게, 스택 높이 등 수치 데이터는 공식 사이트 + RunRepeat/Solereview 등에서 교차 확인
3. **정보 없는 경우**: 신제품이라 리뷰가 없거나 데이터를 찾을 수 없으면 무리하게 만들지 말고, 공식 스펙만 기재하고 장단점은 공식 설명 기반으로 작성. `reviewSources`는 빈 배열 `[]`로 둘 것
4. **한국 특화 의견 반영**: 가능하면 한국 러닝 커뮤니티(러닝포스트, 달리기 관련 네이버 카페 등)에서 언급되는 한국 러너 특화 의견도 참고 (e.g., 한국 도로 환경에서의 접지감, 발볼 핏 등)

---

## UI/UX 디자인 요구사항

### 디자인 철학

**"도파민 터지는 프리미엄 경험"** — 단순 카탈로그가 아니라, 러닝화를 탐색하는 것 자체가 즐거운 경험이 되어야 해.
레퍼런스: lusion.co, resn.co.nz, activetheory.net 수준의 인터랙션과 비주얼 퀄리티를 지향하되, **가독성과 정보 전달력은 절대 희생하지 않아.**

### 핵심 디자인 원칙

1. **몰입감 있는 첫 인상**: 히어로 섹션에 다이나믹한 애니메이션 (e.g., 스크롤 기반 패럴렉스, 텍스트 모션)
2. **스무스한 전환**: 페이지/카테고리 전환 시 Framer Motion 기반 부드러운 트랜지션
3. **마이크로 인터랙션**: 호버, 클릭, 스크롤 등에 반응하는 미세 애니메이션
4. **다크 모드 베이스**: 어두운 배경 + 네온/비비드 포인트 컬러로 고급스러움 연출
5. **타이포그래피**: 대담한 타이틀 + 깔끔한 본문. 한글/영문 혼용 시 조화롭게
6. **카드 UI**: 러닝화 카드에 호버 시 3D 틸트 효과 또는 글로우 효과

### 주요 페이지 & 기능

#### 1. 랜딩/히어로 페이지
- 임팩트 있는 히어로 애니메이션
- 카테고리 3개(데일리/슈퍼트레이너/레이싱)를 시각적으로 매력 있게 네비게이션
- 스크롤 유도 인터랙션

#### 2. 카테고리 페이지
- 서브카테고리 탭/필터
- 러닝화 카드 그리드 (이미지 + 모델명 + 한 줄 요약 + 가격)
- 카드 호버 시 인터랙티브 효과

#### 3. 러닝화 상세 페이지
- 큰 제품 이미지
- 스펙 정보를 **시각적으로** 표현 (바 차트, 게이지 등으로 무게/스택/드랍 비교)
- 장단점을 건조하지 않고 위트 있는 문체로 표현
- 같은 서브카테고리 내 다른 모델과 간단 비교 섹션

#### 4. 🎯 러닝화 추천 퀴즈 (핵심 차별 기능)
- 5~7개의 간단한 질문을 통해 사용자에게 맞는 러닝화 추천
- 질문 예시:
  - "주로 어떤 페이스로 달리나요?" (이지런 / 템포런 / 인터벌 / 대회)
  - "주간 러닝 거리는?" (30km 미만 / 30~60km / 60km 이상)
  - "발 유형은?" (정상 아치 / 평발(오버프로네이션) / 높은 아치)
  - "가장 중요하게 생각하는 것은?" (쿠셔닝 / 가벼운 무게 / 반발력 / 안정성)
  - "목표 대회 거리는?" (10K 이하 / 하프 / 풀 / 대회 안 뜀)
- 결과를 **1순위 추천 + 대안 2개** 형태로 카드 애니메이션과 함께 공개
- 결과 페이지도 재미있게 (e.g., "당신은 스피드를 갈망하는 러너! 🔥")

#### 5. 비교 기능 (선택)
- 2~3개 러닝화를 나란히 비교하는 테이블/카드 뷰

---

## 코드 아키텍처 요구사항

### 디렉토리 구조 (권장)

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 랜딩 페이지
│   ├── brand/[brandId]/          # 브랜드별 페이지
│   ├── shoe/[shoeId]/            # 상세 페이지
│   └── quiz/                     # 추천 퀴즈
├── components/
│   ├── common/                   # 공통 컴포넌트 (Button, Card, Badge 등)
│   ├── layout/                   # Header, Footer, Navigation
│   ├── shoe/                     # 러닝화 관련 컴포넌트
│   │   ├── ShoeCard.tsx
│   │   ├── ShoeDetail.tsx
│   │   ├── ShoeSpecChart.tsx
│   │   └── ShoeComparison.tsx
│   ├── quiz/                     # 추천 퀴즈 컴포넌트
│   └── hero/                     # 히어로/랜딩 컴포넌트
├── data/
│   ├── brands/
│   │   ├── asics.json            # 브랜드별 데이터 파일
│   │   ├── nike.json             # (향후 추가)
│   │   └── ...
│   ├── categories.ts             # 카테고리 정의 (모든 브랜드 공통)
│   └── quiz-questions.ts         # 퀴즈 질문 데이터
├── types/
│   ├── shoe.ts                   # RunningShoe, Brand, Category 등 타입
│   └── quiz.ts                   # 퀴즈 관련 타입
├── utils/
│   ├── shoe-utils.ts             # 필터링, 정렬, 검색 유틸
│   └── quiz-logic.ts             # 추천 알고리즘
├── hooks/                        # 커스텀 훅
└── styles/                       # 글로벌 스타일, 애니메이션 정의
```

### 핵심 설계 원칙

1. **브랜드 확장성**: 새 브랜드 추가 시 JSON 파일 하나만 추가하면 자동으로 앱에 반영되는 구조
2. **카테고리 공통화**: 카테고리/서브카테고리 구조는 모든 브랜드가 동일하게 공유
3. **컴포넌트 재사용**: `ShoeCard`, `ShoeDetail` 등은 브랜드에 무관하게 동작
4. **타입 안전성**: 모든 데이터에 TypeScript 타입 적용, `as any` 사용 금지
5. **데이터/뷰 분리**: 데이터 로직과 UI 렌더링을 명확히 분리

---

## 문체 & 톤

- 러닝화 설명은 **건조한 스펙 나열이 아니라**, 실제 러너가 친구에게 추천하듯 생동감 있게
- 장점/단점은 위트 있되 정보는 정확하게
- 예시:
  - ❌ "쿠셔닝이 우수합니다"
  - ✅ "30km 장거리에서도 발이 안 죽어요. 구름 위 달리기 그 자체 ☁️"
  - ❌ "무거운 편입니다"
  - ✅ "무게? 솔직히 좀 있어요. 하지만 이 쿠셔닝을 위해 기꺼이 감수할 수 있는 수준"

---

## 작업 순서

1. 프로젝트 초기 세팅 (Next.js + TypeScript + Tailwind + Framer Motion)
2. 타입 정의 및 데이터 구조 설계
3. Asics 러닝화 데이터 JSON 작성 (웹 검색 + 리뷰 사이트 참고로 최신 스펙 및 장단점 확인)
4. 공통 컴포넌트 개발 (ShoeCard, Navigation 등)
5. 랜딩 페이지 + 히어로 애니메이션
6. 카테고리/상세 페이지
7. 추천 퀴즈 기능
8. 전체 인터랙션 및 애니메이션 폴리싱
9. 반응형 대응 (모바일/태블릿)
10. `npm run build`로 빌드 에러 없는지 최종 확인
11. GitHub 저장소(https://github.com/kimsain/runpick)에 commit & push

---

## 최종 체크리스트

- [ ] 모든 러닝화 데이터가 2025~2026 최신 버전인지 확인
- [ ] 새 브랜드 JSON 추가만으로 확장 가능한 구조인지 확인
- [ ] 다크 모드에서 가독성 확보
- [ ] 모바일 반응형 정상 동작
- [ ] 애니메이션이 성능 저하 없이 60fps 유지
- [ ] 추천 퀴즈 로직이 합리적으로 동작
- [ ] 장단점이 리뷰 사이트 교차 검증을 기반으로 작성되었는지 확인
- [ ] `npm run build` 에러 없이 성공
- [ ] GitHub 저장소에 push 완료
