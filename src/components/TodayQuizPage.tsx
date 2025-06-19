import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { quizAPI } from '../utils/api';
import Container from './common/Container';
import Section from './common/Section';
import { useModal } from '../hooks/useModal';

interface QuizData {
  question: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
  answerNumber: string;
  commentary: string;
}

interface AnswerResult {
  isCorrect: boolean;
  answer: string;
  commentary: string;
}

// 임시 데이터
const fakeTodayQuiz: QuizData = {
  question: "다음 중 JavaScript에서 변수를 선언하는 올바른 방법은?",
  choice1: "1. variable myVar = 10;",
  choice2: "2. let myVar = 10;",
  choice3: "3. declare myVar = 10;",
  choice4: "4. set myVar = 10;",
  answerNumber: "",
  commentary: ""
};

const fakeAnswer: AnswerResult = {
  isCorrect: true,
  answer: "2번. let myVar = 10;",
  commentary: "let은 ES6에서 도입된 블록 스코프 변수 선언 키워드입니다."
};

const TodayQuizPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const { openModal } = useModal();

  const subscriptionId = searchParams.get('subscriptionId');
  const quizId = searchParams.get('quizId');

  const { data: question, isLoading, error } = useQuery({
    queryKey: ['todayQuiz', subscriptionId, quizId],
    queryFn: async () => {
      const response = await quizAPI.getTodayQuiz(subscriptionId || undefined, quizId || undefined);
      
      // 다양한 응답 구조 처리
      let quizData;
      
      if (response && typeof response === 'object') {
        // Case 1: { data: { question, choice1, choice2, choice3, choice4 } }
        if ('data' in response && response.data) {
          quizData = response.data;
        }
        // Case 2: { question, choice1, choice2, choice3, choice4 } 직접
        else if ('question' in response) {
          quizData = response;
        }
        // Case 3: 기타 구조
        else {
          quizData = response;
        }
      } else {
        quizData = null;
      }
      
      return quizData as QuizData;
    },
    enabled: !!(subscriptionId && quizId),
  });
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedAnswer === null) {
      openModal({
        title: '선택 필요',
        content: (
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-700 text-lg">선택지를 먼저 클릭해주세요!</p>
          </div>
        ),
        size: 'sm'
      });
      return;
    }

    if (quizId && subscriptionId && displayQuiz) {
      try {
        // API로 답안 제출 (기록용)
        await quizAPI.submitTodayQuizAnswer(quizId, selectedAnswer, subscriptionId);
        
        // 클라이언트에서 정답 검증
        const correctAnswerNumber = parseInt(displayQuiz.answerNumber);
        const isCorrect = selectedAnswer === correctAnswerNumber;
        
        // 정답 텍스트 찾기
        const answerText = displayQuiz[`choice${correctAnswerNumber}` as keyof QuizData] as string;
        const cleanAnswerText = answerText ? answerText.replace(/^\d+\.\s*/, '') : '';
        
        const result: AnswerResult = {
          isCorrect,
          answer: `${correctAnswerNumber}번. ${cleanAnswerText}`,
          commentary: displayQuiz.commentary
        };
        
        setAnswerResult(result);
        setIsSubmitted(true);
      } catch (error: any) {
        
        // 400 에러 체크 및 메시지 처리
        if (error?.status === 400) {
          const errorMessage = error?.message || '잘못된 요청입니다. 답안 제출에 실패했습니다.';
          
          openModal({
            title: '알림',
            content: (
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-700 text-lg">{errorMessage}</p>
              </div>
            ),
            size: 'sm'
          });
          return;
        }
        
        // 추가적인 400 에러 체크 (다른 형태일 수 있음)
        // if (error?.message?.includes('400') || error?.toString()?.includes('400')) {
        //   console.log('Found 400 in message, showing alert');
        //   alert('이미 제출한 문제입니다.');
        //   return;
        // }
        
        // 기타 API 실패해도 클라이언트에서 정답 검증
        const correctAnswerNumber = parseInt(displayQuiz.answerNumber || '2');
        const isCorrect = selectedAnswer === correctAnswerNumber;
        const answerText = displayQuiz[`choice${correctAnswerNumber}` as keyof QuizData] as string;
        const cleanAnswerText = answerText ? answerText.replace(/^\d+\.\s*/, '') : '';
        
        const result: AnswerResult = {
          isCorrect,
          answer: `${correctAnswerNumber}번. ${cleanAnswerText}`,
          commentary: displayQuiz.commentary || '해설 정보가 없습니다.'
        };
        
        setAnswerResult(result);
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
  const displayQuiz = question || fakeTodayQuiz;

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
              
              <div className="p-4 bg-brand-50 rounded-xl mb-6">
                <p className="text-brand-800 font-medium">
                  정답: {answerResult.answer}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="text-lg font-bold text-gray-900 mb-2">해설</h4>
                <p className="text-gray-700 leading-relaxed">
                  {answerResult.commentary}
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
              <strong>Q. {displayQuiz?.question}</strong>
            </div>

            {/* Quiz Form */}
            <form onSubmit={handleSubmit}>
              {/* Options List - 세로 배치로 변경 */}
              <div className="space-y-4 max-w-4xl mx-auto mb-8">
                {[displayQuiz?.choice1, displayQuiz?.choice2, displayQuiz?.choice3, displayQuiz?.choice4].map((choice, index) => {
                  const isSelected = selectedAnswer === index + 1;
                  
                  // 앞의 "1. 2. 3. 4." 숫자 부분만 제거
                  const displayChoice = choice ? choice.replace(/^\d+\.\s*/, '') : '';
                  const optionNumber = index + 1;
                  
                  return (
                    <div
                      key={index}
                      onClick={() => handleOptionClick(index + 1)}
                      className={`group relative p-5 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg text-left border-2 ${
                        isSelected
                          ? 'border-brand-500 bg-gradient-to-r from-brand-50 to-brand-100 shadow-md'
                          : 'border-gray-200 bg-white hover:border-brand-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        {/* Option Number with modern design */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                          isSelected
                            ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-md'
                            : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 group-hover:from-brand-100 group-hover:to-brand-200 group-hover:text-brand-700'
                        }`}>
                          <span className="font-extrabold">{optionNumber}</span>
                        </div>
                        
                        {/* Option Text */}
                        <div className="flex-1 min-w-0">
                          <span className={`font-medium leading-relaxed break-words transition-colors duration-300 ${
                            isSelected
                              ? 'text-brand-800'
                              : 'text-gray-700 group-hover:text-gray-900'
                          }`}>
                            {displayChoice}
                          </span>
                        </div>
                        
                        {/* Selected Indicator */}
                        {isSelected && (
                          <div className="flex-shrink-0">
                            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Hover Effect Border */}
                      <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                        isSelected
                          ? 'opacity-0'
                          : 'opacity-0 group-hover:opacity-100 bg-gradient-to-r from-brand-500/5 to-navy-500/5'
                      }`} />
                    </div>
                  );
                })}
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