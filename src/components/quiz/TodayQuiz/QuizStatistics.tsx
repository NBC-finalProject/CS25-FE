import React from "react";
import { QuizData, AnswerResult, SelectionRatesData } from "./types";

interface QuizStatisticsProps {
  quiz: QuizData;
  answerResult: AnswerResult;
  selectionRates: SelectionRatesData;
  selectedAnswer: number | null;
  animatedPercentages: { [key: number]: number };
  isDuplicateAnswer: boolean;
}

const QuizStatistics: React.FC<QuizStatisticsProps> = ({
  quiz,
  answerResult,
  selectionRates,
  selectedAnswer,
  animatedPercentages,
  isDuplicateAnswer,
}) => {
  if (!selectionRates || quiz?.quizType !== "MULTIPLE_CHOICE") {
    return null;
  }

  return (
    <div className="rounded-lg bg-blue-50 p-3 sm:rounded-xl sm:p-4">
      <h4 className="mb-3 text-base font-bold text-gray-900 sm:mb-4 sm:text-lg">
        선택 비율
      </h4>
      <div className="space-y-2 sm:space-y-3">
        {[1, 2, 3, 4].map((choice) => {
          // API 응답에서 선택지 텍스트를 키로 사용하는 경우 처리
          const choiceKey = `choice${choice}` as keyof QuizData;
          const choiceText = quiz[choiceKey] as string;
          const originalRate =
            selectionRates.selectionRates[choiceText] ||
            selectionRates.selectionRates[choice.toString()] ||
            0;
          const originalCount = Math.round(
            originalRate * selectionRates.totalCount,
          );

          // 중복 답변이 아닌 경우에만 사용자의 선택을 포함해서 새로운 비율 계산
          let newCount = originalCount;
          let newTotalCount = selectionRates.totalCount;

          if (!isDuplicateAnswer) {
            newCount =
              selectedAnswer === choice ? originalCount + 1 : originalCount;
            newTotalCount = selectionRates.totalCount + 1;
          }

          const newRate = newCount / newTotalCount;
          const actualPercentage = Math.round(newRate * 100);

          const animatedPercentage = animatedPercentages[choice] || 0;
          const isCorrectAnswer = answerResult.answer.startsWith(`${choice}번`);
          const isUserChoice = selectedAnswer === choice;

          return (
            <div
              key={choice}
              className="flex items-center space-x-2 sm:space-x-3"
            >
              <div
                className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-xs font-bold sm:h-8 sm:w-8 sm:rounded-lg sm:text-sm ${
                  isCorrectAnswer
                    ? "bg-green-500 text-white"
                    : isUserChoice
                      ? "bg-red-500 text-white"
                      : "bg-gray-300 text-gray-700"
                }`}
              >
                {choice}
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700 sm:text-sm">
                    {choice}번 {isCorrectAnswer && "(정답)"}{" "}
                    {isUserChoice && "(내 선택)"}
                  </span>
                  <span className="text-xs font-bold text-gray-900 sm:text-sm">
                    {actualPercentage}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-200 sm:h-2">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-1000 ease-out sm:h-2 ${
                      isCorrectAnswer
                        ? "bg-green-500"
                        : isUserChoice
                          ? "bg-red-500"
                          : "bg-gray-400"
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
  );
};

export default QuizStatistics;
