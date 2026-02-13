---
name: quiz-system
description: Use when modifying quiz questions, scoring logic, or result display. Covers the full quiz pipeline from questions to recommendation.
---

# Quiz System

## Architecture

```
quiz-questions.ts (5 questions)
    -> QuizQuestion component (single-select, auto-advance 0.5s)
    -> quiz-logic.ts (spec-based scoring)
    -> QuizResult component (animated circular progress)
```

## Key Files

- `src/data/quiz-questions.ts` — Question definitions with scoring weights
- `src/utils/quiz-logic.ts` — Matching algorithm
- `src/types/quiz.ts` — QuizAnswer (single-select), QuizResult, ScoringCategory
- `src/components/quiz/QuizQuestion.tsx` — Question UI with auto-advance
- `src/components/quiz/QuizResult.tsx` — Result display
- `src/app/quiz/page.tsx` — Quiz page (full client component)

## Scoring Algorithm (quiz-logic.ts)

Three components, weighted:
- **40% Attribute match**: cushioning, responsiveness, stability from `shoe.specs`; lightweight = `(350 - weight) / 350`
- **40% Category match**: user category preference vs `shoe.categoryId`, amplified x2
- **20% Experience bonus**: carbon racing shoes get bonus (racing pref >= 4) or penalty (-2); daily gets +2 baseline; super-trainer gets pref * 0.8

Match score: raw percentage of theoretical max, clamped to **60-98%**.

## ScoringCategory Values

`cushioning | lightweight | responsiveness | stability | racing | daily | super-trainer`

Each quiz option assigns partial scores to these categories. The algorithm uses actual shoe specs from asics.json directly — no manual `shoeTraits` mapping.

## UX Flow

1. 5 questions, single-select only (`selectedOptionId: string`, not array)
2. On option click: select -> 0.5s delay -> auto-advance to next question
3. Changing selection resets the timer
4. Result: primary recommendation + 3 alternatives with comparison reasons
5. Match score displayed as animated circular progress (60-98% range)

## Adding a New Question

1. Add `QuestionId` to `src/types/quiz.ts`
2. Add question object to `quizQuestions` array in `quiz-questions.ts`
3. Each option needs `scores: Partial<Record<ScoringCategory, number>>`
4. Scoring weights should be proportional to existing questions (1-5 range typical)
