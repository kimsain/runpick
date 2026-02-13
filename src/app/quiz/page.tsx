'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import QuizProgress from '@/components/quiz/QuizProgress';
import QuizQuestionComponent from '@/components/quiz/QuizQuestion';
import QuizResult from '@/components/quiz/QuizResult';
import Button from '@/components/common/Button';
import TextReveal from '@/components/effects/TextReveal';
import { quizQuestions } from '@/data/quiz-questions';
import { QuizAnswer, QuizResult as QuizResultType } from '@/types/quiz';
import { calculateQuizResult } from '@/utils/quiz-logic';
import { getAllBrands } from '@/utils/shoe-utils';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { useInteractionCapabilities } from '@/hooks/useInteractionCapabilities';

type QuizPhase = 'brand-select' | 'quiz' | 'analyzing' | 'result';

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState<QuizResultType | null>(null);
  const [phase, setPhase] = useState<QuizPhase>('brand-select');
  const [preferredBrandId, setPreferredBrandId] = useState<string>('all');
  const [analysisStep, setAnalysisStep] = useState(0);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const quizCardRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const { hasMotionBudget } = useInteractionCapabilities();
  const animateEnabled = !useReducedMotion() && hasMotionBudget;
  const brands = useMemo(() => getAllBrands(), []);

  const currentQuestion = quizQuestions[currentIndex];
  const isLastQuestion = currentIndex === quizQuestions.length - 1;

  const handleSelectOption = useCallback((optionId: string) => {
    setSelectedOption(optionId);
  }, []);

  const handleNext = useCallback(() => {
    if (!selectedOption) return;

    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedOptionId: selectedOption,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (isLastQuestion) {
      // Start analysis animation
      setPhase('analyzing');
      setAnalysisStep(0);

      timersRef.current.forEach((timerId) => clearTimeout(timerId));
      timersRef.current = [];

      // Phase text changes
      timersRef.current.push(setTimeout(() => setAnalysisStep(1), 300));
      timersRef.current.push(setTimeout(() => setAnalysisStep(2), 600));

      // Calculate and show result
      timersRef.current.push(setTimeout(() => {
        const quizResult = calculateQuizResult(updatedAnswers, {
          preferredBrandId: preferredBrandId === 'all' ? undefined : preferredBrandId,
        });
        setResult(quizResult);
        setPhase('result');
      }, 900));
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    }
  }, [currentQuestion, selectedOption, answers, isLastQuestion, preferredBrandId]);

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

  const handleResetBrand = useCallback(() => {
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedOption(null);
    setResult(null);
    setAnalysisStep(0);
    setPhase('brand-select');
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem('runpick.preferredBrand');
    if (stored && brands.some((brand) => brand.id === stored)) {
      setPreferredBrandId(stored);
    }
  }, [brands]);

  useEffect(() => {
    if (preferredBrandId !== 'all') {
      window.localStorage.setItem('runpick.preferredBrand', preferredBrandId);
    }
  }, [preferredBrandId]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  useEffect(() => {
    if (phase !== 'quiz') return;

    const frame = window.requestAnimationFrame(() => {
      const top = quizCardRef.current?.getBoundingClientRect().top;
      if (typeof top !== 'number') return;

      const headerBottom = document.getElementById('site-header')?.getBoundingClientRect().bottom ?? 0;
      const offset = Math.max(0, Math.ceil(headerBottom)) + (isDesktop ? 32 : 24);
      const targetY = window.scrollY + top - offset;
      window.scrollTo({ top: Math.max(targetY, 0), behavior: 'smooth' });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [phase, currentIndex, isDesktop]);

  const analysisTexts = [
    '답변 분석 중...',
    '러닝 프로필 생성 중...',
    preferredBrandId === 'all'
      ? '최적 러닝화 매칭 중...'
      : `${preferredBrandId.toUpperCase()} 우선 매칭 중...`,
  ];

  return (
    <>
      <Header />
      <main id="main-content" className={`pt-20 min-h-screen bg-gradient-to-b from-[var(--color-background)] to-[var(--color-card)] relative overflow-hidden ${phase === 'quiz' ? 'pb-[calc(6rem+env(safe-area-inset-bottom))] sm:pb-0' : ''}`}>
        <div className="relative layout-shell max-w-3xl py-8 sm:py-12">
          <AnimatePresence mode="wait">
            {phase === 'brand-select' && (
              <motion.div
                key="brand-select"
                initial={animateEnabled ? { opacity: 0 } : false}
                animate={animateEnabled ? { opacity: 1 } : undefined}
                exit={animateEnabled ? { opacity: 0 } : undefined}
              >
                <div className="text-center mb-8">
                  <TextReveal
                    as="h1"
                    mode="clip"
                    className="type-h2 text-gradient mb-2 text-balance"
                  >
                    러닝화 추천 퀴즈
                  </TextReveal>
                  <p className="type-body text-[var(--color-foreground)]/62 text-pretty reading-measure">
                    먼저 선호 브랜드를 선택하세요. 전체 선택 시 브랜드 상관없이 추천합니다.
                  </p>
                </div>

                <div className="bg-[var(--color-card)] rounded-3xl p-6 sm:p-8 border border-[var(--color-border)]">
                  <h2 className="type-h2 text-[var(--color-foreground)] mb-6 text-balance">
                    어떤 브랜드를 우선 추천할까요?
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <button
                      onClick={() => setPreferredBrandId('all')}
                      className={`rounded-2xl border p-4 text-left transition-all ${
                        preferredBrandId === 'all'
                          ? 'border-[var(--color-asics-accent)] bg-[var(--color-asics-accent)]/10'
                          : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
                      }`}
                    >
                      <p className="type-body font-semibold text-[var(--color-foreground)]">전체 브랜드</p>
                      <p className="mt-1 type-body text-[var(--color-foreground)]/60">
                        ASICS, NIKE, ADIDAS 전체에서 최적 추천
                      </p>
                    </button>

                    {brands.map((brand) => {
                      const active = preferredBrandId === brand.id;
                      return (
                        <button
                          key={brand.id}
                          onClick={() => setPreferredBrandId(brand.id)}
                          className={`rounded-2xl border p-4 text-left transition-all ${
                            active
                              ? 'border-[var(--color-asics-accent)] bg-[var(--color-asics-accent)]/10'
                              : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-block h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: brand.color }}
                            />
                            <p className="type-body font-semibold text-[var(--color-foreground)]">{brand.name}</p>
                          </div>
                          <p className="mt-1 type-body text-[var(--color-foreground)]/60">
                            {brand.nameKo} 모델 우선 추천
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
                    <Button onClick={() => setPhase('quiz')} size="lg">
                      질문 시작하기 →
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {phase === 'quiz' && (
              <motion.div
                key="quiz"
                initial={animateEnabled ? { opacity: 0 } : false}
                animate={animateEnabled ? { opacity: 1 } : undefined}
                exit={animateEnabled ? { opacity: 0 } : undefined}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <TextReveal as="h1" mode="clip" className="type-h2 text-gradient mb-2 text-balance">
                    러닝화 추천 퀴즈
                  </TextReveal>
                  <motion.p
                    initial={animateEnabled ? { opacity: 0, y: 10 } : false}
                    animate={animateEnabled ? { opacity: 1, y: 0 } : undefined}
                    transition={animateEnabled ? { delay: 0.3 } : undefined}
                    className="type-body text-[var(--color-foreground)]/62 text-pretty"
                  >
                    5가지 질문으로 딱 맞는 러닝화를 찾아드려요
                  </motion.p>
                  <p className="mt-2 type-caption text-[var(--color-foreground)]/45">
                    선호 브랜드: {preferredBrandId === 'all' ? '전체' : preferredBrandId.toUpperCase()}
                  </p>
                </div>

                {/* Progress */}
                <QuizProgress current={currentIndex} total={quizQuestions.length} />

                {/* Question card */}
                <div
                  ref={quizCardRef}
                  className="bg-[var(--color-card)] rounded-3xl p-6 sm:p-8 border border-[var(--color-border)]"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={animateEnabled ? { opacity: 0, y: 30 } : false}
                      animate={animateEnabled ? { opacity: 1, y: 0 } : undefined}
                      exit={animateEnabled ? { opacity: 0, y: -30 } : undefined}
                      transition={animateEnabled ? { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } : undefined}
                    >
                      <QuizQuestionComponent
                        question={currentQuestion}
                        selectedOption={selectedOption}
                        onSelectOption={handleSelectOption}
                      />
                    </motion.div>
                  </AnimatePresence>

                  <p className="sm:hidden mt-5 type-caption text-[var(--color-foreground)]/45">
                    선택 후 하단 고정 버튼으로 다음 질문으로 이동하세요.
                  </p>

                  <div className="mt-8 pt-6 border-t border-[var(--color-border)] hidden sm:flex items-center justify-between gap-3">
                    {currentIndex > 0 ? (
                      <Button variant="ghost" onClick={handlePrev}>
                        ← 이전
                      </Button>
                    ) : (
                      <span />
                    )}

                    <Button
                      onClick={handleNext}
                      disabled={!selectedOption}
                      className={!selectedOption ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      {isLastQuestion ? '결과 보기 →' : '다음 →'}
                    </Button>
                  </div>
                </div>

                <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur-md">
                  <div className="max-w-3xl mx-auto px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] grid grid-cols-2 gap-2">
                    <Button
                      variant="ghost"
                      onClick={handlePrev}
                      disabled={currentIndex === 0}
                      className={currentIndex === 0 ? 'opacity-40 w-full justify-center' : 'w-full justify-center'}
                    >
                      ← 이전
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!selectedOption}
                      className={!selectedOption ? 'opacity-50 cursor-not-allowed w-full justify-center' : 'w-full justify-center'}
                    >
                      {isLastQuestion ? '결과 보기 →' : '다음 →'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {phase === 'analyzing' && (
              <motion.div
                key="analyzing"
                initial={animateEnabled ? { opacity: 0 } : false}
                animate={animateEnabled ? { opacity: 1 } : undefined}
                exit={animateEnabled ? { opacity: 0 } : undefined}
                className="flex flex-col items-center justify-center min-h-[400px]"
              >
                {/* Spinning loader */}
                <motion.div
                  animate={animateEnabled ? { rotate: 360 } : undefined}
                  transition={animateEnabled ? { duration: 1.5, repeat: Infinity, ease: 'linear' } : undefined}
                  className="w-16 h-16 rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-asics-accent)] mb-8"
                />

                {/* Analysis text */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={analysisStep}
                    initial={animateEnabled ? { opacity: 0, y: 10 } : false}
                    animate={animateEnabled ? { opacity: 1, y: 0 } : undefined}
                    exit={animateEnabled ? { opacity: 0, y: -10 } : undefined}
                    className="type-h3 text-[var(--color-foreground)]/80 mb-6"
                    role="status"
                    aria-live="polite"
                  >
                    {analysisTexts[analysisStep]}
                  </motion.p>
                </AnimatePresence>

                {/* Progress bar */}
                <div className="w-64 h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                  <motion.div
                    initial={animateEnabled ? { width: '0%' } : { width: '100%' }}
                    animate={animateEnabled ? { width: '100%' } : { width: '100%' }}
                    transition={animateEnabled ? { duration: 0.8, ease: 'easeInOut' } : undefined}
                    className="h-full bg-gradient-to-r from-[var(--color-asics-blue)] to-[var(--color-asics-accent)] rounded-full"
                  />
                </div>
              </motion.div>
            )}

            {phase === 'result' && result && (
              <motion.div
                key="result"
                initial={animateEnabled ? { opacity: 0 } : false}
                animate={animateEnabled ? { opacity: 1 } : undefined}
                exit={animateEnabled ? { opacity: 0 } : undefined}
              >
                <QuizResult result={result} onRetry={handleRetry} />
                <div className="mt-4 text-center">
                  <Button variant="ghost" onClick={handleResetBrand}>
                    브랜드 다시 선택하기
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
