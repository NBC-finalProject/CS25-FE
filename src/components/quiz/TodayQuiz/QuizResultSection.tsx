import React from 'react';
import { QuizData, AnswerResult } from './types';

interface QuizResultSectionProps {
  quiz: QuizData;
  answerResult: AnswerResult;
  isAiFeedbackLoading: boolean;
  feedbackResult: string;
  resultChars: string[];
  feedbackContent: string;
  feedbackChars: string[];
  streamingFeedback: string;
  isStreamingComplete: boolean;
  isCorrectFromAI: boolean | null;
}

const QuizResultSection: React.FC<QuizResultSectionProps> = ({
  quiz,
  answerResult,
  isAiFeedbackLoading,
  feedbackResult,
  resultChars,
  feedbackContent,
  feedbackChars,
  streamingFeedback,
  isStreamingComplete,
  isCorrectFromAI
}) => {
  return (
    <div className="max-w-4xl mx-auto mb-8">
      {/* 정답/오답 메시지 - 객관식에만 표시 */}
      {quiz?.quizType === 'MULTIPLE_CHOICE' && (
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
        {quiz?.quizType === 'MULTIPLE_CHOICE' && (
          <div className="p-4 bg-brand-50 rounded-xl mb-6">
            <p className="text-brand-800 font-medium">
              정답: <span className="font-bold">{answerResult.answer.match(/^(\d+번)/)?.[1]}</span>{answerResult.answer.replace(/^\d+번/, '')}
            </p>
          </div>
        )}
        
        {/* 모범답안 표시 (주관식, 서술형) */}
        {(quiz?.quizType === 'SHORT_ANSWER' || quiz?.quizType === 'SUBJECTIVE') && (
          <div className="p-4 bg-green-50 rounded-xl mb-6">
            <h4 className="text-lg font-bold text-gray-900 mb-2">모범답안</h4>
            <p className="text-green-800 font-medium leading-relaxed">
              {answerResult.answer}
            </p>
          </div>
        )}

        {/* AI 피드백 표시 (서술형만) */}
        {quiz?.quizType === 'SUBJECTIVE' && (
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
      </div>
    </div>
  );
};

export default QuizResultSection;