import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { subscriptionAPI } from '../utils/api';

// 구독 관련 Query Keys
export const subscriptionKeys = {
  all: ['subscription'] as const,
  settings: (email: string, token: string) => [...subscriptionKeys.all, 'settings', email, token] as const,
};

// 이메일 인증 요청
export const useRequestEmailVerification = () => {
  return useMutation({
    mutationFn: (email: string) => subscriptionAPI.requestEmailVerification(email),
  });
};

// 이메일 중복 체크
export const useCheckEmail = () => {
  return useMutation({
    mutationFn: (email: string) => subscriptionAPI.checkEmail(email),
  });
};

// 인증 코드 확인
export const useVerifyCode = () => {
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) => 
      subscriptionAPI.verifyCode(email, code),
  });
};

// 구독 생성
export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      email: string;
      category: string;
      days: string[];
      period: string;
    }) => subscriptionAPI.createSubscription(data),
    onSuccess: () => {
      // 구독 생성 후 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
    },
  });
};

// 구독 설정 조회
export const useSubscriptionSettings = (email: string, token: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: subscriptionKeys.settings(email, token),
    queryFn: () => subscriptionAPI.getSubscriptionSettings(email, token),
    enabled: enabled && !!email && !!token,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
  });
};

// 구독 설정 업데이트
export const useUpdateSubscriptionSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      email,
      token,
      settings,
    }: {
      email: string;
      token: string;
      settings: {
        categories: string[];
        difficulty: string;
        frequency: string;
        timePreference: string;
      };
    }) => subscriptionAPI.updateSubscriptionSettings(email, token, settings),
    onSuccess: (_, variables) => {
      // 특정 사용자의 설정 캐시 무효화
      queryClient.invalidateQueries({ 
        queryKey: subscriptionKeys.settings(variables.email, variables.token) 
      });
    },
  });
};