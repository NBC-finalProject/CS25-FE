import React from "react";
import Container from "../common/Container";
import Section from "../common/Section";

interface HeroSectionProps {
  onSubscribeClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSubscribeClick }) => {
  return (
    <Section className="to-brand-50 bg-gradient-to-br from-gray-50 via-blue-50 pb-20 pt-16 text-center sm:pb-32 sm:pt-20">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="bg-brand-100 mb-6 inline-flex items-center rounded-full px-4 py-2 sm:mb-8 sm:px-6">
            <span className="text-brand-700 text-xs font-medium sm:text-sm">
              AI가 생성하고 해설하는 CS 지식
            </span>
          </div>

          <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
            AI가 전하는
            <br />
            <span className="from-brand-600 to-navy-600 bg-gradient-to-r bg-clip-text text-transparent">
              데일리 CS 지식
            </span>
            <br />
            메일로 만나보세요!
          </h1>

          <p className="mx-auto mb-8 max-w-2xl px-4 text-base leading-relaxed text-gray-700 sm:mb-12 sm:px-0 sm:text-lg md:text-xl lg:text-2xl">
            AI가 매일 새로운 CS 문제를 생성하고 상세히 해설
            <br className="hidden sm:block" />
            <span className="block text-sm text-gray-600 sm:inline sm:text-base md:text-lg">
              개인 수준에 맞는 알고리즘, 자료구조, 운영체제 등
            </span>
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <button
              onClick={onSubscribeClick}
              className="from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 group w-full max-w-xs rounded-full bg-gradient-to-r px-6 py-3 text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
            >
              <span className="flex items-center justify-center">
                무료 구독하기
              </span>
            </button>

            <div className="flex items-center text-xs text-gray-600 sm:text-sm">
              <div className="mr-2 flex -space-x-1 sm:mr-3 sm:-space-x-2">
                <div className="from-brand-400 to-brand-500 h-6 w-6 rounded-full border-2 border-white bg-gradient-to-r sm:h-8 sm:w-8"></div>
                <div className="from-navy-400 to-navy-500 h-6 w-6 rounded-full border-2 border-white bg-gradient-to-r sm:h-8 sm:w-8"></div>
                <div className="from-brand-500 to-navy-500 h-6 w-6 rounded-full border-2 border-white bg-gradient-to-r sm:h-8 sm:w-8"></div>
              </div>
              <span className="text-center sm:text-left">
                이미 <strong className="text-gray-800">10+</strong> 취준생이
                사용 중
              </span>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default HeroSection;
