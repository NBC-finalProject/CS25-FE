import React, { useState, useRef, useEffect } from 'react';
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
    sub: "SoftwareDesign"
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
  const [streamingFeedback, setStreamingFeedback] = useState<string>('');
  const [feedbackResult, setFeedbackResult] = useState<string>('');
  const [feedbackContent, setFeedbackContent] = useState<string>('');
  const [isStreamingComplete, setIsStreamingComplete] = useState(false);
  const [isCorrectFromAI, setIsCorrectFromAI] = useState<boolean | null>(null);
  const [resultChars, setResultChars] = useState<string[]>([]);
  const [feedbackChars, setFeedbackChars] = useState<string[]>([]);
  const { openModal } = useModal();
  const sseConnectionRef = useRef<{ close: () => void } | null>(null);

  const subscriptionId = searchParams.get('subscriptionId');
  const quizId = searchParams.get('quizId');

  // SSE 연결 정리 - 컴포넌트 언마운트 시
  useEffect(() => {
    return () => {
      if (sseConnectionRef.current) {
        sseConnectionRef.current.close();
        sseConnectionRef.current = null;
      }
    };
  }, []);

  // 결과 텍스트를 글자별로 분리하고 애니메이션 적용
  React.useEffect(() => {
    if (!feedbackResult) {
      setResultChars([]);
      return;
    }

    // 3초 후에 글자별 애니메이션 시작
    const initialDelay = setTimeout(() => {
      // 마침표 후에 줄바꿈 추가하여 텍스트 처리
      const processedText = feedbackResult.replace(/\./g, '.\n');
      const chars = processedText.split('');
      setResultChars(chars);
    }, 3000);

    return () => clearTimeout(initialDelay);
  }, [feedbackResult]);

  // 피드백 텍스트를 글자별로 분리하고 애니메이션 적용
  React.useEffect(() => {
    if (!feedbackContent || resultChars.length === 0) {
      setFeedbackChars([]);
      return;
    }

    // 결과 부분이 완료된 후 1초 후에 피드백 애니메이션 시작
    const timer = setTimeout(() => {
      // 마침표 후에 줄바꿈 추가하여 텍스트 처리
      const processedText = feedbackContent.replace(/\./g, '.\n');
      const chars = processedText.split('');
      setFeedbackChars(chars);
    }, 1000);

    return () => clearTimeout(timer);
  }, [feedbackContent, resultChars.length]);

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

    // 서술형인 경우 답안 확인 FIXME: 주관식은 일단 제외)
    // if ((displayQuiz?.quizType === 'SHORT_ANSWER' || displayQuiz?.quizType === 'SUBJECTIVE') && subjectiveAnswer.trim() === '') {
    if ((displayQuiz?.quizType === 'SHORT_ANSWER' || displayQuiz?.quizType === 'SUBJECTIVE') && subjectiveAnswer.trim() === '') {  
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
        let submitAnswer: string;
        if (displayQuiz.quizType === 'MULTIPLE_CHOICE') {
          // 객관식: 선택한 옵션의 전체 텍스트를 전달
          const selectedChoiceKey = `choice${selectedAnswer}` as keyof QuizData;
          const selectedChoiceText = displayQuiz[selectedChoiceKey] as string;
          submitAnswer = selectedChoiceText || `${selectedAnswer}번`;
        } else {
          submitAnswer = subjectiveAnswer;
        }
        const submitResponse = await quizAPI.submitTodayQuizAnswer(quizId, submitAnswer, subscriptionId);
        
        // submitResponse에서 userQuizAnswerId 추출 (모든 타입에서 공통)
        let userQuizAnswerId: string;
        
        if (submitResponse && typeof submitResponse === 'object') {
          if ('data' in submitResponse && submitResponse.data) {
            userQuizAnswerId = (submitResponse.data as any).toString();
          } else if ('userQuizAnswerId' in submitResponse) {
            userQuizAnswerId = (submitResponse as any).userQuizAnswerId.toString();
          } else {
            userQuizAnswerId = (submitResponse as any).toString();
          }
        } else {
          userQuizAnswerId = (submitResponse as any).toString();
        }

        // 모든 타입에서 평가 API 호출
        try {
          await quizAPI.evaluateQuizAnswer(userQuizAnswerId);
        } catch (evaluateError) {
          console.error('답안 평가 요청 실패:', evaluateError);
          // 평가 API 실패해도 계속 진행
        }
        
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
        } else if (displayQuiz.quizType === 'SHORT_ANSWER') {
          // 주관식: 평가 API 호출하여 정답/오답 확인
          setIsSubmitted(true);
          
          try {
            // 평가 API 호출하여 정답/오답 결과 받기
            const evaluateResponse = await quizAPI.evaluateQuizAnswer(userQuizAnswerId);
            
            // 평가 응답에서 결과 추출
            let evaluateData;
            if (evaluateResponse && typeof evaluateResponse === 'object') {
              evaluateData = ('data' in evaluateResponse) ? evaluateResponse.data : evaluateResponse;
            } else {
              evaluateData = evaluateResponse;
            }
            
            // 평가 결과로 결과 설정
            const result: AnswerResult = {
              isCorrect: (evaluateData as any)?.isCorrect || false,
              answer: (evaluateData as any)?.answer || displayQuiz.answer || '',
              commentary: (evaluateData as any)?.commentary || displayQuiz.commentary
            };
            
            setAnswerResult(result);
          } catch (evaluateError) {
            console.error('주관식 답안 평가 실패:', evaluateError);
            
            // 평가 API 실패 시 기본값으로 처리
            const fallbackResult: AnswerResult = {
              isCorrect: false,
              answer: displayQuiz.answer || '',
              commentary: displayQuiz.commentary
            };
            
            setAnswerResult(fallbackResult);
          }
        } else if (displayQuiz.quizType === 'SUBJECTIVE') {
          // 서술형: AI 피드백 있음
          // 먼저 기본 결과 표시 (AI 피드백 없이)
          const initialResult: AnswerResult = {
            isCorrect: false, // 일단 false로 설정, AI 피드백에서 업데이트
            answer: displayQuiz.answer || '',
            commentary: displayQuiz.commentary
          };
          
          setAnswerResult(initialResult);
          setIsSubmitted(true);
          setIsAiFeedbackLoading(true);
          setStreamingFeedback('AI 응답 대기 중...');
          
          
          try {
            // SSE를 통한 AI 피드백 스트리밍
            setStreamingFeedback('');
            setFeedbackResult('');
            setFeedbackContent('');
            setIsStreamingComplete(false);
            setIsCorrectFromAI(null);
            setResultChars([]);
            setFeedbackChars([]);
            
            // 기존 연결이 있다면 먼저 정리
            if (sseConnectionRef.current) {
              sseConnectionRef.current.close();
              sseConnectionRef.current = null;
            }

            const sseConnection = quizAPI.streamAiFeedback(
                userQuizAnswerId,
                // onData: 스트리밍 데이터 수신
                (data: string) => {
                // 받은 데이터 로깅 (디버깅용)
                console.log('받은 SSE 데이터:', JSON.stringify(data));
                
                setStreamingFeedback(prev => {
                  // 첫 번째 데이터가 오면 "AI 응답 대기 중..." 제거
                  let currentText = prev;
                  if (prev === 'AI 응답 대기 중...') {
                    currentText = '';
                  }
                  
                  const newText = currentText + data;
                  
                  // '정답:' 또는 '오답:' 부분과 '피드백:' 부분 실시간 파싱
                  if (newText.includes('정답:') || newText.includes('오답:')) {
                    // 정답/오답 여부 즉시 설정
                    if (newText.includes('정답:') && isCorrectFromAI === null) {
                      setIsCorrectFromAI(true);
                    } else if (newText.includes('오답:') && isCorrectFromAI === null) {
                      setIsCorrectFromAI(false);
                    }
                    
                    // 피드백 구분자 찾기
                    const feedbackIndex = newText.indexOf('피드백:');
                    
                    if (feedbackIndex === -1) {
                      // 피드백 부분이 아직 안 나옴 - 결과 부분만 업데이트
                      const resultText = newText.replace(/^(정답:|오답:)\s*/, '').trim();
                      setFeedbackResult(resultText);
                    } else {
                      // 피드백 부분이 나옴 - 결과와 피드백 분리
                      const resultPart = newText.substring(0, feedbackIndex).replace(/^(정답:|오답:)\s*/, '').trim();
                      const feedbackPart = newText.substring(feedbackIndex + 3).trim(); // '피드백:' 이후
                      
                      setFeedbackResult(resultPart);
                      setFeedbackContent(feedbackPart);
                    }
                  }
                  
                  return newText;
                });
              },
              // onComplete: 스트리밍 완료
              () => {
                console.log('AI 피드백 스트리밍 완료');
                setIsStreamingComplete(true);
                setIsAiFeedbackLoading(false);
                
                // 최종 결과 업데이트
                const updatedResult: AnswerResult = {
                  isCorrect: streamingFeedback.startsWith('정답:'),
                  answer: displayQuiz.answer || '',
                  commentary: displayQuiz.commentary,
                  aiFeedback: streamingFeedback
                };
                
                setAnswerResult(updatedResult);
              },
              // onError: 에러 처리
              (error: Event) => {
                console.error('AI 피드백 스트리밍 실패:', error);
                
                const errorResult: AnswerResult = {
                  isCorrect: false,
                  answer: displayQuiz.answer || '',
                  commentary: displayQuiz.commentary,
                  aiFeedback: 'AI 피드백을 가져오는데 실패했습니다.'
                };
                
                setAnswerResult(errorResult);
                setIsAiFeedbackLoading(false);
              }
            );
            
            // SSE 연결을 ref에 저장하여 나중에 정리할 수 있도록 함
            sseConnectionRef.current = sseConnection;
          } catch (feedbackError) {
            console.error('AI 피드백 요청 실패:', feedbackError);
            
            const errorResult: AnswerResult = {
              isCorrect: false,
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
        if (error?.status) {
          const errorMessage = error?.response.data.message || '잘못된 요청입니다. 답안 제출에 실패했습니다.';
          
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
          // 주관식/단답형의 경우
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
              <div className="mb-4">
                <strong className="block leading-relaxed">Q. {displayQuiz?.question}</strong>
              </div>
              {/* 카테고리 & 난이도 표시 - 질문 아래 */}
              <div className="flex flex-wrap gap-1 sm:gap-2">
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
              {displayQuiz?.quizType === 'SHORT_ANSWER' && (
                <div className="max-w-4xl mx-auto mb-8">
                  <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 p-4 sm:p-6">
                    <label htmlFor="short-answer" className="block text-base sm:text-lg font-medium text-gray-900 mb-4">
                      답안을 입력해주세요
                    </label>
                    <input
                      type="text"
                      id="short-answer"
                      value={subjectiveAnswer}
                      onChange={(e) => setSubjectiveAnswer(e.target.value)}
                      disabled={isSubmitted}
                      className={`w-full p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl text-base sm:text-lg leading-relaxed transition-all duration-300 ${
                        isSubmitted 
                          ? 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'
                          : 'border-gray-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 focus:outline-none'
                      }`}
                      placeholder="짧은 답안을 입력하세요..."
                    />
                  </div>
                </div>
              )}

              {/* 서술형 문제 */}
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
                  {/* 정답/오답 메시지 - 객관식, 주관식에 표시 FIXME: 주관식은 일단 제외)*/}
                  {(displayQuiz?.quizType === 'MULTIPLE_CHOICE') && (
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
                    
                    {/* 모범답안 표시 (주관식, 서술형) */}
                    {(displayQuiz?.quizType === 'SHORT_ANSWER' || displayQuiz?.quizType === 'SUBJECTIVE') && (
                      <div className="p-4 bg-green-50 rounded-xl mb-6">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">모범답안</h4>
                        <p className="text-green-800 font-medium leading-relaxed">
                          {answerResult.answer}
                        </p>
                      </div>
                    )}

                    {/* AI 피드백 표시 (서술형만) */}
                    {displayQuiz?.quizType === 'SUBJECTIVE' && (
                      <div className="p-4 bg-blue-50 rounded-xl mb-6">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">AI 피드백</h4>
                        {(isAiFeedbackLoading && !feedbackResult) || (feedbackResult && resultChars.length === 0) ? (
                          <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                            <p className="text-blue-700">
                              {!feedbackResult ? 'AI가 피드백을 생성하고 있습니다...' : 'AI 피드백을 준비하고 있습니다...'}
                            </p>
                          </div>
                        ) : (
                          <div>
                            {/* 정답/오답 결과 배지 */}
                            {isCorrectFromAI !== null && (
                              <div className={`inline-flex items-center rounded-full px-4 py-2 mb-3 animate-reveal-down ${
                                isCorrectFromAI ? 'bg-green-100' : 'bg-red-100'
                              }`}>
                                <span className={`text-sm font-bold animate-text-reveal-up ${
                                  isCorrectFromAI ? 'text-green-700' : 'text-red-700'
                                }`}>
                                  {isCorrectFromAI ? '🎉 정답입니다!' : '❌ 틀렸습니다!'}
                                </span>
                              </div>
                            )}
                            
                            {/* 결과 설명 */}
                            {resultChars.length > 0 && (
                              <div className={`p-3 rounded-lg mb-3 animate-reveal-up ${
                                isCorrectFromAI ? 'bg-green-50' : 'bg-red-50'
                              }`}>
                                <p className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${
                                  isCorrectFromAI ? 'text-green-800' : 'text-red-800'
                                }`}>
                                  <span className="font-semibold animate-text-reveal-down">
                                    {isCorrectFromAI ? '정답: ' : '오답: '}
                                  </span>
                                  {resultChars.map((char, index) => {
                                    if (char === '\n') {
                                      return <br key={`result-br-${index}`} />;
                                    }
                                    return (
                                      <span
                                        key={`result-${index}`}
                                        className="inline-block opacity-0"
                                        style={{
                                          animation: `wave-reveal 0.6s cubic-bezier(0.18,0.89,0.82,1.04) forwards`,
                                          animationDelay: `${index * 50}ms`,
                                          wordSpacing: '0.25em',
                                          letterSpacing: '0.02em'
                                        }}
                                      >
                                        {char}
                                      </span>
                                    );
                                  })}
                                </p>
                              </div>
                            )}
                            
                            {/* 피드백 내용 - 결과 부분이 완료된 후에만 표시 */}
                            {feedbackChars.length > 0 && (
                              <div className="p-3 bg-blue-50 rounded-lg animate-reveal-up">
                                <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-wrap break-words">
                                  <span className="font-semibold animate-text-reveal-down">
                                    피드백
                                  </span>
                                  {feedbackChars.map((char, index) => {
                                    if (char === '\n') {
                                      return <br key={`feedback-br-${index}`} />;
                                    }
                                    return (
                                      <span
                                        key={`feedback-${index}`}
                                        className="inline-block opacity-0"
                                        style={{
                                          animation: `wave-reveal 0.6s cubic-bezier(0.18,0.89,0.82,1.04) forwards`,
                                          animationDelay: `${index * 50}ms`,
                                          wordSpacing: '0.25em',
                                          letterSpacing: '0.02em'
                                        }}
                                      >
                                        {char}
                                      </span>
                                    );
                                  })}
                                </p>
                              </div>
                            )}

                            {/* 스트리밍 중인 전체 텍스트 (파싱되지 않은 경우) */}
                            {streamingFeedback && !feedbackResult && !feedbackContent && streamingFeedback !== 'AI 응답 대기 중...' && (
                              <div className="p-3 bg-blue-50 rounded-lg">
                                <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-wrap break-words">
                                  <span style={{ wordSpacing: '0.25em', letterSpacing: '0.02em' }}>
                                    {streamingFeedback}
                                  </span>
                                  {!isStreamingComplete && (
                                    <span className="animate-pulse text-blue-600 ml-1">▊</span>
                                  )}
                                </p>
                              </div>
                            )}
                          </div>
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