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

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [result, setResult] = useState<QuizResultType | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = quizQuestions[currentIndex];
  const isLastQuestion = currentIndex === quizQuestions.length - 1;

  const handleSelectOption = useCallback((optionId: string) => {
    setSelectedOptions((prev) => {
      if (currentQuestion.multiSelect) {
        return prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId];
      }
      return [optionId];
    });
  }, [currentQuestion.multiSelect]);

  const handleNext = useCallback(() => {
    if (selectedOptions.length === 0) return;

    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedOptionIds: selectedOptions,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (isLastQuestion) {
      // Calculate result
      const quizResult = calculateQuizResult(updatedAnswers);
      setResult(quizResult);
      setIsComplete(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptions([]);
    }
  }, [selectedOptions, currentQuestion, answers, isLastQuestion]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      const prevAnswer = answers[currentIndex - 1];
      setSelectedOptions(prevAnswer?.selectedOptionIds || []);
      setAnswers((prev) => prev.slice(0, -1));
    }
  }, [currentIndex, answers]);

  const handleRetry = useCallback(() => {
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedOptions([]);
    setResult(null);
    setIsComplete(false);
  }, []);

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-gradient-to-b from-[var(--color-background)] to-[var(--color-card)] relative overflow-hidden">
        {/* Floating shapes background */}
        <FloatingShapes count={4} />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <AnimatePresence mode="wait">
            {!isComplete ? (
              <motion.div
                key="quiz"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <TextReveal
                    as="h1"
                    mode="clip"
                    className="text-3xl font-bold text-gradient mb-2"
                  >
                    러닝화 추천 퀴즈
                  </TextReveal>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-[var(--color-foreground)]/60"
                  >
                    몇 가지 질문에 답하면 딱 맞는 러닝화를 찾아드려요
                  </motion.p>
                </div>

                {/* Progress */}
                <QuizProgress
                  current={currentIndex}
                  total={quizQuestions.length}
                />

                {/* Question with clipPath reveal */}
                <div className="bg-[var(--color-card)] rounded-3xl p-6 sm:p-8 border border-[var(--color-border)]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
                      animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
                      exit={{ clipPath: 'inset(0 0 0 100%)', opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                    >
                      <QuizQuestionComponent
                        question={currentQuestion}
                        selectedOptions={selectedOptions}
                        onSelectOption={handleSelectOption}
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--color-border)]">
                    <Button
                      variant="ghost"
                      onClick={handlePrev}
                      disabled={currentIndex === 0}
                      className={currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      ← 이전
                    </Button>

                    <Button
                      onClick={handleNext}
                      disabled={selectedOptions.length === 0}
                      className={
                        selectedOptions.length === 0
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }
                    >
                      {isLastQuestion ? '결과 보기' : '다음 →'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <QuizResult result={result} onRetry={handleRetry} />
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
