import React from 'react';
import HeroSection from './sections/HeroSection';
import FeaturesSection from './sections/FeaturesSection';
import TodayEmailFormSection from './sections/TodayEmailFormSection';

interface LandingPageProps {
  onSubscribeClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSubscribeClick }) => {
  return (
    <>
      <HeroSection onSubscribeClick={onSubscribeClick} />
      <TodayEmailFormSection />
      <FeaturesSection />
    </>
  );
};

export default LandingPage;