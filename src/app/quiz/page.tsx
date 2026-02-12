'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import QuizProgress from '@/components/quiz/QuizProgress';
import QuizQuestionComponent from '@/components/quiz/QuizQuestion';
import QuizResult from '@/components/quiz/QuizResult';
import Button from '@/components/common/Button';
import TextReveal from '@/components/effects/TextReveal';
import FloatingShapes from '@/components/effects/FloatingShapes';
import { quizQuestions } from '@/data/quiz-questions';
import { QuizAnswer, QuizResult as QuizResultType } from '@/types/quiz';
import { calculateQuizResult } from '@/utils/quiz-logic';

type QuizPhase = 'quiz' | 'analyzing' | 'result';

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState<QuizResultType | null>(null);
  const [phase, setPhase] = useState<QuizPhase>('quiz');
  const [analysisStep, setAnalysisStep] = useState(0);

  const currentQuestion = quizQuestions[currentIndex];
  const isLastQuestion = currentIndex === quizQuestions.length - 1;

  const handleSelectOption = useCallback((optionId: string) => {
    setSelectedOption(optionId);
  }, []);

  const handleAutoAdvance = useCallback((optionId: string) => {
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedOptionId: optionId,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (isLastQuestion) {
      // Start analysis animation
      setPhase('analyzing');
      setAnalysisStep(0);

      // Phase text changes
      setTimeout(() => setAnalysisStep(1), 300);
      setTimeout(() => setAnalysisStep(2), 600);

      // Calculate and show result
      setTimeout(() => {
        const quizResult = calculateQuizResult(updatedAnswers);
        setResult(quizResult);
        setPhase('result');
      }, 900);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    }
  }, [currentQuestion, answers, isLastQuestion]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      const prevAnswer = answers[currentIndex - 1];
      setCurrentIndex((prev) => prev - 1);
      setSelectedOption(prevAnswer?.selectedOptionId || null);
      setAnswers((prev) => prev.slice(0, -1));
    }
  }, [currentIndex, answers]);

  const handleRetry = useCallback(() => {
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedOption(null);
    setResult(null);
    setPhase('quiz');
    setAnalysisStep(0);
  }, []);

  const analysisTexts = [
    '답변 분석 중...',
    '러닝 프로필 생성 중...',
    '최적 러닝화 매칭 중...',
  ];

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-gradient-to-b from-[var(--color-background)] to-[var(--color-card)] relative overflow-hidden">
        <FloatingShapes count={4} />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <AnimatePresence mode="wait">
            {phase === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <TextReveal as="h1" mode="clip" className="text-3xl font-bold text-gradient mb-2">
                    러닝화 추천 퀴즈
                  </TextReveal>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-[var(--color-foreground)]/60"
                  >
                    5가지 질문으로 딱 맞는 러닝화를 찾아드려요
                  </motion.p>
                </div>

                {/* Progress */}
                <QuizProgress current={currentIndex} total={quizQuestions.length} />

                {/* Question card */}
                <div className="bg-[var(--color-card)] rounded-3xl p-6 sm:p-8 border border-[var(--color-border)]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <QuizQuestionComponent
                        question={currentQuestion}
                        selectedOption={selectedOption}
                        onSelectOption={handleSelectOption}
                        onAutoAdvance={handleAutoAdvance}
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Back button only (no "Next" button) */}
                  {currentIndex > 0 && (
                    <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
                      <Button variant="ghost" onClick={handlePrev}>
                        ← 이전
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {phase === 'analyzing' && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[400px]"
              >
                {/* Spinning loader */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-asics-accent)] mb-8"
                />

                {/* Analysis text */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={analysisStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-lg text-[var(--color-foreground)]/80 mb-6"
                  >
                    {analysisTexts[analysisStep]}
                  </motion.p>
                </AnimatePresence>

                {/* Progress bar */}
                <div className="w-64 h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="h-full bg-gradient-to-r from-[var(--color-asics-blue)] to-[var(--color-asics-accent)] rounded-full"
                  />
                </div>
              </motion.div>
            )}

            {phase === 'result' && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <QuizResult result={result} onRetry={handleRetry} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
