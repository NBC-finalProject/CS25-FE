import React from "react";
import {
  getMainCategoryLabel,
  getSubCategoryLabel,
} from "../../../utils/categoryUtils";
import { QuizData } from "./types";

interface QuizDisplayProps {
  quiz: QuizData;
  totalCount?: number;
  isDuplicateAnswer?: boolean;
}

const QuizDisplay: React.FC<QuizDisplayProps> = ({
  quiz,
  totalCount,
  isDuplicateAnswer = false,
}) => {
  // 난이도 표시 함수
  const getDifficultyDisplay = (level: string) => {
    switch (level) {
      case "EASY":
        return { label: "쉬움", color: "bg-green-100 text-green-800" };
      case "NORMAL":
        return { label: "보통", color: "bg-yellow-100 text-yellow-800" };
      case "HARD":
        return { label: "어려움", color: "bg-red-100 text-red-800" };
      default:
        return { label: "보통", color: "bg-gray-100 text-gray-800" };
    }
  };

  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <div className="bg-brand-100 mb-8 inline-flex items-center rounded-full px-6 py-2">
        <span className="text-brand-700 text-sm font-medium">
          오늘의 CS 문제
        </span>
      </div>

      <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
        AI가 준비한{" "}
        <span className="from-brand-600 to-navy-600 bg-gradient-to-r bg-clip-text text-transparent">
          오늘의 문제
        </span>
      </h2>

      <p className="mb-8 text-lg leading-relaxed text-gray-600">
        매일 새로운 CS 지식을 확인하고 실력을 향상시켜보세요
      </p>

      {/* Total Count */}
      {totalCount && (
        <div className="mb-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2">
            <svg
              className="mr-2 h-4 w-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="text-sm font-medium text-blue-700">
              총 {totalCount}명이 이 문제를 풀었습니다
            </span>
          </div>
        </div>
      )}

      {/* Question Box */}
      <div className="bg-brand-50 border-brand-200 mx-auto mb-8 max-w-4xl rounded-xl border p-4 text-left text-base font-medium text-gray-800 sm:p-6 sm:text-lg">
        <div className="mb-4">
          <strong className="block leading-relaxed">Q. {quiz?.question}</strong>
        </div>

        {/* 카테고리 & 난이도 표시 */}
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {quiz?.category?.main && (
            <div className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 sm:px-3 sm:text-sm">
              {getMainCategoryLabel(quiz.category.main)}
            </div>
          )}
          {quiz?.category?.sub && (
            <div className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 sm:px-3 sm:text-sm">
              {getSubCategoryLabel(quiz.category.sub)}
            </div>
          )}
          {quiz?.quizLevel && (
            <div
              className={`rounded-full px-2 py-1 text-xs font-medium sm:px-3 sm:text-sm ${getDifficultyDisplay(quiz.quizLevel).color}`}
            >
              {getDifficultyDisplay(quiz.quizLevel).label}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizDisplay;
