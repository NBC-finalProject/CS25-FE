import React from "react";
import { QuizData } from "./types";

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
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit}>
      {/* 객관식 문제 */}
      {quiz?.quizType === "MULTIPLE_CHOICE" && (
        <div className="mx-auto mb-8 max-w-4xl space-y-3 sm:space-y-4">
          {[quiz?.choice1, quiz?.choice2, quiz?.choice3, quiz?.choice4].map(
            (choice, index) => {
              const isSelected = selectedAnswer === index + 1;
              const optionNumber = index + 1;

              // 앞의 "1. 2. 3. 4." 숫자 부분만 제거
              const displayChoice = choice
                ? choice.replace(/^\d+\.\s*/, "")
                : "";

              return (
                <div
                  key={index}
                  onClick={() => onOptionClick(index + 1)}
                  className={`group relative transform overflow-hidden rounded-xl border-2 p-3 text-left transition-all duration-300 sm:rounded-2xl sm:p-5 ${
                    !isSubmitted
                      ? "cursor-pointer hover:scale-[1.01] hover:shadow-lg sm:hover:scale-[1.02]"
                      : ""
                  } ${
                    isSelected
                      ? "border-brand-500 from-brand-50 to-brand-100 bg-gradient-to-r shadow-md"
                      : "hover:border-brand-300 border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="relative flex items-center space-x-3 sm:space-x-4">
                    {/* Option Number with modern design */}
                    <div
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-base font-bold transition-all duration-300 sm:h-10 sm:w-10 sm:rounded-xl sm:text-lg ${
                        isSelected
                          ? "from-brand-500 to-brand-600 bg-gradient-to-br text-white shadow-md"
                          : "group-hover:from-brand-100 group-hover:to-brand-200 group-hover:text-brand-700 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600"
                      }`}
                    >
                      <span className="font-extrabold">{optionNumber}</span>
                    </div>

                    {/* Option Text */}
                    <div className="min-w-0 flex-1">
                      <span
                        className={`break-words text-sm font-medium leading-relaxed transition-colors duration-300 sm:text-base ${
                          isSelected
                            ? "text-brand-800"
                            : "text-gray-700 group-hover:text-gray-900"
                        }`}
                      >
                        {displayChoice}
                      </span>
                    </div>

                    {/* Selected Indicator */}
                    {isSelected && !isSubmitted && (
                      <div className="flex-shrink-0">
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-md sm:h-7 sm:w-7 sm:rounded-xl">
                          <svg
                            className="h-3 w-3 text-white sm:h-4 sm:w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hover Effect Border (제출 전에만) */}
                  {!isSubmitted && (
                    <div
                      className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                        isSelected
                          ? "opacity-0"
                          : "from-brand-500/5 to-navy-500/5 bg-gradient-to-r opacity-0 group-hover:opacity-100"
                      }`}
                    />
                  )}
                </div>
              );
            },
          )}
        </div>
      )}

      {/* 주관식 문제 */}
      {quiz?.quizType === "SHORT_ANSWER" && (
        <div className="mx-auto mb-8 max-w-4xl">
          <div className="rounded-xl border-2 border-gray-200 bg-white p-4 sm:rounded-2xl sm:p-6">
            <label
              htmlFor="short-answer"
              className="mb-4 block text-base font-medium text-gray-900 sm:text-lg"
            >
              답안을 입력해주세요
            </label>
            <input
              type="text"
              id="short-answer"
              value={subjectiveAnswer}
              onChange={(e) => onSubjectiveChange(e.target.value)}
              disabled={isSubmitted}
              className={`w-full rounded-lg border-2 p-3 text-base leading-relaxed transition-all duration-300 sm:rounded-xl sm:p-4 sm:text-lg ${
                isSubmitted
                  ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-600"
                  : "focus:border-brand-500 focus:ring-brand-100 border-gray-300 focus:outline-none focus:ring-4"
              }`}
              placeholder="짧은 답안을 입력하세요..."
            />
          </div>
        </div>
      )}

      {/* 서술형 문제 */}
      {quiz?.quizType === "SUBJECTIVE" && (
        <div className="mx-auto mb-8 max-w-4xl">
          <div className="rounded-xl border-2 border-gray-200 bg-white p-4 sm:rounded-2xl sm:p-6">
            <label
              htmlFor="subjective-answer"
              className="mb-4 block text-base font-medium text-gray-900 sm:text-lg"
            >
              답안을 입력해주세요
            </label>
            <textarea
              id="subjective-answer"
              value={subjectiveAnswer}
              onChange={(e) => onSubjectiveChange(e.target.value)}
              disabled={isSubmitted}
              className={`w-full resize-none rounded-lg border-2 p-3 text-base leading-relaxed transition-all duration-300 sm:rounded-xl sm:p-4 sm:text-lg ${
                isSubmitted
                  ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-600"
                  : "focus:border-brand-500 focus:ring-brand-100 border-gray-300 focus:outline-none focus:ring-4"
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
          className="from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 rounded-full bg-gradient-to-r px-6 py-2.5 text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg sm:px-8 sm:py-3 sm:text-lg"
        >
          제출하기
        </button>
      )}
    </form>
  );
};

export default QuizAnswerForm;
