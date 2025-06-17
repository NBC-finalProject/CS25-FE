import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { quizAPI } from '../utils/api';
import Container from './common/Container';
import Section from './common/Section';

interface QuizData {
  quiz: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
}

interface AnswerResult {
  isCorrect: boolean;
  answer: string;
}

// 임시 데이터
const fakeTodayQuiz: QuizData = {
  quiz: "다음 중 JavaScript에서 변수를 선언하는 올바른 방법은?",
  choice1: "1. variable myVar = 10;",
  choice2: "2. let myVar = 10;",
  choice3: "3. declare myVar = 10;",
  choice4: "4. set myVar = 10;"
};

const fakeAnswer: AnswerResult = {
  isCorrect: true,
  answer: "2. let myVar = 10;"
};

const TodayQuizPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);

  const subscriptionId = searchParams.get('subscriptionId');
  const quizId = searchParams.get('quizId');

  const { data: quiz, isLoading, error } = useQuery({
    queryKey: ['todayQuiz', subscriptionId, quizId],
    queryFn: async () => {
      const response = await quizAPI.getTodayQuiz(subscriptionId || undefined, quizId || undefined);
      console.log('Quiz response:', response);
      
      return response as QuizData;
    },
    enabled: !!(subscriptionId && quizId),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedAnswer === null) {
      alert('선택지를 먼저 클릭해주세요!');
      return;
    }

    if (quizId && subscriptionId) {
      try {
        const result = await quizAPI.submitTodayQuizAnswer(quizId, selectedAnswer, subscriptionId);
        setAnswerResult(result as AnswerResult);
        setIsSubmitted(true);
      } catch (error) {
        console.error('Failed to submit answer:', error);
        // API 실패 시 fake 데이터 사용
        setAnswerResult(fakeAnswer);
        setIsSubmitted(true);
      }
    }
  };

  const handleOptionClick = (value: number) => {
    if (!isSubmitted) {
      setSelectedAnswer(value);
    }
  };

  if (isLoading) {
    return (
      <Section className="py-20 bg-gray-50">
        <Container>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">퀴즈를 불러오는 중...</p>
          </div>
        </Container>
      </Section>
    );
  }

  // API 실패 시 fake 데이터 사용
  const displayQuiz = quiz || fakeTodayQuiz;

  if (isSubmitted && answerResult) {
    const isCorrect = answerResult.isCorrect;
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">결과</h3>
              <p className="text-gray-700 leading-relaxed mb-4">답안이 성공적으로 제출되었습니다.</p>
              <div className="p-4 bg-brand-50 rounded-xl">
                <p className="text-brand-800 font-medium">
                  정답: {answerResult.answer}
                </p>
              </div>
            </div>
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
          <div className="font-pretendard text-center py-8">
            {/* Question Box */}
            <div className="bg-brand-50 border border-brand-200 rounded-xl p-6 text-lg font-medium text-gray-800 mb-8 max-w-4xl mx-auto text-left">
              <strong>Q. {displayQuiz.quiz}</strong>
            </div>

            {/* Quiz Form */}
            <form onSubmit={handleSubmit}>
              {/* Options List - 세로 배치로 변경 */}
              <div className="space-y-3 max-w-4xl mx-auto mb-8">
                {[displayQuiz.choice1, displayQuiz.choice2, displayQuiz.choice3, displayQuiz.choice4].map((choice, index) => (
                  <div
                    key={index}
                    onClick={() => handleOptionClick(index + 1)}
                    className={`border-2 p-4 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md text-left ${
                      selectedAnswer === index + 1
                        ? 'border-brand-500 bg-brand-100 text-brand-800'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-brand-300'
                    }`}
                  >
                    <span className="font-medium leading-relaxed break-words">{choice}</span>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-gradient-to-r from-brand-500 to-brand-600 text-white px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 hover:from-brand-600 hover:to-brand-700 hover:scale-105 hover:shadow-lg"
              >
                제출하기
              </button>
            </form>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default TodayQuizPage;