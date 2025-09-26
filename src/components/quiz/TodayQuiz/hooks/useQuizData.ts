import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { quizAPI } from "../../../../utils/api";
import { QuizData, SelectionRatesData } from "../types";
import {decryptAesCbcB64, looksLikeBase64} from "../../../../utils/crypto";


// 환경변수에서 키 읽기 (예시)
const AES_KEY = import.meta.env.VITE_AES_KEY || process.env.REACT_APP_AES_KEY || "1234567890123456";

async function decryptQuizFields(quizData: QuizData): Promise<QuizData> {
    if (!AES_KEY) return quizData; // 키 없으면 그대로

    const cloned = { ...quizData };

    if (cloned.quizType === "MULTIPLE_CHOICE") {
        if (looksLikeBase64(cloned.answerNumber)) {
            cloned.answerNumber = await decryptAesCbcB64(<string>cloned.answerNumber, AES_KEY);
        }
        if (looksLikeBase64(cloned.commentary)) {
            cloned.commentary = await decryptAesCbcB64(cloned.commentary, AES_KEY);
        }
    } else {
        // SHORT_ANSWER / SUBJECTIVE
        // back이 answer/commentary 둘 다 암호화해서 내려준다는 가정
        if ("answer" in cloned && looksLikeBase64((cloned as any).answer)) {
            (cloned as any).answer = await decryptAesCbcB64((cloned as any).answer, AES_KEY);
        }
        if (looksLikeBase64(cloned.commentary)) {
            cloned.commentary = await decryptAesCbcB64(cloned.commentary, AES_KEY);
        }
    }

    return cloned;
}


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

      // 퀴즈 데이터와 함께 선택 비율도 가져오기
      // if (quizData && quizId) { (TODO: 모든 타입)
      // (객관식만)
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

        if (quizData) {
            quizData = await decryptQuizFields(quizData as QuizData);
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
