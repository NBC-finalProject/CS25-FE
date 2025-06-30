// API 유틸리티 함수들
import apiClient from './axiosConfig';
import { AxiosResponse } from 'axios';

const { NODE_ENV } = import.meta.env;
const apiUrl = NODE_ENV === 'prod' ? 'https://cs25.co.kr' : 'http://localhost:8080';

// Axios wrapper for consistency with existing code
async function apiRequest<T>(
  endpoint: string,
  options: {
    method?: string;
    body?: string;
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await apiClient({
      url: endpoint,
      method: (options.method as any) || 'GET',
      data: options.body ? JSON.parse(options.body) : undefined,
      headers: options.headers,
    });
    
    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}


// 구독 관련 API
export const subscriptionAPI = {
  // 이메일 인증 요청
  requestEmailVerification: async (email: string) => {
    return apiRequest('/emails/verifications', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // 인증 코드 확인
  verifyCode: async (email: string, code: string) => {
    return apiRequest('/emails/verifications/verify', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  },

  // 이메일 중복 체크
  checkEmail: async (email: string) => {
    return apiRequest(`/subscriptions/email/check?email=${encodeURIComponent(email)}`, {
      method: 'GET',
    });
  },

  // 구독 생성
  createSubscription: async (data: {
    email: string;
    category: string;
    days: string[];
    period: number; // 이미 숫자로 변환된 값을 받음
  }) => {
    return apiRequest('/subscriptions', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        active: true
      }),
    });
  },

  // subscriptionId로 구독정보 조회
  getSubscriptionById: async (subscriptionId: string) => {
    return apiRequest(`/subscriptions/${subscriptionId}`, {
      method: 'GET'
    });
  },

  // subscriptionId로 구독정보 수정
  updateSubscription: async (subscriptionId: string, data: {
    category: string;
    email: string;
    days: string[];
    period: number;
    active: boolean;
  }) => {
    return apiRequest(`/subscriptions/${subscriptionId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

// 퀴즈 관련 API
export const quizAPI = {
  // 퀴즈 카테고리 목록 조회
  getQuizCategories: async (): Promise<string[] | { data: string[] }> => {
    return apiRequest('/quiz-categories', {
      method: 'GET'
    });
  },

  // 오늘의 퀴즈 조회
  getTodayQuiz: async (subscriptionId?: string, quizId?: string) => {
    const params = new URLSearchParams();
    if (subscriptionId) params.append('subscriptionId', subscriptionId);
    if (quizId) params.append('quizId', quizId);
    
    const endpoint = params.toString() ? `/todayQuiz?${params.toString()}` : '/todayQuiz';
    return apiRequest(endpoint, {
      method: 'GET'
    });
  },

  // 퀴즈 답안 제출
  submitQuizAnswer: async (quizId: string, answer: number) => {
    return apiRequest('/quiz/submit', {
      method: 'POST',
      body: JSON.stringify({ quizId, answer }),
    });
  },

  // TodayQuiz 답안 제출
  submitTodayQuizAnswer: async (quizId: string, answer: number | string, subscriptionId: string) => {
    return apiRequest(`/quizzes/${quizId}`, {
      method: 'POST',
      body: JSON.stringify({ 
        answer: answer.toString(),
        subscriptionId: subscriptionId
      }),
    });
  },

  // 사용자별 퀴즈 히스토리
  getUserQuizHistory: async (email: string, token: string) => {
    return apiRequest(`/quiz/history?email=${email}&token=${token}`, {
      method: 'GET'
    });
  },

  // 퀴즈 선택 비율 조회
  getQuizSelectionRates: async (quizId: string) => {
    return apiRequest(`/quizzes/${quizId}/select-rate`, {
      method: 'GET'
    });
  },

  // AI 피드백 조회 (주관식) - 기존 방식
  getAiFeedback: async (answerId: string) => {
    return apiRequest(`/quizzes/${answerId}/feedback`, {
      method: 'GET'
    });
  },

  // AI 피드백 SSE 스트리밍 (주관식)
  streamAiFeedback: (answerId: string, onData: (data: string) => void, onComplete: () => void, onError: (error: Event) => void) => {
    const eventSource = new EventSource(`${apiUrl}/quizzes/answers/${answerId}/feedback-sentence`, { withCredentials: true });
    
    eventSource.onmessage = (event) => {
      onData(event.data);
    };
    
    eventSource.onerror = (error) => {
      eventSource.close();
      onError(error);
    };
    
    eventSource.addEventListener('complete', () => {
      eventSource.close();
      onComplete();
    });
    
    return eventSource;
  },
};

// 사용자 관련 API
export const userAPI = {
  // 사용자 프로필 조회
  getProfile: async () => {
    return apiRequest('/profile', {
      method: 'GET'
    });
  },

  // 사용자 구독 정보 조회
  getProfileSubscription: async () => {
    return apiRequest('/profile/subscription', {
      method: 'GET'
    });
  },

  // 사용자 틀린 문제 조회
  getWrongQuiz: async () => {
    return apiRequest('/profile/wrong-quiz', {
      method: 'GET'
    });
  },

  // 사용자 카테고리별 정답률 조회
  getCorrectRate: async () => {
    return apiRequest('/profile/correct-rate', {
      method: 'GET'
    });
  },

};

// 인증 관련 API
export const authAPI = {
  // 로그인
  login: async (email: string, password: string) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // 회원가입
  register: async (email: string, password: string) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // 토큰 갱신 (기존 - 호환성용)
  refreshToken: async (refreshToken: string) => {
    return apiRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  // 토큰 재발급 (HttpOnly 쿠키 기반)
  reissueToken: async (reissueRequestDto: any) => {
    return apiRequest('/auth/reissue', {
      method: 'POST',
      body: JSON.stringify(reissueRequestDto),
    });
  },

  // 로그아웃
  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  // 인증 상태 확인 (HttpOnly 쿠키 기반)
  checkAuthStatus: async () => {
    return apiRequest('/auth/status', {
      method: 'GET',
    });
  },

  // 소셜 로그인
  socialLogin: async (provider: 'kakao' | 'github' | 'naver') => {
    window.location.href = `${apiUrl}/oauth2/authorization/${provider}`;
  }
};

export default apiRequest;