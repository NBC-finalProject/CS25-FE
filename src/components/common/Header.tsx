import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginModal } from '../../hooks/useModal';

const Header: React.FC = () => {
  const { openLoginModal } = useLoginModal();
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

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
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img 
              src="/cs25.png" 
              alt="CS25" 
              className="h-8 w-auto"
            />
          </div>
        </div>
        
        <button
          onClick={openLoginModal}
          className="px-6 py-2 rounded-lg font-medium transition-all duration-300 bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 shadow-sm"
        >
          로그인
        </button>
      </div>
    </header>
  );
};

export default Header;