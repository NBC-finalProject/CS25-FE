import React from 'react';
import { getSubCategoryLabel } from '../../../utils/categoryUtils';

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
  correctRateLoading 
}) => {
  if (correctRateLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">정답률 데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (!correctRateData || !correctRateData.correctRates) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">정답률 데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  // 통계 계산
  const rates = Object.values(correctRateData.correctRates);
  const excellentCategories = rates.filter(rate => Number(rate) >= 80).length;
  const averageRate = rates.length > 0 ? rates.reduce((sum, rate) => sum + Number(rate), 0) / rates.length : 0;
  const needImprovementCategories = rates.filter(rate => Number(rate) < 60).length;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">카테고리별 정답률</h3>
      
      {/* 바 차트 */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="space-y-4">
          {Object.entries(correctRateData.correctRates).map(([category, rate]) => {
            const rateNum = Number(rate);
            return (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{getSubCategoryLabel(category) || category}</span>
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
        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-green-600 mb-1">{excellentCategories}</div>
            <div className="text-sm text-green-700 font-medium">우수한 카테고리</div>
            <div className="text-xs text-green-600 mt-1">(80% 이상)</div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">{averageRate.toFixed(1)}%</div>
            <div className="text-sm text-blue-700 font-medium">전체 평균</div>
            <div className="text-xs text-blue-600 mt-1">정답률</div>
          </div>
        </div>

        <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
          <div className="text-center">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-amber-600 mb-1">{needImprovementCategories}</div>
            <div className="text-sm text-amber-700 font-medium">개선 필요</div>
            <div className="text-xs text-amber-600 mt-1">(60% 미만)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrectRateTab;