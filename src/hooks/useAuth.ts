import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../utils/api';
import { tokenManager, tokenEventManager } from '../utils/tokenManager';

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
    onSuccess: (data: any) => {
      // 로그인 성공 시 토큰 저장
      if (data.accessToken && data.refreshToken) {
        tokenManager.setTokens(data.accessToken, data.refreshToken);
      }
      // 사용자 정보 캐시에 저장
      queryClient.setQueryData(authKeys.user(), data);
      // 모든 쿼리 무효화하여 새로운 인증상태로 다시 요청
      queryClient.invalidateQueries();
    },
  });
};

// 회원가입
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => 
      authAPI.register(email, password),
    onSuccess: (data: any) => {
      // 회원가입 성공 시 토큰 저장 (만약 회원가입시에도 토큰이 발급된다면)
      if (data.accessToken && data.refreshToken) {
        tokenManager.setTokens(data.accessToken, data.refreshToken);
      }
      // 사용자 정보 캐시에 저장
      queryClient.setQueryData(authKeys.user(), data);
    },
  });
};

// 로그아웃
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        // 서버에 로그아웃 요청 (HttpOnly 쿠키 삭제)
        await authAPI.logout();
      } catch (error) {
        // 서버 로그아웃 실패시에도 로컬 상태는 초기화
        throw error; // 에러를 다시 던져서 UI에서 처리할 수 있도록
      }
    },
    onSuccess: () => {
      // 로그아웃 성공시 이벤트 발생 (HttpOnly 쿠키는 서버에서 삭제됨)
      tokenManager.clearTokens();
      // 모든 캐시 클리어
      queryClient.clear();
    },
    onError: (error) => {
      console.error('❌ Logout failed:', error);
      // 에러가 발생해도 로컬 상태는 초기화 (안전장치)
      tokenManager.clearTokens();
      queryClient.clear();
    },
  });
};

// 인증 상태 관리 훅
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
  });

  // 인증 상태 확인 함수 (비동기)
  const checkAuth = useCallback(async () => {
    try {
      const hasTokens = await tokenManager.hasValidTokens();
      setAuthState({
        isAuthenticated: hasTokens,
        isLoading: false,
      });
      return hasTokens;
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
      });
      return false;
    }
  }, []);

  // 토큰 변경 이벤트 리스너
  useEffect(() => {
    // 소셜 로그인 완료 처리 및 초기 상태 확인
    const initialCheck = async () => {
      try {
        // API를 통한 인증 상태 확인
        const hasTokens = await tokenManager.checkAuthStatus();
        
        setAuthState({
          isAuthenticated: hasTokens,
          isLoading: false,
        });

        // 인증 성공시 이벤트 발생
        if (hasTokens) {
          tokenEventManager.notify(true);
        }
      } catch (error) {
        console.error('Initial auth check failed:', error);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    // 약간의 지연을 주어 페이지 로드가 완전히 완료될 시간을 줌
    const timer = setTimeout(initialCheck, 100);

    // 토큰 변경 이벤트 리스너 등록
    const handleTokenChange = (hasTokens: boolean) => {
      setAuthState({
        isAuthenticated: hasTokens,
        isLoading: false,
      });
    };

    tokenManager.onTokenChange(handleTokenChange);

    // 소셜 로그인 후 리다이렉트 감지 (URL 변화 또는 포커스 복구 시 재확인)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(() => checkAuth(), 100);
      }
    };

    const handleFocus = () => {
      setTimeout(() => checkAuth(), 100);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // 클린업
    return () => {
      clearTimeout(timer);
      tokenManager.offTokenChange(handleTokenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkAuth]);

  // 인증 상태 업데이트 (토큰 갱신 시나리오에서 유용)
  const updateAuthState = useCallback((isAuthenticated: boolean) => {
    setAuthState(prev => ({
      ...prev,
      isAuthenticated,
    }));
  }, []);

  return {
    ...authState,
    updateAuthState,
    checkAuth, // 수동으로 상태 체크할 수 있도록 노출
  };
};