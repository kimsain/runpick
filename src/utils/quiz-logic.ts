import { QuizAnswer, QuizResult, ScoringCategory } from '@/types/quiz';
import { RunningShoe } from '@/types/shoe';
import { quizQuestions } from '@/data/quiz-questions';
import { getAllShoes } from './shoe-utils';

interface ShoeScore {
  shoe: RunningShoe;
  score: number;
  matchReasons: string[];
}

const shoeTraits: Record<string, Partial<Record<ScoringCategory, number>>> = {
  'gel-cumulus-27': { cushioning: 7, daily: 10, beginner: 10, stability: 6 },
  'gel-nimbus-28': { cushioning: 10, daily: 8, beginner: 8 },
  'glideride-max-2': { cushioning: 9, daily: 7, stability: 7 },
  'gel-kayano-32': { cushioning: 8, stability: 10, daily: 8, beginner: 7 },
  'novablast-5': { responsiveness: 8, daily: 9, 'super-trainer': 5 },
  'evoride-speed-3': { lightweight: 8, responsiveness: 7, daily: 6 },
  'superblast-2': { responsiveness: 10, 'super-trainer': 10, cushioning: 9 },
  megablast: { responsiveness: 9, 'super-trainer': 9, cushioning: 10, stability: 7 },
  sonicblast: { responsiveness: 9, 'super-trainer': 8, lightweight: 7 },
  'magic-speed-5': { responsiveness: 10, 'super-trainer': 8, racing: 6, lightweight: 8 },
  'metaspeed-ray': { racing: 9, lightweight: 10, responsiveness: 10, advanced: 9 },
  'yogiri-s4-plus': { racing: 10, responsiveness: 10, advanced: 10, cushioning: 7 },
  'metaspeed-sky-tokyo': { racing: 10, responsiveness: 10, advanced: 10, cushioning: 8 },
  'metaspeed-edge-tokyo': { racing: 10, lightweight: 9, responsiveness: 10, advanced: 10 },
};

export function calculateQuizResult(answers: QuizAnswer[]): QuizResult {
  const userScores: Partial<Record<ScoringCategory, number>> = {};

  // 사용자 응답 기반 점수 계산
  answers.forEach((answer) => {
    const question = quizQuestions.find((q) => q.id === answer.questionId);
    if (!question) return;

    answer.selectedOptionIds.forEach((optionId) => {
      const option = question.options.find((o) => o.id === optionId);
      if (!option) return;

      Object.entries(option.scores).forEach(([category, score]) => {
        const cat = category as ScoringCategory;
        userScores[cat] = (userScores[cat] || 0) + (score || 0);
      });
    });
  });

  // 각 러닝화별 매칭 점수 계산
  const shoes = getAllShoes();
  const shoeScores: ShoeScore[] = shoes.map((shoe) => {
    const traits = shoeTraits[shoe.id] || {};
    let score = 0;
    const matchReasons: string[] = [];

    Object.entries(userScores).forEach(([category, userScore]) => {
      const cat = category as ScoringCategory;
      const shoeScore = traits[cat] || 0;
      const contribution = (userScore || 0) * shoeScore;
      score += contribution;

      if (contribution > 10) {
        matchReasons.push(getMatchReason(cat, shoeScore));
      }
    });

    return { shoe, score, matchReasons };
  });

  // 점수순 정렬
  shoeScores.sort((a, b) => b.score - a.score);

  const primary = shoeScores[0];
  const alternatives = shoeScores.slice(1, 3);

  return {
    primaryRecommendation: primary.shoe,
    alternatives: alternatives.map((a) => a.shoe),
    scores: Object.fromEntries(
      Object.entries(userScores).map(([k, v]) => [k, v || 0])
    ),
    reasoning: generateReasoning(primary, userScores),
  };
}

function getMatchReason(category: ScoringCategory, _score: number): string {
  const reasons: Record<ScoringCategory, string> = {
    cushioning: '뛰어난 쿠셔닝',
    lightweight: '가벼운 무게',
    responsiveness: '탁월한 반발력',
    stability: '우수한 안정성',
    racing: '레이스 최적화',
    daily: '데일리 트레이닝에 적합',
    'super-trainer': '슈퍼 트레이너 성능',
    beginner: '입문자 친화적',
    advanced: '숙련 러너용',
  };
  return reasons[category] || category;
}

function generateReasoning(
  result: ShoeScore,
  userScores: Partial<Record<ScoringCategory, number>>
): string {
  const { shoe, matchReasons } = result;

  const topCategories = Object.entries(userScores)
    .sort(([, a], [, b]) => (b || 0) - (a || 0))
    .slice(0, 3)
    .map(([cat]) => cat as ScoringCategory);

  const categoryNames: Record<ScoringCategory, string> = {
    cushioning: '쿠셔닝',
    lightweight: '가벼운 무게',
    responsiveness: '반발력',
    stability: '안정성',
    racing: '레이싱',
    daily: '데일리 러닝',
    'super-trainer': '슈퍼 트레이닝',
    beginner: '입문자',
    advanced: '숙련 러너',
  };

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
