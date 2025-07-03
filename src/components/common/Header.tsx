import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginModal } from "../../hooks/useModal";
import { useAuth, useLogout } from "../../hooks/useAuth";

const Header: React.FC = () => {
  const { openLoginModal } = useLoginModal();
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // 인증 상태와 로그아웃 기능 가져오기
  const { isAuthenticated, isLoading } = useAuth();
  const logoutMutation = useLogout();

  // 디버깅용 로그
  // React.useEffect(() => {
  //   console.log('🎯 Header auth state:', { isAuthenticated, isLoading });
  // }, [isAuthenticated, isLoading]);

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate("/"); // 로그아웃 후 홈으로 이동
    } catch (error) {
      console.error("❌ 로그아웃 실패:", error);
      // 에러가 발생해도 홈으로 이동 (사용자 경험 개선)
      navigate("/");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`font-pretendard fixed left-0 right-0 top-0 z-40 transition-all duration-500 ${
        isScrolled ? "bg-white/90 shadow-sm backdrop-blur-md" : "bg-transparent"
      }`}
      style={{
        borderBottom: isScrolled
          ? "1px solid rgba(229, 231, 235, 0.8)"
          : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-3 sm:px-5 sm:py-4">
        <div className="flex items-center space-x-3">
          <div
            className="flex cursor-pointer items-center"
            onClick={() => navigate("/")}
          >
            <img src="/cs25.png" alt="CS25" className="h-6 w-auto sm:h-8" />
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {isAuthenticated ? (
            // 로그인된 상태
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => navigate("/profile")}
                className="hover:text-brand-600 hover:bg-brand-50 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-700 transition-all duration-300 sm:px-4 sm:py-2 sm:text-base"
              >
                <span className="sm:inline">마이페이지</span>
              </button>
              <button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-300 sm:px-6 sm:py-2 sm:text-base ${
                  logoutMutation.isPending
                    ? "cursor-not-allowed bg-gray-400 text-white"
                    : "from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 bg-gradient-to-r text-white shadow-sm"
                }`}
              >
                로그아웃
              </button>
            </div>
          ) : (
            // 로그인되지 않은 상태
            <button
              onClick={openLoginModal}
              className="from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 rounded-lg bg-gradient-to-r px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-all duration-300 sm:px-6 sm:py-2 sm:text-base"
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
