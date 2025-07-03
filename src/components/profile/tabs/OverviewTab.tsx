import React from "react";
import { useNavigate } from "react-router-dom";

interface Profile {
  name?: string;
  score?: number;
  rank?: number;
  subscriptionId?: string;
}

interface OverviewTabProps {
  profile: Profile | undefined;
  profileLoading: boolean;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  profile,
  profileLoading,
}) => {
  const navigate = useNavigate();

  // 구독 수정 페이지로 이동
  const handleEditSubscription = () => {
    if (profile?.subscriptionId) {
      navigate(`/subscriptions/${profile.subscriptionId}`);
    }
  };

  if (profileLoading) {
    return (
      <div className="py-8 text-center">
        <div className="border-brand-500 mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
        <p className="mt-4 text-gray-600">프로필을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-center text-lg font-bold text-gray-900 sm:text-xl">
        프로필 정보
      </h3>

      {/* 기본 정보 */}
      <div className="rounded-lg bg-gray-50 p-4 sm:rounded-xl sm:p-6 md:p-8">
        <div className="mx-auto max-w-2xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 md:gap-8">
            <div className="text-center">
              <div className="from-brand-500 to-brand-600 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r sm:mb-4 sm:h-14 sm:w-14 md:h-16 md:w-16">
                <svg
                  className="h-6 w-6 text-white sm:h-7 sm:w-7 md:h-8 md:w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="text-brand-600 mb-1 text-lg font-bold sm:mb-2 sm:text-xl md:text-2xl">
                {profile?.name || "사용자"}
              </div>
              <div className="text-xs text-gray-600 sm:text-sm">이름</div>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 sm:mb-4 sm:h-14 sm:w-14 md:h-16 md:w-16">
                <svg
                  className="h-6 w-6 text-white sm:h-7 sm:w-7 md:h-8 md:w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="mb-1 text-lg font-bold text-blue-600 sm:mb-2 sm:text-xl md:text-2xl">
                {profile?.score || 0}
              </div>
              <div className="text-xs text-gray-600 sm:text-sm">현재 점수</div>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600 sm:mb-4 sm:h-14 sm:w-14 md:h-16 md:w-16">
                <svg
                  className="h-6 w-6 text-white sm:h-7 sm:w-7 md:h-8 md:w-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 16L3 14l5.5-1L12 7l3.5 6L21 14l-2 2-7-1.5L5 16zm7-12A3 3 0 0 0 9 7a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3zm-6 6.5c0-2.5 2-4.5 4.5-4.5h1c2.5 0 4.5 2 4.5 4.5V12h2l-2 8H7l-2-8h2v-1.5z" />
                </svg>
              </div>
              <div className="mb-1 text-lg font-bold text-green-600 sm:mb-2 sm:text-xl md:text-2xl">
                #{profile?.rank || 0}
              </div>
              <div className="text-xs text-gray-600 sm:text-sm">현재 랭킹</div>
            </div>
          </div>
        </div>
      </div>

      {/* 구독 관리 */}
      {profile?.subscriptionId && (
        <div className="rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50 p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500">
              <svg
                className="h-8 w-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h4 className="mb-2 text-xl font-bold text-gray-900">구독 관리</h4>
            <p className="mb-4 text-gray-700">
              현재 구독 중인 카테고리를 관리하고 설정을 변경할 수 있습니다.
            </p>
            <button
              onClick={handleEditSubscription}
              className="rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 font-medium text-white shadow-sm transition-all duration-300 hover:from-purple-600 hover:to-indigo-600"
            >
              구독 설정 변경
            </button>
          </div>
        </div>
      )}

      {/* 구독하지 않은 경우 */}
      {!profile?.subscriptionId && (
        <div className="rounded-xl border border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50 p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-yellow-400">
              <svg
                className="h-8 w-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <h4 className="mb-2 text-xl font-bold text-gray-900">
              이메일 구독하기
            </h4>
            <p className="mb-4 text-sm text-gray-700 sm:text-base">
              이메일 구독을 통해 매일 새로운 CS 문제를 받아보세요!
              <br className="hidden sm:block" />
              <span className="mt-1 block sm:mt-0 sm:inline">
                정기적인 학습으로 실력을 향상시킬 수 있습니다.
              </span>
            </p>
            <button
              onClick={() => {
                navigate("/?openSubscription=true");
              }}
              className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:from-purple-600 hover:to-indigo-600 sm:w-auto sm:px-6 sm:py-3 sm:text-base"
            >
              지금 구독하기
            </button>
          </div>
        </div>
      )}

      {/* 학습 팁 */}
      <div className="rounded-xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-400">
            <svg
              className="h-8 w-8 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h4 className="mb-2 text-xl font-bold text-gray-900">학습 팁</h4>
          <p className="text-gray-700">
            {profile?.subscriptionId
              ? "꾸준한 문제 풀이를 통해 점수를 높이고 랭킹을 올려보세요!"
              : "구독하시면 더 체계적인 학습이 가능합니다!"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
