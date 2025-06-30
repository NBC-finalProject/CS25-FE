import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import HeroSection from './sections/HeroSection';
import FeaturesSection from './sections/FeaturesSection';
import TodayEmailFormSection from './sections/TodayEmailFormSection';

interface LandingPageProps {
  onSubscribeClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSubscribeClick }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // URL에 openSubscription=true 파라미터가 있으면 구독 모달 열기
    if (searchParams.get('openSubscription') === 'true') {
      onSubscribeClick();
      // URL에서 쿼리 파라미터 제거 (깔끔하게)
      setSearchParams({});
    }
  }, [searchParams, onSubscribeClick, setSearchParams]);

  return (
    <>
      <HeroSection onSubscribeClick={onSubscribeClick} />
      <TodayEmailFormSection />
      <FeaturesSection />
    </>
  );
};

export default LandingPage;