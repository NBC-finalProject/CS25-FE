import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile, useUserWrongQuiz, useUserCorrectRate } from '../../hooks';
import Container from '../common/Container';
import Section from '../common/Section';


interface WrongQuizDto {
  question: string;
  userAnswer: string;
  answer: string;
  commentary: string;
}




const ProfileSection: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'wrong-quiz' | 'correct-rate'>('overview');

  // 사용자 프로필 조회
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  // 틀린 문제 조회
  const { data: wrongQuizData, isLoading: wrongQuizLoading } = useUserWrongQuiz(activeTab === 'wrong-quiz');

  // 카테고리별 정답률 조회
  const { data: correctRateData, isLoading: correctRateLoading } = useUserCorrectRate(activeTab === 'correct-rate');

  // 구독 수정 페이지로 이동
  const handleEditSubscription = () => {
    if (profile?.subscriptionId) {
      navigate(`/subscriptions/${profile.subscriptionId}`);
    }
  };


  if (profileLoading) {
    return (
      <Section className="py-20 bg-gray-50">
        <Container>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">프로필을 불러오는 중...</p>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="py-20 bg-gray-50">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-brand-100 rounded-full px-6 py-2 mb-8">
              <svg className="w-4 h-4 mr-2 text-brand-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-brand-700">마이페이지</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              나의 <span className="bg-gradient-to-r from-brand-600 to-navy-600 bg-clip-text text-transparent">프로필</span>
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              학습 현황과 성과를 확인해보세요!
            </p>
          </div>

          {/* 프로필 카드 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* 프로필 이미지 */}
              <div className="w-24 h-24 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {profile?.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              
              {/* 프로필 정보 */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {profile?.name || '사용자'}
                </h2>
                
                {/* 통계 */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">{profile?.score || 0}</div>
                    <div className="text-sm text-blue-700">점수</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">#{profile?.rank || 0}</div>
                    <div className="text-sm text-green-700">랭킹</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="mb-8">
            <div className="bg-gray-100 p-1 rounded-2xl shadow-inner">
              <nav className="flex gap-1">
                {[
                  { 
                    key: 'overview', 
                    label: '개요',
                    mobileLabel: '개요',
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )
                  },
                  { 
                    key: 'wrong-quiz', 
                    label: '틀린 문제 보기',
                    mobileLabel: '틀린 문제',
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    )
                  },
                  { 
                    key: 'correct-rate', 
                    label: '카테고리별 정답률',
                    mobileLabel: '정답률',
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                    )
                  }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex-1 py-3 px-2 sm:px-4 rounded-xl font-medium transition-all duration-300 flex flex-col items-center justify-center gap-1 sm:gap-2 min-h-[70px] sm:min-h-[80px] ${
                      activeTab === tab.key
                        ? 'bg-white text-brand-600 shadow-md transform scale-[1.02]'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <div className={`transition-transform duration-300 ${
                      activeTab === tab.key ? 'scale-110' : ''
                    }`}>
                      {tab.icon}
                    </div>
                    <span className="text-xs sm:text-sm leading-tight text-center">
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.mobileLabel}</span>
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* 탭 콘텐츠 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              {/* 개요 탭 */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 text-center">프로필 정보</h3>
                  
                  {/* 기본 정보 */}
                  <div className="bg-gray-50 rounded-xl p-8">
                    <div className="max-w-2xl mx-auto">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div className="text-2xl font-bold text-brand-600 mb-2">{profile?.name || '사용자'}</div>
                          <div className="text-sm text-gray-600">이름</div>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="text-2xl font-bold text-blue-600 mb-2">{profile?.score || 0}</div>
                          <div className="text-sm text-gray-600">현재 점수</div>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M5 16L3 14l5.5-1L12 7l3.5 6L21 14l-2 2-7-1.5L5 16zm7-12A3 3 0 0 0 9 7a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3zm-6 6.5c0-2.5 2-4.5 4.5-4.5h1c2.5 0 4.5 2 4.5 4.5V12h2l-2 8H7l-2-8h2v-1.5z"/>
                            </svg>
                          </div>
                          <div className="text-2xl font-bold text-green-600 mb-2">#{profile?.rank || 0}</div>
                          <div className="text-sm text-gray-600">현재 랭킹</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 구독 관리 */}
                  {profile?.subscriptionId && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">구독 관리</h4>
                        <p className="text-gray-600 mb-6">이메일 알림 설정을 관리하세요</p>
                        <button
                          onClick={handleEditSubscription}
                          className="px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-300 font-medium shadow-sm inline-flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          구독 수정하기
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 안내 메시지 */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8 border border-amber-100">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">학습 팁</h4>
                      <p className="text-gray-700">
                        꾸준한 문제 풀이를 통해 점수를 높이고 랭킹을 올려보세요!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 내가 틀린 푼 문제 보기 탭 */}
              {activeTab === 'wrong-quiz' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900">틀린 문제 보기</h3>
                  
                  {wrongQuizLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
                      <p className="mt-4 text-gray-600">틀린 문제를 불러오는 중...</p>
                    </div>
                  ) : wrongQuizData && wrongQuizData.wrongQuizList && wrongQuizData.wrongQuizList.length > 0 ? (
                    <div className="space-y-4">
                      {wrongQuizData.wrongQuizList.map((quiz: WrongQuizDto, index: number) => (
                        <div key={index} className="bg-red-50 rounded-xl p-6 border border-red-100">
                          <h4 className="font-medium text-gray-900 mb-4 text-lg">
                            {quiz.question}
                          </h4>
                          
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <span className="text-red-600 font-medium min-w-0">내 답안:</span>
                              <span className="text-red-700 bg-red-100 px-3 py-1 rounded-lg">
                                {quiz.userAnswer}
                              </span>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <span className="text-green-600 font-medium min-w-0">정답:</span>
                              <span className="text-green-700 bg-green-100 px-3 py-1 rounded-lg">
                                {quiz.answer}
                              </span>
                            </div>
                            
                            {quiz.commentary && (
                              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="flex items-start gap-2">
                                  <span className="text-blue-600 font-medium">💡 해설:</span>
                                  <p className="text-blue-700 leading-relaxed">
                                    {quiz.commentary}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">완벽해요!</h4>
                      <p className="text-gray-600">아직 틀린 문제가 없습니다. 계속 열심히 해보세요!</p>
                    </div>
                  )}
                </div>
              )}

              {/* 카테고리별 정답률 탭 */}
              {activeTab === 'correct-rate' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900">카테고리별 정답률</h3>
                  
                  {correctRateLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
                      <p className="mt-4 text-gray-600">정답률 데이터를 불러오는 중...</p>
                    </div>
                  ) : correctRateData && correctRateData.correctRates && Object.keys(correctRateData.correctRates).length > 0 ? (
                    <div className="space-y-6">
                      {/* 바 차트 */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <div className="space-y-4">
                          {Object.entries(correctRateData.correctRates).map(([category, rate]) => {
                            const rateNum = Number(rate);
                            return (
                              <div key={category} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-gray-900">{category}</span>
                                  <span className="text-sm font-medium text-brand-600">{rateNum.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                  <div 
                                    className={`h-3 rounded-full transition-all duration-700 ${
                                      rateNum >= 80 ? 'bg-green-500' : 
                                      rateNum >= 60 ? 'bg-yellow-500' : 
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${Math.max(rateNum, 5)}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* 통계 카드 */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-green-50 rounded-xl p-6 text-center">
                          <div className="text-2xl font-bold text-green-600 mb-2">
                            {Object.values(correctRateData.correctRates).filter(rate => Number(rate) >= 80).length}
                          </div>
                          <div className="text-sm text-green-700">우수한 카테고리 (≥80%)</div>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-6 text-center">
                          <div className="text-2xl font-bold text-blue-600 mb-2">
                            {(Object.values(correctRateData.correctRates).reduce((sum: number, rate) => sum + Number(rate), 0) / Object.values(correctRateData.correctRates).length).toFixed(1)}%
                          </div>
                          <div className="text-sm text-blue-700">전체 평균 정답률</div>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-6 text-center">
                          <div className="text-2xl font-bold text-orange-600 mb-2">
                            {Object.values(correctRateData.correctRates).filter(rate => Number(rate) < 60).length}
                          </div>
                          <div className="text-sm text-orange-700">개선 필요 카테고리 (&lt;60%)</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">아직 데이터가 없어요</h4>
                      <p className="text-gray-600">문제를 풀어보시면 카테고리별 정답률을 확인할 수 있습니다!</p>
                    </div>
                  )}
                </div>
              )}


          </div>
        </div>
      </Container>
    </Section>
  );
};

export default ProfileSection;