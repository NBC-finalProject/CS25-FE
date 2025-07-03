import { useState, useRef } from 'react';
import { quizAPI } from '../../../../utils/api';
import { QuizData, AnswerResult } from '../types';

export const useQuizSubmission = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [isDuplicateAnswer, setIsDuplicateAnswer] = useState<boolean>(false);
  const [isAiFeedbackLoading, setIsAiFeedbackLoading] = useState(false);
  const [streamingFeedback, setStreamingFeedback] = useState<string>('');
  const [feedbackResult, setFeedbackResult] = useState<string>('');
  const [feedbackContent, setFeedbackContent] = useState<string>('');
  const [isStreamingComplete, setIsStreamingComplete] = useState(false);
  const [isCorrectFromAI, setIsCorrectFromAI] = useState<boolean | null>(null);
  const [resultChars, setResultChars] = useState<string[]>([]);
  const [feedbackChars, setFeedbackChars] = useState<string[]>([]);
  const sseConnectionRef = useRef<{ close: () => void } | null>(null);

  const submitAnswer = async (
    quizId: string, 
    subscriptionId: string, 
    displayQuiz: QuizData, 
    selectedAnswer: number | null, 
    subjectiveAnswer: string,
    openModal: any
  ) => {
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
      
      // 응답에서 UserQuizAnswerResponseDto 추출
      let responseData;
      if (submitResponse && typeof submitResponse === 'object') {
        responseData = ('data' in submitResponse) ? submitResponse.data : submitResponse;
      } else {
        responseData = submitResponse;
      }

      // 중복 답변 체크
      if ((responseData as any)?.duplicated) {
        // 중복 답변 상태 설정
        setIsDuplicateAnswer(true);
        
        // 중복 답변인 경우 모달 표시하고 기존 답안 결과 보여주기
        openModal({
          title: '이미 답변한 문제입니다',
          content: '이전에 답변한 내용을 확인해보세요!',
          size: 'sm'
        });
        
        // 중복 답변인 경우 기존 답안 결과 표시
        const duplicateResult: AnswerResult = {
          isCorrect: (responseData as any)?.correct || false,
          answer: (responseData as any)?.answer || displayQuiz.answer || '',
          commentary: (responseData as any)?.commentary || displayQuiz.commentary,
          aiFeedback: (responseData as any)?.aiFeedback
        };
        
        setAnswerResult(duplicateResult);
        setIsSubmitted(true);
        
        // 서술형 문제이고 aiFeedback이 있는 경우 파싱해서 표시
        if (displayQuiz.quizType === 'SUBJECTIVE' && duplicateResult.aiFeedback) {
          const feedback = duplicateResult.aiFeedback;
          
          // '정답:' 또는 '오답:' 부분과 '피드백:' 부분 파싱
          if (feedback.includes('정답:') || feedback.includes('오답:')) {
            // 정답/오답 여부 설정
            if (feedback.includes('정답:')) {
              setIsCorrectFromAI(true);
            } else if (feedback.includes('오답:')) {
              setIsCorrectFromAI(false);
            }
            
            // 피드백 구분자 찾기
            const feedbackIndex = feedback.indexOf('피드백:');
            
            if (feedbackIndex === -1) {
              // 피드백 부분이 없음 - 결과 부분만
              const resultText = feedback.replace(/^(정답:|오답:)\s*/, '').trim();
              setFeedbackResult(resultText);
            } else {
              // 피드백 부분이 있음 - 결과와 피드백 분리
              const resultPart = feedback.substring(0, feedbackIndex).replace(/^(정답:|오답:)\s*/, '').trim();
              const feedbackPart = feedback.substring(feedbackIndex + 3).trim(); // '피드백:' 이후
              
              setFeedbackResult(resultPart);
              setFeedbackContent(feedbackPart);
            }
          }
          setIsStreamingComplete(true);
        }
        
        return { isDuplicate: true, responseData };
      }
      
      // responseData에서 userQuizAnswerId 추출 (모든 타입에서 공통)
      const userQuizAnswerId = (responseData as any)?.userQuizAnswerId?.toString() || '';
      
      if (displayQuiz.quizType === 'MULTIPLE_CHOICE') {
        // 객관식: evaluate API로 정답/오답 확인
        try {
          const evaluateResponse = await quizAPI.evaluateQuizAnswer(userQuizAnswerId);
          
          // 평가 응답에서 결과 추출
          let evaluateData;
          if (evaluateResponse && typeof evaluateResponse === 'object') {
            evaluateData = ('data' in evaluateResponse) ? evaluateResponse.data : evaluateResponse;
          } else {
            evaluateData = evaluateResponse;
          }
          
          const result: AnswerResult = {
            isCorrect: (evaluateData as any)?.correct || false,
            answer: (evaluateData as any)?.answer || displayQuiz.answer || '',
            commentary: (evaluateData as any)?.commentary || displayQuiz.commentary
          };
          
          setAnswerResult(result);
          setIsSubmitted(true);
        } catch (evaluateError) {
          console.error('객관식 답안 평가 실패:', evaluateError);
          
          // 평가 API 실패 시 응답 데이터 사용
          const fallbackResult: AnswerResult = {
            isCorrect: (responseData as any)?.correct || false,
            answer: (responseData as any)?.answer || displayQuiz.answer || '',
            commentary: (responseData as any)?.commentary || displayQuiz.commentary
          };
          
          setAnswerResult(fallbackResult);
          setIsSubmitted(true);
        }
      } else if (displayQuiz.quizType === 'SHORT_ANSWER') {
        // 주관식: evaluate API로 정답/오답 확인
        try {
          const evaluateResponse = await quizAPI.evaluateQuizAnswer(userQuizAnswerId);
          
          // 평가 응답에서 결과 추출
          let evaluateData;
          if (evaluateResponse && typeof evaluateResponse === 'object') {
            evaluateData = ('data' in evaluateResponse) ? evaluateResponse.data : evaluateResponse;
          } else {
            evaluateData = evaluateResponse;
          }
          
          const result: AnswerResult = {
            isCorrect: (evaluateData as any)?.correct || false,
            answer: (evaluateData as any)?.answer || displayQuiz.answer || '',
            commentary: (evaluateData as any)?.commentary || displayQuiz.commentary
          };
          
          setAnswerResult(result);
          setIsSubmitted(true);
        } catch (evaluateError) {
          console.error('주관식 답안 평가 실패:', evaluateError);
          
          // 평가 API 실패 시 응답 데이터 사용
          const fallbackResult: AnswerResult = {
            isCorrect: (responseData as any)?.correct || false,
            answer: (responseData as any)?.answer || displayQuiz.answer || '',
            commentary: (responseData as any)?.commentary || displayQuiz.commentary
          };
          
          setAnswerResult(fallbackResult);
          setIsSubmitted(true);
        }
      } else if (displayQuiz.quizType === 'SUBJECTIVE') {
        // 서술형: 응답 데이터로 초기 결과 설정 후 AI 피드백
        const initialResult: AnswerResult = {
          isCorrect: (responseData as any)?.correct || false,
          answer: (responseData as any)?.answer || displayQuiz.answer || '',
          commentary: (responseData as any)?.commentary || displayQuiz.commentary
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
      
      return { isDuplicate: false, responseData };
    } catch (error: any) {
      console.error('답안 제출 실패:', error);
      throw error;
    }
  };

  const cleanup = () => {
    if (sseConnectionRef.current) {
      sseConnectionRef.current.close();
      sseConnectionRef.current = null;
    }
  };

  return {
    isSubmitted,
    answerResult,
    isDuplicateAnswer,
    isAiFeedbackLoading,
    streamingFeedback,
    feedbackResult,
    feedbackContent,
    isStreamingComplete,
    isCorrectFromAI,
    resultChars,
    feedbackChars,
    setResultChars,
    setFeedbackChars,
    submitAnswer,
    cleanup
  };
};