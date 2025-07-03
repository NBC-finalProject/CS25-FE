import { useEffect } from "react";
import { SelectionRatesData, QuizData } from "../types";

export const useQuizAnimations = (
  isSubmitted: boolean,
  selectionRates: SelectionRatesData | null,
  selectedAnswer: number | null,
  isDuplicateAnswer: boolean,
  feedbackResult: string,
  feedbackContent: string,
  resultChars: string[],
  setAnimatedPercentages: (percentages: { [key: number]: number }) => void,
  setResultChars: (chars: string[]) => void,
  setFeedbackChars: (chars: string[]) => void,
) => {
  // 결과 텍스트를 글자별로 분리하고 애니메이션 적용
  useEffect(() => {
    if (!feedbackResult) {
      setResultChars([]);
      return;
    }

    // 3초 후에 글자별 애니메이션 시작
    const initialDelay = setTimeout(() => {
      // 마침표 후에 줄바꿈 추가하여 텍스트 처리
      const processedText = feedbackResult.replace(/\./g, ".\n");
      const chars = processedText.split("");
      setResultChars(chars);
    }, 3000);

    return () => clearTimeout(initialDelay);
  }, [feedbackResult, setResultChars]);

  // 피드백 텍스트를 글자별로 분리하고 애니메이션 적용
  useEffect(() => {
    if (!feedbackContent || resultChars.length === 0) {
      setFeedbackChars([]);
      return;
    }

    // 결과 부분이 완료된 후 1초 후에 피드백 애니메이션 시작
    const timer = setTimeout(() => {
      // 마침표 후에 줄바꿈 추가하여 텍스트 처리
      const processedText = feedbackContent.replace(/\./g, ".\n");
      const chars = processedText.split("");
      setFeedbackChars(chars);
    }, 1000);

    return () => clearTimeout(timer);
  }, [feedbackContent, resultChars.length, setFeedbackChars]);

  // 답변 제출 후 게이지 애니메이션 효과
  useEffect(() => {
    if (isSubmitted && selectionRates && selectedAnswer) {
      // 초기값을 0으로 설정
      setAnimatedPercentages({ 1: 0, 2: 0, 3: 0, 4: 0 });

      // 0.5초 후 실제 값으로 애니메이션 시작
      const timer = setTimeout(() => {
        const newPercentages: { [key: number]: number } = {};
        [1, 2, 3, 4].forEach((choice) => {
          // API 응답에서 선택지 텍스트를 키로 사용하는 경우 처리
          let originalRate =
            selectionRates.selectionRates[choice.toString()] || 0;

          // 선택지 텍스트를 키로 찾아보기
          Object.keys(selectionRates.selectionRates).forEach((key) => {
            if (key.startsWith(`${choice}.`)) {
              originalRate = selectionRates.selectionRates[key];
            }
          });
          const originalCount = Math.round(
            originalRate * selectionRates.totalCount,
          );

          // 중복 답변이 아닌 경우에만 새로운 선택을 카운트에 추가
          let newCount = originalCount;
          let newTotalCount = selectionRates.totalCount;

          if (!isDuplicateAnswer) {
            newCount =
              selectedAnswer === choice ? originalCount + 1 : originalCount;
            newTotalCount = selectionRates.totalCount + 1;
          }

          const newRate = newCount / newTotalCount;
          newPercentages[choice] = Math.round(newRate * 100);
        });
        setAnimatedPercentages(newPercentages);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [
    isSubmitted,
    selectionRates,
    selectedAnswer,
    isDuplicateAnswer,
    setAnimatedPercentages,
  ]);
};
