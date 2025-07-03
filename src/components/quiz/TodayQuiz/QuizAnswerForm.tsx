import React from 'react';
import { QuizData } from './types';

interface QuizAnswerFormProps {
  quiz: QuizData;
  selectedAnswer: number | null;
  subjectiveAnswer: string;
  isSubmitted: boolean;
  onOptionClick: (value: number) => void;
  onSubjectiveChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const QuizAnswerForm: React.FC<QuizAnswerFormProps> = ({
  quiz,
  selectedAnswer,
  subjectiveAnswer,
  isSubmitted,
  onOptionClick,
  onSubjectiveChange,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit}>
      {/* 객관식 문제 */}
      {quiz?.quizType === 'MULTIPLE_CHOICE' && (
        <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto mb-8">
          {[quiz?.choice1, quiz?.choice2, quiz?.choice3, quiz?.choice4].map((choice, index) => {
            const isSelected = selectedAnswer === index + 1;
            const optionNumber = index + 1;
            
            // 앞의 "1. 2. 3. 4." 숫자 부분만 제거
            const displayChoice = choice ? choice.replace(/^\d+\.\s*/, '') : '';
            
            return (
              <div
                key={index}
                onClick={() => onOptionClick(index + 1)}
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
      {quiz?.quizType === 'SHORT_ANSWER' && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 p-4 sm:p-6">
            <label htmlFor="short-answer" className="block text-base sm:text-lg font-medium text-gray-900 mb-4">
              답안을 입력해주세요
            </label>
            <input
              type="text"
              id="short-answer"
              value={subjectiveAnswer}
              onChange={(e) => onSubjectiveChange(e.target.value)}
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
      {quiz?.quizType === 'SUBJECTIVE' && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 p-4 sm:p-6">
            <label htmlFor="subjective-answer" className="block text-base sm:text-lg font-medium text-gray-900 mb-4">
              답안을 입력해주세요
            </label>
            <textarea
              id="subjective-answer"
              value={subjectiveAnswer}
              onChange={(e) => onSubjectiveChange(e.target.value)}
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
  );
};

export default QuizAnswerForm;