import { RunningShoe } from './shoe';

export type QuestionId =
  | 'running-pace'
  | 'weekly-distance'
  | 'foot-type'
  | 'priority'
  | 'race-distance'
  | 'weight-category'
  | 'strike-pattern';

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
  multiSelect?: boolean;
}

export type ScoringCategory =
  | 'cushioning'
  | 'lightweight'
  | 'responsiveness'
  | 'stability'
  | 'racing'
  | 'daily'
  | 'super-trainer'
  | 'beginner'
  | 'advanced';

export interface QuizAnswer {
  questionId: QuestionId;
  selectedOptionIds: string[];
}

export interface QuizResult {
  primaryRecommendation: RunningShoe;
  alternatives: RunningShoe[];
  scores: Record<string, number>;
  reasoning: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  isComplete: boolean;
  result: QuizResult | null;
}
