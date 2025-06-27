import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginModal } from '../../hooks/useModal';
import { useAuth, useLogout } from '../../hooks/useAuth';

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
      navigate('/'); // 로그아웃 후 홈으로 이동
    } catch (error) {
      console.error('❌ 로그아웃 실패:', error);
      // 에러가 발생해도 홈으로 이동 (사용자 경험 개선)
      navigate('/');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 font-pretendard transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
      style={{
        borderBottom: isScrolled ? '1px solid rgba(229, 231, 235, 0.8)' : '1px solid transparent'
      }}
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-5 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img 
              src="/cs25.png" 
              alt="CS25" 
              className="h-6 sm:h-8 w-auto"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          {isAuthenticated ? (
            // 로그인된 상태
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => navigate('/profile')}
                className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-300 text-gray-700 hover:text-brand-600 hover:bg-brand-50 text-sm sm:text-base"
              >
                <span className="sm:inline">마이페이지</span>
              </button>
              <button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className={`px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
                  logoutMutation.isPending
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 shadow-sm'
                }`}
              >
                로그아웃
              </button>
            </div>
          ) : (
            // 로그인되지 않은 상태
            <button
              onClick={openLoginModal}
              className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-300 bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 shadow-sm text-sm sm:text-base"
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