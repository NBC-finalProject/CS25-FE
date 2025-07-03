import Cookies from "js-cookie";

export interface TokenManager {
  getAccessToken(): string | undefined;
  getRefreshToken(): string | undefined;
  setTokens(accessToken: string, refreshToken: string): void;
  clearTokens(): void;
  hasValidTokens(): Promise<boolean>;
  checkAuthStatus(): Promise<boolean>;
  onTokenChange(callback: (hasTokens: boolean) => void): void;
  offTokenChange(callback: (hasTokens: boolean) => void): void;
}

// 토큰 변경 이벤트 관리
class TokenEventManager {
  private listeners: Set<(hasTokens: boolean) => void> = new Set();

  addListener(callback: (hasTokens: boolean) => void) {
    this.listeners.add(callback);
  }

  removeListener(callback: (hasTokens: boolean) => void) {
    this.listeners.delete(callback);
  }

  notify(hasTokens: boolean) {
    this.listeners.forEach((callback) => callback(hasTokens));
  }
}

const tokenEventManager = new TokenEventManager();

// 외부에서 사용할 수 있도록 export
export { tokenEventManager };

class CookieTokenManager implements TokenManager {
  private readonly ACCESS_TOKEN_KEY = "accessToken";
  private readonly REFRESH_TOKEN_KEY = "refreshToken";

  getAccessToken(): string | undefined {
    // HttpOnly 쿠키는 JavaScript에서 접근할 수 없으므로 undefined 반환
    return undefined;
  }

  getRefreshToken(): string | undefined {
    // HttpOnly 쿠키는 JavaScript에서 접근할 수 없으므로 undefined 반환
    return undefined;
  }

  setTokens(accessToken: string, refreshToken: string): void {
    // HttpOnly 쿠키는 백엔드에서 설정하므로 프론트엔드에서는 이벤트만 발생
    tokenEventManager.notify(true);
  }

  clearTokens(): void {
    // HttpOnly 쿠키는 백엔드에서 삭제하므로 프론트엔드에서는 이벤트만 발생
    tokenEventManager.notify(false);
  }

  // API를 통한 인증 상태 확인
  async checkAuthStatus(): Promise<boolean> {
    try {
      // 동적 import로 circular dependency 해결
      const { authAPI } = await import("./api");
      const response = await authAPI.checkAuthStatus();

      // 응답 구조: {"httpCode":200,"data":boolean}
      const isAuthenticated = (response as any)?.data === true;

      return isAuthenticated;
    } catch (error) {
      return false;
    }
  }

  // 호환성을 위한 hasValidTokens (이제 비동기)
  async hasValidTokens(): Promise<boolean> {
    return this.checkAuthStatus();
  }

  onTokenChange(callback: (hasTokens: boolean) => void): void {
    tokenEventManager.addListener(callback);
  }

  offTokenChange(callback: (hasTokens: boolean) => void): void {
    tokenEventManager.removeListener(callback);
  }
}

export const tokenManager = new CookieTokenManager();
