import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userAPI } from "../utils/api";

// 사용자 관련 Query Keys
export const userKeys = {
  all: ["user"] as const,
  profile: () => [...userKeys.all, "profile"] as const,
  profileSubscription: () => [...userKeys.all, "profileSubscription"] as const,
  quizHistory: (page: number, size: number) =>
    [...userKeys.all, "quizHistory", page, size] as const,
  ranking: (page: number, size: number) =>
    [...userKeys.all, "ranking", page, size] as const,
  wrongQuiz: (page?: number) => [...userKeys.all, "wrongQuiz", page] as const,
  correctRate: () => [...userKeys.all, "correctRate"] as const,
};

// 사용자 프로필 조회
export const useUserProfile = () => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: async () => {
      const response = await userAPI.getProfile();
      return (response as any).data;
    },
  });
};

// 사용자 구독 정보 조회
export const useUserProfileSubscription = (enabled: boolean = true) => {
  return useQuery({
    queryKey: userKeys.profileSubscription(),
    queryFn: async () => {
      const response = await userAPI.getProfileSubscription();
      return (response as any).data;
    },
    enabled,
  });
};

// 사용자 퀴즈 히스토리 조회 (미구현으로 주석 처리)
// export const useUserQuizHistory = (page: number = 0, size: number = 10, enabled: boolean = true) => {
//   return useQuery({
//     queryKey: userKeys.quizHistory(page, size),
//     queryFn: async () => {
//       const response = await userAPI.getQuizHistory(page, size);
//       return (response as any).data;
//     },
//     enabled,
//   });
// };

// 사용자 랭킹 조회 (미구현으로 주석 처리)
// export const useUserRanking = (page: number = 0, size: number = 10, enabled: boolean = true) => {
//   return useQuery({
//     queryKey: userKeys.ranking(page, size),
//     queryFn: async () => {
//       const response = await userAPI.getRanking(page, size);
//       return (response as any).data;
//     },
//     enabled,
//   });
// };

// 사용자 틀린 문제 조회
export const useUserWrongQuiz = (enabled: boolean = true, page: number = 0) => {
  return useQuery({
    queryKey: userKeys.wrongQuiz(page),
    queryFn: async () => {
      const response = await userAPI.getWrongQuiz(page);
      return (response as any).data;
    },
    enabled,
  });
};

// 사용자 카테고리별 정답률 조회
export const useUserCorrectRate = (enabled: boolean = true) => {
  return useQuery({
    queryKey: userKeys.correctRate(),
    queryFn: async () => {
      const response = await userAPI.getCorrectRate();
      return (response as any).data;
    },
    enabled,
  });
};
