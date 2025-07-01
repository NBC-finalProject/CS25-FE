import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const { NODE_ENV } = import.meta.env;
const API_BASE_URL = NODE_ENV === 'prod' ? 'https://cs25.co.kr/api' : 'http://localhost:8080';

// Create axios instance for authenticated requests
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies with requests
  timeout: 10000, // 10 second timeout
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor - HttpOnly 쿠키는 자동으로 포함되므로 Authorization 헤더 불필요
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // HttpOnly 쿠키는 브라우저가 자동으로 포함시킴
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error is due to expired access token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue the request
        console.log('🔄 Token refresh in progress, queueing request...');
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          // HttpOnly 쿠키는 자동으로 포함되므로 Authorization 헤더 불필요
          return apiClient(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('🔄 Attempting token reissue...');
        
        // HttpOnly 쿠키 기반 토큰 재발급 시도
        // refreshToken은 HttpOnly 쿠키에 있으므로 자동으로 포함됨
        await axios.post(`${API_BASE_URL}/auth/reissue`, {
          // ReissueRequestDto - 백엔드에서 요구하는 형식에 맞춤
          // 만약 빈 객체도 허용한다면 이대로, 특정 필드가 필요하면 추가
        }, {
          withCredentials: true // HttpOnly 쿠키 포함
        });

        console.log('✅ Token reissue successful');
        
        // 토큰 재발급 성공 이벤트 발생
        const { tokenManager } = await import('./tokenManager');
        tokenManager.setTokens('reissued', 'reissued'); // 실제 토큰은 HttpOnly 쿠키에 설정됨
        
        // Process the queued requests
        processQueue(null, 'reissued');

        // Retry the original request (HttpOnly 쿠키가 자동으로 포함됨)
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('❌ Token reissue failed:', refreshError);
        
        // Refresh failed - clear tokens and redirect to login
        processQueue(refreshError, null);
        
        const { tokenManager } = await import('./tokenManager');
        tokenManager.clearTokens();
        
        // Redirect to login page or emit logout event
        window.location.href = '/';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;