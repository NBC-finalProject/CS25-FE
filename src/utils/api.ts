// API 유틸리티 함수들

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// 기본 fetch 래퍼
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // 에러 응답 본문 파싱
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `HTTP error! status: ${response.status}` };
      }
      
      const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
      (error as any).status = response.status;
      (error as any).data = errorData;
      throw error;
    }
    
    return await response.json();
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
    period: string;
  }) => {
    return apiRequest('/subscriptions', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        isActive: true
      }),
    });
  },

  // 구독 설정 조회
  getSubscriptionSettings: async (email: string, token: string) => {
    return apiRequest(`/subscription/settings?email=${email}&token=${token}`, {
      method: 'GET'
    });
  },

  // 구독 설정 업데이트
  updateSubscriptionSettings: async (
    email: string,
    token: string,
    settings: {
      categories: string[];
      difficulty: string;
      frequency: string;
      timePreference: string;
    }
  ) => {
    return apiRequest(`/subscription/settings`, {
      method: 'PUT',
      body: JSON.stringify({ email, token, ...settings }),
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
  submitTodayQuizAnswer: async (quizId: string, answerNumber: number, subscriptionId: string) => {
    return apiRequest(`/quizzes/${quizId}`, {
      method: 'POST',
      body: JSON.stringify({ 
        answer: answerNumber.toString(),
        subscriptionId: parseInt(subscriptionId)
      }),
    });
  },

  // 사용자별 퀴즈 히스토리
  getUserQuizHistory: async (email: string, token: string) => {
    return apiRequest(`/quiz/history?email=${email}&token=${token}`, {
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

  // 소셜 로그인
  socialLogin: async (provider: 'kakao' | 'github' | 'naver') => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
    window.location.href = `${apiUrl}/oauth2/authorization/${provider}`;
  }
};

export default apiRequest;