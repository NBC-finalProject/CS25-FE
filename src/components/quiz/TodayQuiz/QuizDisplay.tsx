import React from 'react';
import { getMainCategoryLabel, getSubCategoryLabel } from '../../../utils/categoryUtils';
import { QuizData } from './types';

interface QuizDisplayProps {
  quiz: QuizData;
  totalCount?: number;
  isDuplicateAnswer?: boolean;
}

const QuizDisplay: React.FC<QuizDisplayProps> = ({ 
  quiz, 
  totalCount,
  isDuplicateAnswer = false 
}) => {
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
    <div className="text-center max-w-3xl mx-auto mb-12">
      <div className="inline-flex items-center bg-brand-100 rounded-full px-6 py-2 mb-8">
        <span className="text-sm font-medium text-brand-700">오늘의 CS 문제</span>
      </div>
      
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
        AI가 준비한 <span className="bg-gradient-to-r from-brand-600 to-navy-600 bg-clip-text text-transparent">오늘의 문제</span>
      </h2>
      
      <p className="text-lg text-gray-600 leading-relaxed mb-8">
        매일 새로운 CS 지식을 확인하고 실력을 향상시켜보세요
      </p>

      {/* Total Count */}
      {totalCount && (
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="inline-flex items-center bg-blue-100 rounded-full px-4 py-2">
            <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm font-medium text-blue-700">
              총 {totalCount}명이 이 문제를 풀었습니다
            </span>
          </div>
        </div>
      )}

      {/* Question Box */}
      <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 sm:p-6 text-base sm:text-lg font-medium text-gray-800 mb-8 max-w-4xl mx-auto text-left">
        <div className="mb-4">
          <strong className="block leading-relaxed">Q. {quiz?.question}</strong>
        </div>
        
        {/* 카테고리 & 난이도 표시 */}
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {quiz?.category?.main && (
            <div className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {getMainCategoryLabel(quiz.category.main)}
            </div>
          )}
          {quiz?.category?.sub && (
            <div className="bg-purple-100 text-purple-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {getSubCategoryLabel(quiz.category.sub)}
            </div>
          )}
          {quiz?.quizLevel && (
            <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getDifficultyDisplay(quiz.quizLevel).color}`}>
              {getDifficultyDisplay(quiz.quizLevel).label}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizDisplay;