import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../utils/api';

// 인증 관련 Query Keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

// 로그인
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => 
      authAPI.login(email, password),
    onSuccess: (data) => {
      // 로그인 성공 시 사용자 정보 캐시에 저장
      queryClient.setQueryData(authKeys.user(), data);
    },
  });
};

// 회원가입
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => 
      authAPI.register(email, password),
    onSuccess: (data) => {
      // 회원가입 성공 시 사용자 정보 캐시에 저장
      queryClient.setQueryData(authKeys.user(), data);
    },
  });
};

// 로그아웃
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // 로컬 스토리지에서 토큰 제거 등의 로직
      localStorage.removeItem('authToken');
      return Promise.resolve();
    },
    onSuccess: () => {
      // 모든 캐시 클리어
      queryClient.clear();
    },
  });
};