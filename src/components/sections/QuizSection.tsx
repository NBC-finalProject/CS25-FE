import React, { useState } from 'react';
import Container from '../common/Container';
import Section from '../common/Section';
import QuizComponent from '../common/QuizComponent';

const QuizSection: React.FC = () => {
  const [showResult, setShowResult] = useState(false);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);

  // 샘플 퀴즈 데이터
  const sampleQuiz = {
    question: "다음 중 시간 복잡도가 O(log n)인 알고리즘은?",
    options: [
      { id: 1, text: "버블 정렬 (Bubble Sort)" },
      { id: 2, text: "이진 탐색 (Binary Search)" },
      { id: 3, text: "선형 탐색 (Linear Search)" },
      { id: 4, text: "삽입 정렬 (Insertion Sort)" }
    ],
    correctAnswer: 2,
    explanation: "이진 탐색은 정렬된 배열에서 중간값과 비교하여 탐색 범위를 절반씩 줄여나가므로 O(log n)의 시간 복잡도를 가집니다."
  };

  const handleQuizSubmit = (selectedAnswer: number) => {
    setUserAnswer(selectedAnswer);
    setShowResult(true);
  };

  const resetQuiz = () => {
    setShowResult(false);
    setUserAnswer(null);
  };

  if (showResult) {
    const isCorrect = userAnswer === sampleQuiz.correctAnswer;
    return (
      <Section className="py-20 bg-gray-50">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <div className={`inline-flex items-center rounded-full px-6 py-3 mb-8 ${
              isCorrect ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <span className={`text-lg font-bold ${
                isCorrect ? 'text-green-700' : 'text-red-700'
              }`}>
                {isCorrect ? '🎉 정답입니다!' : '❌ 틀렸습니다!'}
              </span>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">해설</h3>
              <p className="text-gray-700 leading-relaxed">{sampleQuiz.explanation}</p>
              <div className="mt-6 p-4 bg-brand-50 rounded-xl">
                <p className="text-brand-800 font-medium">
                  정답: {sampleQuiz.options.find(opt => opt.id === sampleQuiz.correctAnswer)?.text}
                </p>
              </div>
            </div>

            <button
              onClick={resetQuiz}
              className="bg-gradient-to-r from-brand-500 to-brand-600 text-white px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 hover:from-brand-600 hover:to-brand-700 hover:scale-105 hover:shadow-lg"
            >
              다시 풀어보기
            </button>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="py-20 bg-gray-50">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center bg-brand-100 rounded-full px-6 py-2 mb-8">
            <span className="text-sm font-medium text-brand-700">📚 오늘의 CS 문제</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            AI가 준비한 <span className="bg-gradient-to-r from-brand-600 to-navy-600 bg-clip-text text-transparent">오늘의 문제</span>
          </h2>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            매일 새로운 CS 지식을 확인하고 실력을 향상시켜보세요
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <QuizComponent
            question={sampleQuiz.question}
            options={sampleQuiz.options}
            onSubmit={handleQuizSubmit}
          />
        </div>
      </Container>
    </Section>
  );
};

export default QuizSection;