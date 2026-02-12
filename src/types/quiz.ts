import { RunningShoe } from './shoe';

export type QuestionId =
  | 'running-purpose'
  | 'weekly-distance'
  | 'priority'
  | 'race-distance'
  | 'body-style';

export interface QuizOption {
  id: string;
  label: string;
  labelKo: string;
  description?: string;
  icon?: string;
  scores: Partial<Record<ScoringCategory, number>>;
}

export interface QuizQuestion {
  id: QuestionId;
  question: string;
  questionKo: string;
  description?: string;
  options: QuizOption[];
}

export type ScoringCategory =
  | 'cushioning'
  | 'lightweight'
  | 'responsiveness'
  | 'stability'
  | 'racing'
  | 'daily'
  | 'super-trainer';

export interface QuizAnswer {
  questionId: QuestionId;
  selectedOptionId: string; // Changed from selectedOptionIds array (single select only)
}

export interface QuizResult {
  primaryRecommendation: RunningShoe;
  alternatives: Array<{ shoe: RunningShoe; reason: string }>;
  matchScore: number; // 0-100
  matchReasons: string[];
  userProfile: Record<string, number>;
  reasoning: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  isComplete: boolean;
  result: QuizResult | null;
}
