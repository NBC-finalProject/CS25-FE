import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quizAPI } from "../utils/api";

// 퀴즈 관련 Query Keys
export const quizKeys = {
  all: ["quiz"] as const,
  categories: () => [...quizKeys.all, "categories"] as const,
  today: () => [...quizKeys.all, "today"] as const,
  history: (email: string, token: string) =>
    [...quizKeys.all, "history", email, token] as const,
};

// 퀴즈 카테고리 목록 조회
export const useQuizCategories = (enabled: boolean = true) => {
  return useQuery({
    queryKey: quizKeys.categories(),
    queryFn: quizAPI.getQuizCategories,
    staleTime: 1000 * 60 * 60, // 1시간간 fresh (카테고리는 자주 변경되지 않음)
    gcTime: 1000 * 60 * 60 * 24, // 24시간 동안 캐시 유지
    retry: 1,
    enabled, // 모달이 열릴 때만 요청
    refetchOnMount: false, // 컴포넌트 마운트 시 재요청 안함
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 안함
  });
};

// 오늘의 퀴즈 조회
export const useTodayQuiz = () => {
  return useQuery({
    queryKey: quizKeys.today(),
    queryFn: () => quizAPI.getTodayQuiz(),
    staleTime: 1000 * 60 * 30, // 30분간 fresh
    retry: 1,
  });
};

// 퀴즈 답안 제출
export const useSubmitQuizAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quizId,
      answer,
    }: {
      quizId: string;
      answer: number | string;
    }) => quizAPI.submitQuizAnswer(quizId, answer),
    onSuccess: () => {
      // 제출 후 히스토리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: quizKeys.all });
    },
  });
};

// 사용자 퀴즈 히스토리 조회
export const useQuizHistory = (
  email: string,
  token: string,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: quizKeys.history(email, token),
    queryFn: () => quizAPI.getUserQuizHistory(email, token),
    enabled: enabled && !!email && !!token,
    staleTime: 1000 * 60 * 10, // 10분간 fresh
  });
};
