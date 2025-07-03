import React, { useState } from 'react';
import { useUserProfile, useUserWrongQuiz, useUserCorrectRate } from '../../hooks';
import Container from '../common/Container';
import Section from '../common/Section';
import OverviewTab from './tabs/OverviewTab';
import WrongQuizTab from './tabs/WrongQuizTab';
import CorrectRateTab from './tabs/CorrectRateTab';
import { TabType } from './types';

const ProfileSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [currentPage, setCurrentPage] = useState(0);

  // 사용자 프로필 조회
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  // 틀린 문제 조회
  const { data: wrongQuizData, isLoading: wrongQuizLoading } = useUserWrongQuiz(activeTab === 'wrong-quiz', currentPage);

  // 카테고리별 정답률 조회
  const { data: correctRateData, isLoading: correctRateLoading } = useUserCorrectRate(activeTab === 'correct-rate');

  const tabs = [
    { 
      key: 'overview' as TabType, 
      label: '개요',
      mobileLabel: '개요',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      key: 'wrong-quiz' as TabType, 
      label: '틀린 문제 보기',
      mobileLabel: '틀린 문제',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    },
    { 
      key: 'correct-rate' as TabType, 
      label: '카테고리별 정답률',
      mobileLabel: '정답률',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      )
    }
  ];

  return (
    <Section className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <Container>
        {/* 페이지 헤더 */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gray-900">
            마이페이지
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            나의 학습 현황과 성과를 확인해보세요
          </p>
        </div>

        {/* 프로필 카드 */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* 탭 네비게이션 */}
          <div className="bg-gray-100 p-1 rounded-xl sm:rounded-2xl shadow-inner">
            <nav className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-2 sm:py-3 px-1 sm:px-2 md:px-4 rounded-lg sm:rounded-xl font-medium transition-all duration-300 flex flex-col items-center justify-center gap-1 sm:gap-2 min-h-[60px] sm:min-h-[70px] md:min-h-[80px] ${
                    activeTab === tab.key
                      ? 'bg-white text-brand-600 shadow-md transform scale-[1.02]'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <div className={`transition-all duration-300 ${
                    activeTab === tab.key ? 'transform scale-110' : ''
                  }`}>
                    {tab.icon}
                  </div>
                  <span className="text-xs sm:text-sm md:text-base font-medium text-center leading-tight block sm:hidden">
                    {tab.mobileLabel}
                  </span>
                  <span className="text-xs sm:text-sm md:text-base font-medium text-center leading-tight hidden sm:block">
                    {tab.label}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* 탭 콘텐츠 */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8">
            {/* 개요 탭 */}
            {activeTab === 'overview' && (
              <OverviewTab 
                profile={profile} 
                profileLoading={profileLoading} 
              />
            )}

            {/* 내가 틀린 푼 문제 보기 탭 */}
            {activeTab === 'wrong-quiz' && (
              <WrongQuizTab 
                wrongQuizData={wrongQuizData}
                wrongQuizLoading={wrongQuizLoading}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            )}

            {/* 카테고리별 정답률 탭 */}
            {activeTab === 'correct-rate' && (
              <CorrectRateTab 
                correctRateData={correctRateData}
                correctRateLoading={correctRateLoading}
              />
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default ProfileSection;