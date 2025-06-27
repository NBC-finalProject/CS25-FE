import React, { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closable?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, size = 'md', closable = true }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      
      // 스크롤바 너비를 계산하여 패딩으로 보상
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      
      // 약간의 지연 후 애니메이션 시작
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '';
      // 애니메이션 완료 후 언마운트
      setTimeout(() => setShouldRender(false), 200);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'max-w-sm';
      case 'md': return 'max-w-lg';
      case 'lg': return 'max-w-2xl';
      case 'xl': return 'max-w-4xl';
      default: return 'max-w-lg';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-pretendard">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-all duration-200 ease-out ${
          isVisible ? 'bg-opacity-50' : 'bg-opacity-0'
        }`}
        onClick={closable ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className={`relative bg-white rounded-2xl shadow-2xl ${getSizeClasses()} w-full mx-4 transition-all duration-200 ease-out transform ${
        isVisible 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-95 translate-y-4'
      }`}>
        {/* Header */}
        {(title || closable) && (
          <div className="flex items-center justify-between p-6">
            {title && <h2 className="text-xl font-semibold text-gray-900">{title}</h2>}
            {closable && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors ml-auto"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className={`${(title || closable) ? 'px-6 pb-6' : 'p-6'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;