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
    { id: 'overview' as TabType, label: '개요', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'wrong-quiz' as TabType, label: '틀린 문제 보기', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'correct-rate' as TabType, label: '카테고리별 정답률', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
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
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="px-4 sm:px-6 md:px-8">
              <nav className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 md:space-x-8 py-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
                      activeTab === tab.id
                        ? 'bg-brand-500 text-white shadow-sm'
                        : 'text-gray-600 hover:text-brand-600 hover:bg-white'
                    }`}
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                    </svg>
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
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