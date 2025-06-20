import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { quizAPI } from '../../utils/api';
import { getMainCategoryLabel, getSubCategoryLabel } from '../../utils/categoryUtils';
import Container from '../common/Container';
import Section from '../common/Section';
import { useModal } from '../../hooks/useModal';

interface QuizCategoryData {
  main: string; // 대분류
  sub?: string; // 소분류
}

interface QuizData {
  question: string;
  choice1?: string; // 객관식만
  choice2?: string; // 객관식만
  choice3?: string; // 객관식만
  choice4?: string; // 객관식만
  answerNumber?: string; // 객관식만 - 정답 번호
  answer?: string; // 주관식만 - 모범답안
  commentary: string;
  category?: QuizCategoryData; // 문제 카테고리
  quizType: string;
  quizLevel: string; // 난이도: "HARD", "NORMAL", "EASY"
}

interface AnswerResult {
  isCorrect: boolean;
  answer: string;
  commentary: string;
  aiFeedback?: string; // 주관식 AI 피드백
}

interface SelectionRatesData {
  selectionRates: {
    [key: string]: number;
  };
  totalCount: number;
}

interface AiFeedbackResponse {
  quizId: number;
  quizAnswerId: number;
  isCorrect: boolean;
  aiFeedback: string;
}

// 임시 데이터
const fakeTodayQuiz: QuizData = {
  question: "다음 중 JavaScript에서 변수를 선언하는 올바른 방법은?",
  choice1: "1. variable myVar = 10;",
  choice2: "2. let myVar = 10;",
  choice3: "3. declare myVar = 10;",
  choice4: "4. set myVar = 10;",
  answerNumber: "2",
  commentary: "let은 ES6에서 도입된 블록 스코프 변수 선언 키워드입니다.",
  category: {
    main: "FRONTEND",
    sub: "Programming"
  },
  quizType: "MULTIPLE_CHOICE",
  quizLevel: "NORMAL"
};


const TodayQuizSection: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [subjectiveAnswer, setSubjectiveAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [selectionRates, setSelectionRates] = useState<SelectionRatesData | null>(null);
  const [animatedPercentages, setAnimatedPercentages] = useState<{[key: number]: number}>({});
  const [isAiFeedbackLoading, setIsAiFeedbackLoading] = useState(false);
  const { openModal } = useModal();

  const subscriptionId = searchParams.get('subscriptionId');
  const quizId = searchParams.get('quizId');

  // 답변 제출 후 게이지 애니메이션 효과
  React.useEffect(() => {
    if (isSubmitted && selectionRates && selectedAnswer) {
      // 초기값을 0으로 설정
      setAnimatedPercentages({1: 0, 2: 0, 3: 0, 4: 0});
      
      // 0.5초 후 실제 값으로 애니메이션 시작
      const timer = setTimeout(() => {
        const newPercentages: {[key: number]: number} = {};
        [1, 2, 3, 4].forEach(choice => {
          // 사용자의 선택을 포함한 새로운 비율 계산
          const originalRate = selectionRates.selectionRates[choice.toString()] || 0;
          const originalCount = Math.round(originalRate * selectionRates.totalCount);
          const newCount = selectedAnswer === choice ? originalCount + 1 : originalCount;
          const newTotalCount = selectionRates.totalCount + 1;
          const newRate = newCount / newTotalCount;
          newPercentages[choice] = Math.round(newRate * 100);
        });
        setAnimatedPercentages(newPercentages);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isSubmitted, selectionRates, selectedAnswer]);

  const { data: question, isLoading } = useQuery({
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

      // 퀴즈 데이터와 함께 선택 비율도 가져오기 (객관식만)
      if (quizData && quizId && (quizData as QuizData).quizType === 'MULTIPLE_CHOICE') {
        try {
          const ratesResponse = await quizAPI.getQuizSelectionRates(quizId);
          // API 응답 구조 처리
          if (ratesResponse && typeof ratesResponse === 'object') {
            const ratesData = ('data' in ratesResponse) ? ratesResponse.data : ratesResponse;
            setSelectionRates(ratesData as SelectionRatesData);
          }
        } catch (error) {
          console.error('선택 비율 데이터 가져오기 실패:', error);
        }
      }
      
      return quizData as QuizData;
    },
    enabled: !!(subscriptionId && quizId),
  });
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 객관식인 경우 선택지 확인
    if (displayQuiz?.quizType === 'MULTIPLE_CHOICE' && selectedAnswer === null) {
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

    // 주관식인 경우 답안 확인
    if (displayQuiz?.quizType === 'SUBJECTIVE' && subjectiveAnswer.trim() === '') {
      openModal({
        title: '답안 입력 필요',
        content: (
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-700 text-lg">답안을 입력해주세요!</p>
          </div>
        ),
        size: 'sm'
      });
      return;
    }

    if (quizId && subscriptionId && displayQuiz) {
      try {
        // API로 답안 제출 (기록용)
        const submitAnswer = displayQuiz.quizType === 'MULTIPLE_CHOICE' ? selectedAnswer! : subjectiveAnswer;
        const submitResponse = await quizAPI.submitTodayQuizAnswer(quizId, submitAnswer, subscriptionId);
        
        if (displayQuiz.quizType === 'MULTIPLE_CHOICE') {
          // 객관식: 클라이언트에서 정답 검증
          const correctAnswerNumber = parseInt(displayQuiz.answerNumber || '1');
          const isCorrect = selectedAnswer === correctAnswerNumber;
          const choiceText = displayQuiz[`choice${correctAnswerNumber}` as keyof QuizData] as string;
          const cleanAnswerText = choiceText ? choiceText.replace(/^\d+\.\s*/, '') : '';
          const answerText = `${correctAnswerNumber}번. ${cleanAnswerText}`;
          
          const result: AnswerResult = {
            isCorrect,
            answer: answerText,
            commentary: displayQuiz.commentary
          };
          
          setAnswerResult(result);
          setIsSubmitted(true);
        } else {
          // 먼저 기본 결과 표시 (AI 피드백 없이)
          const initialResult: AnswerResult = {
            isCorrect: false, // 일단 false로 설정, AI 피드백에서 업데이트
            answer: displayQuiz.answer || '',
            commentary: displayQuiz.commentary
          };
          
          setAnswerResult(initialResult);
          setIsSubmitted(true);
          setIsAiFeedbackLoading(true);
          
          let answerId: string;
          
          // API 응답에서 answerId 추출
          if (submitResponse && typeof submitResponse === 'object') {
            if ('data' in submitResponse && submitResponse.data) {
              answerId = (submitResponse.data as any).toString();
            } else if ('answerId' in submitResponse) {
              answerId = (submitResponse as any).answerId.toString();
            } else {
              // 응답 전체가 answerId일 수 있음
              answerId = (submitResponse as any).toString();
            }
          } else {
            answerId = (submitResponse as any).toString();
          }
          
          console.log('추출된 answerId:', answerId);
          
          try {
            // AI 피드백 요청
            console.log('AI 피드백 요청 중:', `/quizzes/${answerId}/feedback`);
            const feedbackResponse = await quizAPI.getAiFeedback(answerId);
            console.log('AI 피드백 응답:', feedbackResponse);
            let feedbackData: AiFeedbackResponse;
            
            // API 응답 구조 처리
            if (feedbackResponse && typeof feedbackResponse === 'object') {
              feedbackData = ('data' in feedbackResponse) ? feedbackResponse.data as AiFeedbackResponse : feedbackResponse as AiFeedbackResponse;
            } else {
              throw new Error('피드백 응답 형식이 올바르지 않습니다.');
            }
            
            // AI 피드백 받은 후 결과 업데이트
            const updatedResult: AnswerResult = {
              isCorrect: feedbackData.isCorrect,
              answer: displayQuiz.answer || '',
              commentary: displayQuiz.commentary,
              aiFeedback: feedbackData.aiFeedback
            };
            
            setAnswerResult(updatedResult);
            setIsAiFeedbackLoading(false);
          } catch (feedbackError) {
            console.error('AI 피드백 요청 실패:', feedbackError);
            
            // 피드백 실패 시 기본 결과 표시
            const errorResult: AnswerResult = {
              isCorrect: false, // 기본값
              answer: displayQuiz.answer || '',
              commentary: displayQuiz.commentary,
              aiFeedback: 'AI 피드백을 가져오는데 실패했습니다.'
            };
            
            setAnswerResult(errorResult);
            setIsAiFeedbackLoading(false);
          }
        }
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
        let isCorrect: boolean;
        let answerText: string;
        
        if (displayQuiz.quizType === 'MULTIPLE_CHOICE') {
          const correctAnswerNumber = parseInt(displayQuiz.answerNumber || '2');
          isCorrect = selectedAnswer === correctAnswerNumber;
          const choiceText = displayQuiz[`choice${correctAnswerNumber}` as keyof QuizData] as string;
          const cleanAnswerText = choiceText ? choiceText.replace(/^\d+\.\s*/, '') : '';
          answerText = `${correctAnswerNumber}번. ${cleanAnswerText}`;
        } else {
          // 주관식의 경우
          isCorrect = subjectiveAnswer.trim().toLowerCase() === (displayQuiz.answer || '').toLowerCase();
          answerText = displayQuiz.answer || '';
        }
        
        const result: AnswerResult = {
          isCorrect,
          answer: answerText,
          commentary: displayQuiz.commentary || '해설 정보가 없습니다.'
        };
        
        setAnswerResult(result);
        setIsSubmitted(true);
      }
    }
  };

  const handleOptionClick = (value: number) => {
    if (!isSubmitted && displayQuiz?.quizType === 'MULTIPLE_CHOICE') {
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

  // 난이도 표시 함수
  const getDifficultyDisplay = (level: string) => {
    switch (level) {
      case 'EASY':
        return { label: '쉬움', color: 'bg-green-100 text-green-800' };
      case 'NORMAL':
        return { label: '보통', color: 'bg-yellow-100 text-yellow-800' };
      case 'HARD':
        return { label: '어려움', color: 'bg-red-100 text-red-800' };
      default:
        return { label: '보통', color: 'bg-gray-100 text-gray-800' };
    }
  };


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

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-8">
          <div className="font-pretendard text-center py-4 sm:py-8">
            {/* Total Count & Difficulty */}
            <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              {selectionRates && (
                <div className="inline-flex items-center bg-blue-100 rounded-full px-4 py-2">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-sm font-medium text-blue-700">
                    총 {isSubmitted ? selectionRates.totalCount + 1 : selectionRates.totalCount}명이 이 문제를 풀었습니다
                  </span>
                </div>
              )}
            </div>

            {/* Question Box */}
            <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 sm:p-6 text-base sm:text-lg font-medium text-gray-800 mb-8 max-w-4xl mx-auto text-left">
              <div className="flex items-start justify-between mb-4">
                <strong className="flex-1 leading-relaxed">Q. {displayQuiz?.question}</strong>
                {/* 카테고리 & 난이도 표시 */}
                <div className="ml-2 sm:ml-4 flex flex-col sm:flex-row gap-1 sm:gap-2 flex-shrink-0">
                  {displayQuiz?.category?.main && (
                    <div className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      {getMainCategoryLabel(displayQuiz.category.main)}
                    </div>
                  )}
                  {displayQuiz?.category?.sub && (
                    <div className="bg-purple-100 text-purple-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      {getSubCategoryLabel(displayQuiz.category.sub)}
                    </div>
                  )}
                  {displayQuiz?.quizLevel && (
                    <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getDifficultyDisplay(displayQuiz.quizLevel).color}`}>
                      {getDifficultyDisplay(displayQuiz.quizLevel).label}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quiz Form */}
            <form onSubmit={handleSubmit}>
              {/* 객관식 문제 */}
              {displayQuiz?.quizType === 'MULTIPLE_CHOICE' && (
                <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto mb-8">
                  {[displayQuiz?.choice1, displayQuiz?.choice2, displayQuiz?.choice3, displayQuiz?.choice4].map((choice, index) => {
                    const isSelected = selectedAnswer === index + 1;
                    const optionNumber = index + 1;
                    
                    // 앞의 "1. 2. 3. 4." 숫자 부분만 제거
                    const displayChoice = choice ? choice.replace(/^\d+\.\s*/, '') : '';
                    
                    return (
                      <div
                        key={index}
                        onClick={() => handleOptionClick(index + 1)}
                        className={`group relative p-3 sm:p-5 rounded-xl sm:rounded-2xl transition-all duration-300 transform text-left border-2 overflow-hidden ${
                          !isSubmitted ? 'cursor-pointer hover:scale-[1.01] sm:hover:scale-[1.02] hover:shadow-lg' : ''
                        } ${
                          isSelected
                            ? 'border-brand-500 bg-gradient-to-r from-brand-50 to-brand-100 shadow-md'
                            : 'border-gray-200 bg-white hover:border-brand-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="relative flex items-center space-x-3 sm:space-x-4">
                          {/* Option Number with modern design */}
                          <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-base sm:text-lg transition-all duration-300 ${
                            isSelected
                              ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-md'
                              : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 group-hover:from-brand-100 group-hover:to-brand-200 group-hover:text-brand-700'
                          }`}>
                            <span className="font-extrabold">{optionNumber}</span>
                          </div>
                          
                          {/* Option Text */}
                          <div className="flex-1 min-w-0">
                            <span className={`font-medium text-sm sm:text-base leading-relaxed break-words transition-colors duration-300 ${
                              isSelected
                                ? 'text-brand-800'
                                : 'text-gray-700 group-hover:text-gray-900'
                            }`}>
                              {displayChoice}
                            </span>
                          </div>
                          
                          {/* Selected Indicator */}
                          {isSelected && !isSubmitted && (
                            <div className="flex-shrink-0">
                              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Hover Effect Border (제출 전에만) */}
                        {!isSubmitted && (
                          <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                            isSelected
                              ? 'opacity-0'
                              : 'opacity-0 group-hover:opacity-100 bg-gradient-to-r from-brand-500/5 to-navy-500/5'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 주관식 문제 */}
              {displayQuiz?.quizType === 'SUBJECTIVE' && (
                <div className="max-w-4xl mx-auto mb-8">
                  <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 p-4 sm:p-6">
                    <label htmlFor="subjective-answer" className="block text-base sm:text-lg font-medium text-gray-900 mb-4">
                      답안을 입력해주세요
                    </label>
                    <textarea
                      id="subjective-answer"
                      value={subjectiveAnswer}
                      onChange={(e) => setSubjectiveAnswer(e.target.value)}
                      disabled={isSubmitted}
                      className={`w-full p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl text-base sm:text-lg leading-relaxed resize-none transition-all duration-300 ${
                        isSubmitted 
                          ? 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'
                          : 'border-gray-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 focus:outline-none'
                      }`}
                      rows={4}
                      placeholder="여기에 답안을 입력하세요..."
                    />
                  </div>
                </div>
              )}

              {/* Result Section - 제출 후에만 표시 */}
              {isSubmitted && answerResult && (
                <div className="max-w-4xl mx-auto mb-8">
                  {/* 정답/오답 메시지 - 객관식에만 표시 */}
                  {displayQuiz?.quizType === 'MULTIPLE_CHOICE' && (
                    <div className={`inline-flex items-center rounded-full px-6 py-3 mb-6 ${
                      answerResult.isCorrect ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <span className={`text-lg font-bold ${
                        answerResult.isCorrect ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {answerResult.isCorrect ? '🎉 정답입니다!' : '❌ 틀렸습니다!'}
                      </span>
                    </div>
                  )}

                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">결과</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">답안이 성공적으로 제출되었습니다.</p>
                    
                    {/* 정답 섹션 - 객관식에만 표시 */}
                    {displayQuiz?.quizType === 'MULTIPLE_CHOICE' && (
                      <div className="p-4 bg-brand-50 rounded-xl mb-6">
                        <p className="text-brand-800 font-medium">
                          정답: <span className="font-bold">{answerResult.answer.match(/^(\d+번)/)?.[1]}</span>{answerResult.answer.replace(/^\d+번/, '')}
                        </p>
                      </div>
                    )}
                    
                    {/* 모범답안 표시 (주관식만) */}
                    {displayQuiz?.quizType === 'SUBJECTIVE' && (
                      <div className="p-4 bg-green-50 rounded-xl mb-6">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">모범답안</h4>
                        <p className="text-green-800 font-medium leading-relaxed">
                          {answerResult.answer}
                        </p>
                      </div>
                    )}

                    {/* AI 피드백 표시 (주관식만) */}
                    {displayQuiz?.quizType === 'SUBJECTIVE' && (
                      <div className="p-4 bg-blue-50 rounded-xl mb-6">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">AI 피드백</h4>
                        {isAiFeedbackLoading ? (
                          <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                            <p className="text-blue-700">AI가 피드백을 생성하고 있습니다...</p>
                          </div>
                        ) : answerResult.aiFeedback ? (
                          <div>
                            {(() => {
                              // AI 피드백 텍스트 파싱
                              const feedbackText = answerResult.aiFeedback;
                              const resultMatch = feedbackText.match(/^(정답|오답):\s*(.*?)(?:\s*피드백:\s*(.*))?$/); 
                              
                              if (resultMatch) {
                                const [, resultType, resultDescription, feedbackContent] = resultMatch;
                                const isCorrectFromText = resultType === '정답';
                                
                                return (
                                  <div>
                                    {/* 정답/오답 결과 */}
                                    <div className={`inline-flex items-center rounded-full px-4 py-2 mb-3 ${
                                      isCorrectFromText ? 'bg-green-100' : 'bg-red-100'
                                    }`}>
                                      <span className={`text-sm font-bold ${
                                        isCorrectFromText ? 'text-green-700' : 'text-red-700'
                                      }`}>
                                        {isCorrectFromText ? '🎉 정답입니다!' : '❌ 틀렸습니다!'}
                                      </span>
                                    </div>
                                    
                                    {/* 결과 설명 */}
                                    {resultDescription && (
                                      <div className={`p-3 rounded-lg mb-3 ${
                                        isCorrectFromText ? 'bg-green-50' : 'bg-red-50'
                                      }`}>
                                        <p className={`text-sm ${
                                          isCorrectFromText ? 'text-green-800' : 'text-red-800'
                                        }`}>
                                          <span className="font-semibold">{resultType}:</span> {resultDescription.trim()}
                                        </p>
                                      </div>
                                    )}
                                    
                                    {/* 피드백 내용 */}
                                    {feedbackContent && (
                                      <div className="p-3 bg-blue-50 rounded-lg">
                                        <p className="text-blue-800 text-sm">
                                          <span className="font-semibold">피드백:</span> {feedbackContent.trim()}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                );
                              } else {
                                // 파싱 실패 시 기본 형태로 표시
                                return (
                                  <div>
                                    <div className={`inline-flex items-center rounded-full px-4 py-2 mb-3 ${
                                      answerResult.isCorrect ? 'bg-green-100' : 'bg-red-100'
                                    }`}>
                                      <span className={`text-sm font-bold ${
                                        answerResult.isCorrect ? 'text-green-700' : 'text-red-700'
                                      }`}>
                                        {answerResult.isCorrect ? '🎉 정답입니다!' : '❌ 틀렸습니다!'}
                                      </span>
                                    </div>
                                    <p className="text-blue-800 leading-relaxed text-sm">
                                      {answerResult.aiFeedback}
                                    </p>
                                  </div>
                                );
                              }
                            })()}
                          </div>
                        ) : (
                          <p className="text-blue-700">AI 피드백을 불러오는 중...</p>
                        )}
                      </div>
                    )}

                    <div className="p-4 bg-gray-50 rounded-xl mb-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">해설</h4>
                      <p className="text-gray-700 leading-relaxed">
                        {answerResult.commentary}
                      </p>
                    </div>

                    {/* 선택 비율 섹션 - 객관식에만 표시 */}
                    {selectionRates && displayQuiz?.quizType === 'MULTIPLE_CHOICE' && (
                      <div className="p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl">
                        <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">선택 비율</h4>
                        <div className="space-y-2 sm:space-y-3">
                          {[1, 2, 3, 4].map(choice => {
                            const originalRate = selectionRates.selectionRates[choice.toString()] || 0;
                            const originalCount = Math.round(originalRate * selectionRates.totalCount);
                            
                            // 사용자의 선택을 포함해서 새로운 비율 계산
                            const newCount = selectedAnswer === choice ? originalCount + 1 : originalCount;
                            const newTotalCount = selectionRates.totalCount + 1;
                            const newRate = newCount / newTotalCount;
                            const actualPercentage = Math.round(newRate * 100);
                            
                            const animatedPercentage = animatedPercentages[choice] || 0;
                            const isCorrectAnswer = answerResult.answer.startsWith(`${choice}번`);
                            const isUserChoice = selectedAnswer === choice;
                            
                            return (
                              <div key={choice} className="flex items-center space-x-2 sm:space-x-3">
                                <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm ${
                                  isCorrectAnswer 
                                    ? 'bg-green-500 text-white' 
                                    : isUserChoice 
                                      ? 'bg-red-500 text-white'
                                      : 'bg-gray-300 text-gray-700'
                                }`}>
                                  {choice}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                                      {choice}번 {isCorrectAnswer && '(정답)'} {isUserChoice && '(내 선택)'}
                                    </span>
                                    <span className="text-xs sm:text-sm font-bold text-gray-900">{actualPercentage}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                                    <div 
                                      className={`h-1.5 sm:h-2 rounded-full transition-all duration-1000 ease-out ${
                                        isCorrectAnswer 
                                          ? 'bg-green-500' 
                                          : isUserChoice 
                                            ? 'bg-red-500'
                                            : 'bg-gray-400'
                                      }`}
                                      style={{ width: `${animatedPercentage}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button - 제출 전에만 표시 */}
              {!isSubmitted && (
                <button
                  type="submit"
                  className="bg-gradient-to-r from-brand-500 to-brand-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 hover:from-brand-600 hover:to-brand-700 hover:scale-105 hover:shadow-lg"
                >
                  제출하기
                </button>
              )}
            </form>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default TodayQuizSection;