import React from 'react';
import HeroSection from './sections/HeroSection';
import FeaturesSection from './sections/FeaturesSection';

interface LandingPageProps {
  onSubscribeClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSubscribeClick }) => {
  return (
    <>
      <HeroSection onSubscribeClick={onSubscribeClick} />
      <FeaturesSection />
    </>
  );
};

export default LandingPage;