import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { subscriptionAPI } from '../utils/api';

// 구독 관련 Query Keys
export const subscriptionKeys = {
  all: ['subscription'] as const,
  settings: (email: string, token: string) => [...subscriptionKeys.all, 'settings', email, token] as const,
  byId: (id: string) => [...subscriptionKeys.all, 'byId', id] as const,
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
      period: number; // string에서 number로 변경
    }) => subscriptionAPI.createSubscription(data),
    onSuccess: () => {
      // 구독 생성 후 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
    },
  });
};

// 구독 정보 조회 (ID로)
export const useSubscriptionById = (subscriptionId: string) => {
  return useQuery({
    queryKey: subscriptionKeys.byId(subscriptionId),
    queryFn: async () => {
      const response = await subscriptionAPI.getSubscriptionById(subscriptionId);
      const subscriptionResponse = response as { data: any };
      return subscriptionResponse.data;
    },
    enabled: !!subscriptionId,
  });
};

// 구독 정보 수정
export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      subscriptionId, 
      data 
    }: { 
      subscriptionId: string; 
      data: { 
        category: string; 
        email: string;
        days: string[]; 
        period: number; 
        active: boolean; 
      } 
    }) => subscriptionAPI.updateSubscription(subscriptionId, data),
    onSuccess: (_, variables) => {
      // 수정된 구독 정보와 전체 구독 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.byId(variables.subscriptionId) });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
    },
  });
};