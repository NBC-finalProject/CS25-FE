import React, { useState } from "react";
import { WrongQuizDto } from "../types";

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
  setCurrentPage,
}) => {
  const [expandedQuizzes, setExpandedQuizzes] = useState<Set<number>>(
    new Set(),
  );

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
      <div className="py-8 text-center">
        <div className="border-brand-500 mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
        <p className="mt-4 text-gray-600">틀린 문제를 불러오는 중...</p>
      </div>
    );
  }

  if (
    !wrongQuizData ||
    !wrongQuizData.wrongQuizList ||
    wrongQuizData.wrongQuizList.length === 0
  ) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center sm:text-left">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-emerald-400 sm:mx-0">
          <svg
            className="h-8 w-8 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h4 className="mb-2 text-lg font-medium text-gray-900">완벽해요!</h4>
        <p className="text-gray-600">
          아직 틀린 문제가 없습니다. 계속 열심히 해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-left text-lg font-bold text-gray-900 sm:text-xl">
        틀린 문제 보기
      </h3>

      <div className="space-y-3">
        {wrongQuizData.wrongQuizList.map(
          (quiz: WrongQuizDto, index: number) => {
            const isExpanded = expandedQuizzes.has(index);
            return (
              <div
                key={index}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white"
              >
                {/* 토글 헤더 */}
                <button
                  onClick={() => toggleQuiz(index)}
                  className="flex w-full items-center justify-between px-3 py-3 transition-all duration-300 ease-in-out hover:bg-gray-50 hover:shadow-sm sm:px-4 sm:py-4"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-medium text-red-600 sm:h-6 sm:w-6 sm:text-sm">
                      {index + 1}
                    </div>
                    <span className="truncate text-left text-sm font-medium text-gray-900 sm:text-base">
                      {quiz.question}
                    </span>
                  </div>
                  <svg
                    className={`ml-2 h-4 w-4 flex-shrink-0 text-gray-400 transition-all duration-500 ease-in-out sm:h-5 sm:w-5 ${isExpanded ? "text-brand-500 rotate-180" : "rotate-0"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* 토글 콘텐츠 */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isExpanded
                      ? "max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div
                    className={`transform border-t border-gray-100 px-3 pb-3 transition-all duration-300 sm:px-4 sm:pb-4 ${
                      isExpanded ? "translate-y-0" : "-translate-y-2"
                    }`}
                  >
                    <div className="space-y-3 pt-3 sm:space-y-4 sm:pt-4">
                      {/* 내 답안 */}
                      <div className="flex flex-col gap-1 text-left sm:flex-row sm:items-start sm:gap-3">
                        <span className="min-w-fit text-left text-sm font-bold text-red-600 sm:text-base">
                          내 답안:
                        </span>
                        <span className="break-words text-left text-sm font-semibold text-gray-900 sm:text-base">
                          {quiz.userAnswer?.replace(/\.(?=\S)/g, ". ")}
                        </span>
                      </div>

                      {/* 정답 */}
                      <div className="flex flex-col gap-1 text-left sm:flex-row sm:items-start sm:gap-3">
                        <span className="text-brand-600 min-w-fit text-left text-sm font-bold sm:text-base">
                          정답:
                        </span>
                        <span className="break-words text-left text-sm font-semibold text-gray-900 sm:text-base">
                          {quiz.answer?.replace(/\.(?=\S)/g, ". ")}
                        </span>
                      </div>

                      {/* 해설 */}
                      {quiz.commentary && (
                        <div className="mt-3 border-t border-gray-200 pt-3 text-left sm:mt-4 sm:pt-4">
                          <div className="flex flex-col gap-1 text-left sm:flex-row sm:items-start sm:gap-3">
                            <span className="text-brand-600 min-w-fit text-left text-sm font-bold sm:text-base">
                              해설:
                            </span>
                            <p className="break-words text-left text-sm font-medium leading-relaxed text-gray-700 sm:text-base">
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
          },
        )}

        {/* 페이지네이션 */}
        {wrongQuizData && wrongQuizData.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center space-x-2">
            {/* 이전 버튼 */}
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={!wrongQuizData.hasPrevious}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                wrongQuizData.hasPrevious
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "cursor-not-allowed bg-gray-50 text-gray-400"
              }`}
            >
              이전
            </button>

            {/* 페이지 번호들 */}
            {Array.from({ length: wrongQuizData.totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  currentPage === i
                    ? "bg-brand-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}

            {/* 다음 버튼 */}
            <button
              onClick={() =>
                setCurrentPage(
                  Math.min(wrongQuizData.totalPages - 1, currentPage + 1),
                )
              }
              disabled={!wrongQuizData.hasNext}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                wrongQuizData.hasNext
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "cursor-not-allowed bg-gray-50 text-gray-400"
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
