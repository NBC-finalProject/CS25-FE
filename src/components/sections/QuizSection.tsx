import React, { useState } from "react";
import Container from "../common/Container";
import Section from "../common/Section";
import QuizComponent from "../common/QuizComponent";
import { useModal } from "../../hooks/useModal";

interface QuizData {
  id: string;
  question: string;
  options: Array<{
    id: number;
    text: string;
  }>;
  correctAnswer: number;
  explanation: string;
}

const QuizSection: React.FC = () => {
  const [showResult, setShowResult] = useState(false);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const { openModal } = useModal();

  // 샘플 퀴즈 데이터 (API 실패시 fallback)
  const sampleQuiz: QuizData = {
    id: "sample",
    question: "다음 중 시간 복잡도가 O(log n)인 알고리즘은?",
    options: [
      { id: 1, text: "버블 정렬 (Bubble Sort)" },
      { id: 2, text: "이진 탐색 (Binary Search)" },
      { id: 3, text: "선형 탐색 (Linear Search)" },
      { id: 4, text: "삽입 정렬 (Insertion Sort)" },
    ],
    correctAnswer: 2,
    explanation:
      "이진 탐색은 정렬된 배열에서 중간값과 비교하여 탐색 범위를 절반씩 줄여나가므로 O(log n)의 시간 복잡도를 가집니다.",
  };

  const handleQuizSubmit = async (selectedAnswer: number) => {
    setUserAnswer(selectedAnswer);
    setShowResult(true);
  };

  const resetQuiz = () => {
    setShowResult(false);
    setUserAnswer(null);
  };

  // 에러 상태 처리 - 샘플 퀴즈로 fallback
  const currentQuiz = sampleQuiz;

  if (!currentQuiz) {
    return (
      <Section className="bg-gray-50 py-12 sm:py-20">
        <Container>
          <div className="text-center">
            <p className="text-red-600">퀴즈를 불러올 수 없습니다.</p>
            <p className="mt-2 text-gray-600">잠시 후 다시 시도해주세요.</p>
          </div>
        </Container>
      </Section>
    );
  }

  if (showResult) {
    const isCorrect = userAnswer === currentQuiz.correctAnswer;
    return (
      <Section className="bg-gray-50 py-12 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <div
              className={`mb-6 inline-flex items-center rounded-full px-4 py-2 sm:mb-8 sm:px-6 sm:py-3 ${
                isCorrect ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <span
                className={`text-base font-bold sm:text-lg ${
                  isCorrect ? "text-green-700" : "text-red-700"
                }`}
              >
                {isCorrect ? "🎉 정답입니다!" : "❌ 틀렸습니다!"}
              </span>
            </div>

            <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm sm:mb-8 sm:border sm:border-gray-100 sm:p-8">
              <h3 className="mb-3 text-lg font-bold text-gray-900 sm:mb-4 sm:text-xl">
                해설
              </h3>
              <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                {currentQuiz.explanation}
              </p>
              <div className="bg-brand-50 mt-4 rounded-xl p-3 sm:mt-6 sm:p-4">
                <p className="text-brand-800 text-sm font-medium sm:text-base">
                  정답:{" "}
                  {
                    currentQuiz.options.find(
                      (opt) => opt.id === currentQuiz.correctAnswer,
                    )?.text
                  }
                </p>
              </div>
            </div>

            <button
              onClick={resetQuiz}
              className="from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 rounded-full bg-gradient-to-r px-6 py-2.5 text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg sm:px-8 sm:py-3 sm:text-lg"
            >
              다시 풀어보기
            </button>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="bg-gray-50 py-12 sm:py-20">
      <Container>
        <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-12">
          <div className="bg-brand-100 mb-6 inline-flex items-center rounded-full px-4 py-1.5 sm:mb-8 sm:px-6 sm:py-2">
            <span className="text-brand-700 text-xs font-medium sm:text-sm">
              오늘의 CS 문제
            </span>
          </div>

          <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:mb-6 sm:text-3xl md:text-4xl">
            AI가 준비한{" "}
            <span className="from-brand-600 to-navy-600 bg-gradient-to-r bg-clip-text text-transparent">
              오늘의 연습문제
            </span>
          </h2>

          <p className="text-base leading-relaxed text-gray-600 sm:text-lg">
            매일 새로운 CS 지식을 확인하고 실력을 향상시켜보세요
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm sm:border sm:border-gray-100 sm:p-8">
          <QuizComponent
            question={currentQuiz.question}
            options={currentQuiz.options}
            onSubmit={handleQuizSubmit}
            openModal={openModal}
          />
        </div>
      </Container>
    </Section>
  );
};

export default QuizSection;
