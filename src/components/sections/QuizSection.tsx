import React, { useState } from "react";
import Container from "../common/Container";
import Section from "../common/Section";
import QuizComponent from "../common/QuizComponent";

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
      <Section className="bg-gray-50 py-20">
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
      <Section className="bg-gray-50 py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <div
              className={`mb-8 inline-flex items-center rounded-full px-6 py-3 ${
                isCorrect ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <span
                className={`text-lg font-bold ${
                  isCorrect ? "text-green-700" : "text-red-700"
                }`}
              >
                {isCorrect ? "🎉 정답입니다!" : "❌ 틀렸습니다!"}
              </span>
            </div>

            <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-gray-900">해설</h3>
              <p className="leading-relaxed text-gray-700">
                {currentQuiz.explanation}
              </p>
              <div className="bg-brand-50 mt-6 rounded-xl p-4">
                <p className="text-brand-800 font-medium">
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
              className="from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 rounded-full bg-gradient-to-r px-8 py-3 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              다시 풀어보기
            </button>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="bg-gray-50 py-20">
      <Container>
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="bg-brand-100 mb-8 inline-flex items-center rounded-full px-6 py-2">
            <span className="text-brand-700 text-sm font-medium">
              오늘의 CS 문제
            </span>
          </div>

          <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
            AI가 준비한{" "}
            <span className="from-brand-600 to-navy-600 bg-gradient-to-r bg-clip-text text-transparent">
              오늘의 연습문제
            </span>
          </h2>

          <p className="text-lg leading-relaxed text-gray-600">
            매일 새로운 CS 지식을 확인하고 실력을 향상시켜보세요
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <QuizComponent
            question={currentQuiz.question}
            options={currentQuiz.options}
            onSubmit={handleQuizSubmit}
          />
        </div>
      </Container>
    </Section>
  );
};

export default QuizSection;
