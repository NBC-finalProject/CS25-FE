import React from "react";
import { getSubCategoryLabel } from "../../../utils/categoryUtils";

interface CorrectRateData {
  correctRates: {
    [key: string]: number;
  };
}

interface CorrectRateTabProps {
  correctRateData: CorrectRateData | undefined;
  correctRateLoading: boolean;
}

const CorrectRateTab: React.FC<CorrectRateTabProps> = ({
  correctRateData,
  correctRateLoading,
}) => {
  if (correctRateLoading) {
    return (
      <div className="py-8 text-center">
        <div className="border-brand-500 mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
        <p className="mt-4 text-gray-600">정답률 데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (!correctRateData || !correctRateData.correctRates) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-600">정답률 데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  // 통계 계산
  const rates = Object.values(correctRateData.correctRates);
  const excellentCategories = rates.filter((rate) => Number(rate) >= 80).length;

  // 0.0인 값들을 제외하고 평균 계산
  const nonZeroRates = rates.filter((rate) => Number(rate) > 0);
  const averageRate =
    nonZeroRates.length > 0
      ? nonZeroRates.reduce((sum, rate) => sum + Number(rate), 0) /
        nonZeroRates.length
      : 0;

  const needImprovementCategories = rates.filter(
    (rate) => Number(rate) < 60,
  ).length;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">카테고리별 정답률</h3>

      {/* 세로 차트 그래프 */}
      {/* <div className="group mb-6 rounded-xl border border-blue-100 bg-white p-4 shadow-sm sm:p-6">
        <h4 className="mb-3 text-base font-semibold text-gray-900 sm:mb-4 sm:text-lg">
          정답률 차트
        </h4>
        <div className="relative h-48 w-full rounded-lg bg-gray-50 p-3 sm:h-56 sm:p-4">
          <div
            className={`flex h-full items-end justify-center ${
              Object.keys(correctRateData.correctRates).length > 6
                ? "gap-1 sm:gap-2"
                : "gap-2 sm:gap-4"
            }`}
          >
            {Object.entries(correctRateData.correctRates).map(
              ([category, rate], index) => {
                const rateNum = Number(rate);
                const heightPx = Math.max(12, (rateNum / 100) * 140); // 모바일에서 더 큰 최소 높이
                const opacity =
                  rateNum === 0
                    ? 0.5
                    : Math.max(0.7, Math.min(1, rateNum / 100 + 0.3));

                // 그라데이션 색상 결정
                const getBarGradient = (rate: number) => {
                  if (rate >= 80)
                    return "bg-gradient-to-t from-blue-500 to-blue-600";
                  if (rate >= 60)
                    return "bg-gradient-to-t from-blue-400 to-blue-500";
                  if (rate >= 40)
                    return "bg-gradient-to-t from-blue-300 to-blue-400";
                  if (rate >= 20)
                    return "bg-gradient-to-t from-blue-200 to-blue-300";
                  return "bg-gradient-to-t from-gray-400 to-gray-500";
                };

                const getHoverColor = (rate: number) => {
                  if (rate >= 80)
                    return "hover:from-blue-600 hover:to-blue-700";
                  if (rate >= 60)
                    return "hover:from-blue-500 hover:to-blue-600";
                  if (rate >= 40)
                    return "hover:from-blue-400 hover:to-blue-500";
                  if (rate >= 20)
                    return "hover:from-blue-300 hover:to-blue-400";
                  return "hover:from-gray-500 hover:to-gray-600";
                };

                const categoryCount = Object.keys(
                  correctRateData.correctRates,
                ).length;

                return (
                  <div
                    key={category}
                    className={`group/bar flex flex-col items-center ${
                      categoryCount > 8
                        ? "min-w-10 flex-1 sm:min-w-12"
                        : categoryCount > 6
                          ? "min-w-12 flex-1 sm:min-w-14"
                          : categoryCount > 4
                            ? "min-w-14 flex-1 sm:min-w-16"
                            : "min-w-16 flex-1 sm:min-w-20"
                    }`}
                  >
                    <div className="flex h-36 w-full flex-col justify-end sm:h-40">
                      <div
                        className={`w-full ${getBarGradient(rateNum)} ${getHoverColor(rateNum)} group relative cursor-pointer touch-manipulation rounded-t-md shadow-sm transition-all duration-1000 ease-out hover:shadow-md sm:rounded-t-lg`}
                        style={{
                          height: isVisible ? `${heightPx}px` : "0px",
                          opacity: opacity,
                          transitionDelay: `${index * 100}ms`,
                        }}
                        title={`${getSubCategoryLabel(category) || category}: ${rateNum.toFixed(1)}%`}
                      >
                        <div className="absolute inset-0 rounded-t-md bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:rounded-t-lg"></div>

                        <div className="absolute -inset-2 sm:hidden"></div>

                        <div
                          className={`absolute -top-4 left-1/2 -translate-x-1/2 transform text-xs font-semibold transition-colors duration-300 sm:-top-5 ${
                            rateNum >= 60 ? "text-blue-700" : "text-gray-600"
                          }`}
                        >
                          {(rateNum >= 5 && categoryCount <= 6) ||
                          (rateNum >= 10 && categoryCount > 6)
                            ? rateNum.toFixed(0) + "%"
                            : ""}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 text-center sm:mt-3">
                      <div
                        className={`truncate font-medium text-gray-700 ${
                          categoryCount > 8
                            ? "max-w-10 text-[9px] sm:text-[10px]"
                            : categoryCount > 6
                              ? "max-w-12 text-[10px] sm:text-xs"
                              : categoryCount > 4
                                ? "max-w-14 text-xs"
                                : "max-w-16 text-xs sm:text-sm"
                        }`}
                      >
                        {categoryCount > 8
                          ? getSubCategoryLabel(category)
                              ?.split(" ")[0]
                              ?.slice(0, 3) || category.slice(0, 3)
                          : categoryCount > 6
                            ? getSubCategoryLabel(category)
                                ?.split(" ")[0]
                                ?.slice(0, 4) || category.slice(0, 4)
                            : getSubCategoryLabel(category)?.split(" ")[0] ||
                              category.slice(0, 6)}
                      </div>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div> */}

      {/* 애니메이션 바 차트 */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        {/* <h4 className="mb-4 text-lg font-semibold text-gray-900">
          카테고리별 세부 정답률
        </h4> */}
        <div className="space-y-6">
          {Object.entries(correctRateData.correctRates).map(
            ([category, rate], index) => {
              const rateNum = Number(rate);
              const delay = index * 100; // 순차적 애니메이션
              const opacity = Math.max(0.3, Math.min(1, rateNum / 100)); // 투명도 계산

              return (
                <div key={category} className="group">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      {getSubCategoryLabel(category) || category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-blue-600 transition-colors duration-300">
                        {rateNum.toFixed(1)}%
                      </span>
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                    </div>
                  </div>

                  <div className="relative h-4 overflow-hidden rounded-full bg-gray-100">
                    {/* 배경 그라데이션 */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-50 to-gray-100" />

                    {/* 메인 바 */}
                    <div
                      className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-1000 ease-out"
                      style={{
                        width: `${Math.max(rateNum, 3)}%`,
                        opacity: opacity,
                        animationDelay: `${delay}ms`,
                        animation: `slideInX 1.2s ease-out ${delay}ms forwards`,
                        transformOrigin: "left center",
                      }}
                    >
                      {/* 반짝이는 효과 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:animate-pulse group-hover:opacity-100" />

                      {/* 글로우 효과 */}
                      <div className="absolute inset-0 rounded-full bg-blue-300 opacity-50 blur-sm" />
                    </div>

                    {/* 호버 시 확장 효과 */}
                    <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="border-brand-100 from-brand-50 to-brand-100 group rounded-xl border bg-gradient-to-br p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <div className="text-center">
            <div className="from-brand-500 to-brand-600 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r shadow-lg transition-transform duration-300 group-hover:scale-110">
              <svg
                className="h-6 w-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="text-brand-700 group-hover:text-brand-800 mb-1 text-2xl font-bold transition-colors duration-300">
              {excellentCategories}
            </div>
            <div className="text-brand-800 text-sm font-medium">
              우수한 카테고리
            </div>
            <div className="text-brand-600 mt-1 text-xs">(80% 이상)</div>
          </div>
        </div>

        <div className="border-navy-100 from-navy-50 to-navy-100 group rounded-xl border bg-gradient-to-br p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <div className="text-center">
            <div className="from-navy-500 to-navy-600 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r shadow-lg transition-transform duration-300 group-hover:scale-110">
              <svg
                className="h-6 w-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="text-navy-700 group-hover:text-navy-800 mb-1 text-2xl font-bold transition-colors duration-300">
              {averageRate.toFixed(1)}%
            </div>
            <div className="text-navy-800 text-sm font-medium">전체 평균</div>
            <div className="text-navy-600 mt-1 text-xs">정답률</div>
          </div>
        </div>

        <div className="group rounded-xl border border-red-100 bg-gradient-to-br from-red-50 to-red-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600 shadow-lg transition-transform duration-300 group-hover:scale-110">
              <svg
                className="h-6 w-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="mb-1 text-2xl font-bold text-red-700 transition-colors duration-300 group-hover:text-red-800">
              {needImprovementCategories}
            </div>
            <div className="text-sm font-medium text-red-800">개선 필요</div>
            <div className="mt-1 text-xs text-red-600">(60% 미만)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrectRateTab;
