import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { quizAPI } from "../../../../utils/api";
import { QuizData, SelectionRatesData } from "../types";

// 임시 데이터
const fakeTodayQuiz: QuizData = {
  question: "다음 중 JavaScript에서 변수를 선언하는 올바른 방법은?",
  choice1: "1. variable myVar = 10;",
  choice2: "2. let myVar = 10;",
  choice3: "3. declare myVar = 10;",
  choice4: "4. set myVar = 10;",
  answerNumber: "2",
  commentary: "let은 ES6에서 도입된 블록 스코프 변수 선언 키워드입니다.",
  category: {
    main: "FRONTEND",
    sub: "SoftwareDesign",
  },
  quizType: "MULTIPLE_CHOICE",
  quizLevel: "NORMAL",
};

export const useQuizData = (
  subscriptionId: string | null,
  quizId: string | null,
) => {
  const [selectionRates, setSelectionRates] =
    useState<SelectionRatesData | null>(null);
  const [animatedPercentages, setAnimatedPercentages] = useState<{
    [key: number]: number;
  }>({});

  const { data: question, isLoading } = useQuery({
    queryKey: ["todayQuiz", subscriptionId, quizId],
    queryFn: async () => {
      const response = await quizAPI.getTodayQuiz(
        subscriptionId || undefined,
        quizId || undefined,
      );

      // 다양한 응답 구조 처리
      let quizData;

      if (response && typeof response === "object") {
        // Case 1: { data: { question, choice1, choice2, choice3, choice4 } }
        if ("data" in response && response.data) {
          quizData = response.data;
        }
        // Case 2: { question, choice1, choice2, choice3, choice4 } 직접
        else if ("question" in response) {
          quizData = response;
        }
        // Case 3: 기타 구조
        else {
          quizData = response;
        }
      } else {
        quizData = null;
      }

      // 퀴즈 데이터와 함께 선택 비율도 가져오기 (객관식만)
      if (
        quizData &&
        quizId &&
        (quizData as QuizData).quizType === "MULTIPLE_CHOICE"
      ) {
        try {
          const ratesResponse = await quizAPI.getQuizSelectionRates(quizId);
          // API 응답 구조 처리
          if (ratesResponse && typeof ratesResponse === "object") {
            const ratesData =
              "data" in ratesResponse ? ratesResponse.data : ratesResponse;
            setSelectionRates(ratesData as SelectionRatesData);
          }
        } catch (error) {
          console.error("선택 비율 데이터 가져오기 실패:", error);
        }
      }

      return quizData as QuizData;
    },
    enabled: !!(subscriptionId && quizId),
  });

  // API 실패 시 fake 데이터 사용
  const displayQuiz = question || fakeTodayQuiz;

  return {
    displayQuiz,
    isLoading,
    selectionRates,
    setSelectionRates,
    animatedPercentages,
    setAnimatedPercentages,
  };
};
