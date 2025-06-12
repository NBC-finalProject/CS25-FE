import React from 'react';
import Container from '../common/Container';
import Section from '../common/Section';

interface HeroSectionProps {
  onSubscribeClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSubscribeClick }) => {
  return (
    <Section className="text-center pt-20 pb-32 bg-gradient-to-br from-gray-50 via-blue-50 to-brand-50">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center bg-brand-100 rounded-full px-6 py-2 mb-8">
            <span className="text-sm font-medium text-brand-700">🤖 AI가 생성하고 해설하는 CS 지식</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight text-gray-900">
            AI가 전하는<br />
            <span className="bg-gradient-to-r from-brand-600 to-navy-600 bg-clip-text text-transparent">
              데일리 CS 지식
            </span><br />
           메일로 만나보세요!
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-gray-700 max-w-2xl mx-auto leading-relaxed">
            AI가 매일 새로운 CS 문제를 생성하고 상세히 해설<br />
            <span className="text-lg text-gray-600">개인 수준에 맞는 알고리즘, 자료구조, 운영체제 등</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onSubscribeClick}
              className="bg-gradient-to-r from-brand-500 to-brand-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:from-brand-600 hover:to-brand-700 hover:scale-105 hover:shadow-xl group"
            >
              <span className="flex items-center">
                무료로 구독하기
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
            
            <div className="flex items-center text-gray-600 text-sm">
              <div className="flex -space-x-2 mr-3">
                <div className="w-8 h-8 bg-gradient-to-r from-brand-400 to-brand-500 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-navy-400 to-navy-500 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-brand-500 to-navy-500 rounded-full border-2 border-white"></div>
              </div>
              <span>이미 <strong className="text-gray-800">1,000+</strong> 취준생이 사용 중</span>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default HeroSection;