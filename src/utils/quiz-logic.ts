import { QuizAnswer, QuizResult, ScoringCategory } from '@/types/quiz';
import { RunningShoe } from '@/types/shoe';
import { quizQuestions } from '@/data/quiz-questions';
import { getAllShoes } from './shoe-utils';

type UserScores = Partial<Record<ScoringCategory, number>>;

interface ShoeMatchResult {
  shoe: RunningShoe;
  score: number;
  matchReasons: string[];
}

export function calculateQuizResult(answers: QuizAnswer[]): QuizResult {
  // 1. Aggregate user scores from answers
  const userScores: UserScores = {};
  answers.forEach((answer) => {
    const question = quizQuestions.find((q) => q.id === answer.questionId);
    if (!question) return;
    const option = question.options.find((o) => o.id === answer.selectedOptionId);
    if (!option) return;
    Object.entries(option.scores).forEach(([cat, score]) => {
      const key = cat as ScoringCategory;
      userScores[key] = (userScores[key] || 0) + (score || 0);
    });
  });

  // 2. Score each shoe
  const shoes = getAllShoes();
  const results: ShoeMatchResult[] = shoes.map((shoe) => calculateShoeMatch(shoe, userScores));
  results.sort((a, b) => b.score - a.score);

  // 3. Calculate match percentage (clamp 60-98)
  const maxScore = results[0]?.score || 1;
  const theoreticalMax = calculateTheoreticalMax(userScores);
  const rawPercent = (maxScore / theoreticalMax) * 100;
  const matchScore = Math.round(Math.min(98, Math.max(60, rawPercent)));

  // 4. Build alternatives with reasons
  const primary = results[0];
  const alts = results.slice(1, 4).map((r) => ({
    shoe: r.shoe,
    reason: generateAlternativeReason(r, primary),
  }));

  return {
    primaryRecommendation: primary.shoe,
    alternatives: alts,
    matchScore,
    matchReasons: primary.matchReasons,
    userProfile: Object.fromEntries(
      Object.entries(userScores).map(([k, v]) => [k, v || 0])
    ),
    reasoning: generateReasoning(primary, userScores),
  };
}

function calculateShoeMatch(shoe: RunningShoe, pref: UserScores): ShoeMatchResult {
  // A. Attribute matching (40%) — use actual specs from asics.json
  const attrScore =
    (pref.cushioning || 0) * (shoe.specs.cushioning / 10) +
    (pref.responsiveness || 0) * (shoe.specs.responsiveness / 10) +
    (pref.stability || 0) * (shoe.specs.stability / 10) +
    (pref.lightweight || 0) * ((350 - shoe.specs.weight) / 350);

  // B. Category matching (40%) — match user category preference to shoe category
  const catScore = (pref[shoe.categoryId as ScoringCategory] || 0) * 2; // amplify category signal

  // C. Experience bonus (20%) — racing carbon shoes need high racing pref
  const expScore = calculateExperienceMatch(shoe, pref);

  const totalScore = 0.4 * attrScore + 0.4 * catScore + 0.2 * expScore;
  const matchReasons = generateMatchReasons(shoe, pref);

  return { shoe, score: totalScore, matchReasons };
}

function calculateExperienceMatch(shoe: RunningShoe, pref: UserScores): number {
  const hasCarbon = shoe.technologies.some(
    (t) => t.includes('카본') || t.toUpperCase().includes('CARBON')
  );

  if (shoe.categoryId === 'racing' && hasCarbon) {
    if ((pref.racing || 0) >= 4) {
      return (pref.racing || 0) * 1.5;
    }
    return -2; // discourage carbon for beginners
  }

  if (shoe.categoryId === 'daily') {
    return 2; // universally suitable baseline bonus
  }

  if (shoe.categoryId === 'super-trainer') {
    return (pref['super-trainer'] || 0) * 0.8;
  }

  return 0;
}

function calculateTheoreticalMax(pref: UserScores): number {
  // Simulate perfect shoe: max specs (10/10), weight 129g, matching category
  const perfectAttr =
    (pref.cushioning || 0) * 1 +
    (pref.responsiveness || 0) * 1 +
    (pref.stability || 0) * 1 +
    (pref.lightweight || 0) * ((350 - 129) / 350);

  // Max category score: highest category pref * 2
  const catValues = [
    pref.daily || 0,
    pref['super-trainer'] || 0,
    pref.racing || 0,
  ];
  const perfectCat = Math.max(...catValues) * 2;

  // Max experience bonus
  const perfectExp = Math.max(
    (pref.racing || 0) * 1.5, // racing carbon bonus
    2, // daily baseline
    (pref['super-trainer'] || 0) * 0.8
  );

  const max = 0.4 * perfectAttr + 0.4 * perfectCat + 0.2 * perfectExp;
  return max > 0 ? max : 1; // prevent division by zero
}

function generateMatchReasons(shoe: RunningShoe, pref: UserScores): string[] {
  const reasons: string[] = [];

  if (shoe.specs.cushioning >= 7 && (pref.cushioning || 0) > 0) {
    reasons.push(`쿠셔닝 ${shoe.specs.cushioning}/10 — 편안한 착화감`);
  }
  if (shoe.specs.responsiveness >= 7 && (pref.responsiveness || 0) > 0) {
    reasons.push(`반발력 ${shoe.specs.responsiveness}/10 — 에너지 리턴 우수`);
  }
  if (shoe.specs.stability >= 7 && (pref.stability || 0) > 0) {
    reasons.push(`안정성 ${shoe.specs.stability}/10 — 안정적인 착지 지원`);
  }
  if (shoe.specs.weight < 220 && (pref.lightweight || 0) > 0) {
    reasons.push(`무게 ${shoe.specs.weight}g — 초경량 레이싱`);
  }
  if (shoe.categoryId === 'daily' && (pref.daily || 0) > 0) {
    reasons.push('데일리 러닝 최적');
  }
  if (shoe.categoryId === 'super-trainer' && (pref['super-trainer'] || 0) > 0) {
    reasons.push('슈퍼 트레이너 성능');
  }
  if (shoe.categoryId === 'racing' && (pref.racing || 0) > 0) {
    reasons.push('레이스 최적화');
  }

  return reasons.slice(0, 3);
}

function generateAlternativeReason(alt: ShoeMatchResult, primary: ShoeMatchResult): string {
  const altShoe = alt.shoe;
  const priShoe = primary.shoe;

  if (altShoe.specs.responsiveness > priShoe.specs.responsiveness) {
    return `${altShoe.name} — 더 높은 반발력(${altShoe.specs.responsiveness}/10)을 원한다면`;
  }
  if (altShoe.specs.cushioning > priShoe.specs.cushioning) {
    return `${altShoe.name} — 더 푹신한 쿠셔닝(${altShoe.specs.cushioning}/10)을 원한다면`;
  }
  if (altShoe.specs.weight < priShoe.specs.weight) {
    return `${altShoe.name} — 더 가벼운 무게(${altShoe.specs.weight}g)를 원한다면`;
  }
  if (altShoe.specs.stability > priShoe.specs.stability) {
    return `${altShoe.name} — 더 안정적인 착지감(${altShoe.specs.stability}/10)을 원한다면`;
  }
  return `${altShoe.name} — 다른 스타일의 러닝에 좋은 선택`;
}

function generateReasoning(
  result: ShoeMatchResult,
  userScores: UserScores
): string {
  const { shoe, matchReasons } = result;

  const categoryNames: Record<ScoringCategory, string> = {
    cushioning: '쿠셔닝',
    lightweight: '가벼운 무게',
    responsiveness: '반발력',
    stability: '안정성',
    racing: '레이싱',
    daily: '데일리 러닝',
    'super-trainer': '슈퍼 트레이닝',
  };

  const topCategories = Object.entries(userScores)
    .sort(([, a], [, b]) => (b || 0) - (a || 0))
    .slice(0, 3)
    .map(([cat]) => cat as ScoringCategory);

  const priorityText = topCategories
    .map((cat) => categoryNames[cat])
    .filter(Boolean)
    .join(', ');

  let reasoning = `${priorityText}을(를) 중시하시는 것으로 분석되었습니다. `;
  reasoning += `${shoe.name}은(는) ${shoe.shortDescription}으로, `;

  if (matchReasons.length > 0) {
    reasoning += `${matchReasons.slice(0, 2).join(', ')} 등의 특징이 `;
    reasoning += '회원님의 러닝 스타일과 잘 맞습니다.';
  } else {
    reasoning += '회원님의 러닝 스타일에 균형 잡힌 선택입니다.';
  }

  return reasoning;
}
