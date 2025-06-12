import React from 'react';

interface SocialButtonProps {
  provider: 'kakao' | 'github' | 'naver';
  href: string;
  children: React.ReactNode;
}

const SocialButton: React.FC<SocialButtonProps> = ({ provider, href, children }) => {
  const getButtonStyles = () => {
    switch (provider) {
      case 'kakao':
        return 'bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-500 hover:shadow-yellow-200 shadow-yellow-100';
      case 'github':
        return 'bg-gray-800 text-white border-gray-800 hover:bg-gray-700 hover:shadow-gray-400 shadow-gray-300';
      case 'naver':
        return 'bg-green-500 text-white border-green-500 hover:bg-green-600 hover:shadow-green-200 shadow-green-100';
    }
  };

  return (
    <a 
      href={href} 
      className={`block w-full mb-3 px-5 py-4 text-base font-medium border rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg shadow-sm ${getButtonStyles()}`}
    >
      {children}
    </a>
  );
};

export default SocialButton;