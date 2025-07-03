import React, { useState } from 'react';
import { WrongQuizDto } from '../types';

interface WrongQuizData {
  wrongQuizList: WrongQuizDto[];
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  totalPages: number;
}

interface WrongQuizTabProps {
  wrongQuizData: WrongQuizData | undefined;
  wrongQuizLoading: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const WrongQuizTab: React.FC<WrongQuizTabProps> = ({ 
  wrongQuizData, 
  wrongQuizLoading, 
  currentPage, 
  setCurrentPage 
}) => {
  const [expandedQuizzes, setExpandedQuizzes] = useState<Set<number>>(new Set());

  // 토글 함수
  const toggleQuiz = (index: number) => {
    const newExpanded = new Set(expandedQuizzes);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQuizzes(newExpanded);
  };

  if (wrongQuizLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">틀린 문제를 불러오는 중...</p>
      </div>
    );
  }

  if (!wrongQuizData || !wrongQuizData.wrongQuizList || wrongQuizData.wrongQuizList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center sm:text-left py-12">
        <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto sm:mx-0 mb-4">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h4 className="text-lg font-medium text-gray-900 mb-2">완벽해요!</h4>
        <p className="text-gray-600">아직 틀린 문제가 없습니다. 계속 열심히 해보세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-left">틀린 문제 보기</h3>
      
      <div className="space-y-3">
        {wrongQuizData.wrongQuizList.map((quiz: WrongQuizDto, index: number) => {
          const isExpanded = expandedQuizzes.has(index);
          return (
            <div key={index} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
              {/* 토글 헤더 */}
              <button
                onClick={() => toggleQuiz(index)}
                className="w-full px-3 py-3 sm:px-4 sm:py-4 flex items-center justify-between hover:bg-gray-50 transition-all duration-300 ease-in-out hover:shadow-sm"
              >
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-left text-gray-900 font-medium text-sm sm:text-base truncate">
                    {quiz.question}
                  </span>
                </div>
                <svg 
                  className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-all duration-500 ease-in-out flex-shrink-0 ml-2 ${isExpanded ? 'rotate-180 text-brand-500' : 'rotate-0'}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* 토글 콘텐츠 */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className={`px-3 pb-3 sm:px-4 sm:pb-4 border-t border-gray-100 transform transition-all duration-300 ${
                  isExpanded ? 'translate-y-0' : '-translate-y-2'
                }`}>
                  <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4">
                    {/* 내 답안 */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 text-left">
                      <span className="text-sm sm:text-base font-bold text-red-600 min-w-fit text-left">내 답안:</span>
                      <span className="text-sm sm:text-base text-gray-900 font-semibold break-words text-left">
                        {quiz.userAnswer?.replace(/\.(?=\S)/g, '. ')}
                      </span>
                    </div>
                    
                    {/* 정답 */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 text-left">
                      <span className="text-sm sm:text-base font-bold text-brand-600 min-w-fit text-left">정답:</span>
                      <span className="text-sm sm:text-base text-gray-900 font-semibold break-words text-left">
                        {quiz.answer?.replace(/\.(?=\S)/g, '. ')}
                      </span>
                    </div>
                    
                    {/* 해설 */}
                    {quiz.commentary && (
                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 text-left">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 text-left">
                          <span className="text-sm sm:text-base font-bold text-brand-600 min-w-fit text-left">해설:</span>
                          <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium break-words text-left">
                            {quiz.commentary}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* 페이지네이션 */}
        {wrongQuizData && wrongQuizData.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            {/* 이전 버튼 */}
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={!wrongQuizData.hasPrevious}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                wrongQuizData.hasPrevious
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
            >
              이전
            </button>

            {/* 페이지 번호들 */}
            {Array.from({ length: wrongQuizData.totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === i
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}

            {/* 다음 버튼 */}
            <button
              onClick={() => setCurrentPage(Math.min(wrongQuizData.totalPages - 1, currentPage + 1))}
              disabled={!wrongQuizData.hasNext}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                wrongQuizData.hasNext
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WrongQuizTab;