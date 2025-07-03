import React from 'react';
import { getCategoryLabel } from '../../../../utils/categoryUtils';
import { FormData, FormErrors } from '../types';

interface FormStepProps {
  formData: FormData;
  formErrors: FormErrors;
  emailError: string;
  categoriesData: any;
  categoriesLoading: boolean;
  onFormDataChange: (data: Partial<FormData>) => void;
  onVerifyEmail: () => void;
  onEmailChange: (email: string) => void;
  checkEmailMutation: any;
  emailVerificationMutation: any;
}

const FormStep: React.FC<FormStepProps> = ({
  formData,
  formErrors,
  emailError,
  categoriesData,
  categoriesLoading,
  onFormDataChange,
  onVerifyEmail,
  onEmailChange,
  checkEmailMutation,
  emailVerificationMutation
}) => {
  // API 응답이 {data: []} 형태인지 확인하고 처리
  const categoryList = (categoriesData && typeof categoriesData === 'object' && 'data' in categoriesData) 
    ? categoriesData.data 
    : categoriesData;
  const categories = Array.isArray(categoryList) ? categoryList.map((category: string) => ({
    id: category,
    label: getCategoryLabel(category)
  })) : [];

  const weekdays = [
    { id: 'MONDAY', label: '월' },
    { id: 'TUESDAY', label: '화' },
    { id: 'WEDNESDAY', label: '수' },
    { id: 'THURSDAY', label: '목' },
    { id: 'FRIDAY', label: '금' },
    { id: 'SATURDAY', label: '토' },
    { id: 'SUNDAY', label: '일' }
  ];

  const periods = [
    { id: 'ONE_MONTH', label: '1개월' },
    { id: 'THREE_MONTHS', label: '3개월' },
    { id: 'SIX_MONTHS', label: '6개월' },
    { id: 'ONE_YEAR', label: '1년' }
  ];

  const handleCategoryChange = (categoryId: string) => {
    onFormDataChange({ categories: [categoryId] }); // 단일 선택만 허용
  };

  const handleWeekdayChange = (weekdayId: string) => {
    const newWeekdays = formData.weekdays.includes(weekdayId)
      ? formData.weekdays.filter(id => id !== weekdayId)
      : [...formData.weekdays, weekdayId];
    onFormDataChange({ weekdays: newWeekdays });
  };

  const handlePeriodChange = (periodId: string) => {
    onFormDataChange({ period: periodId });
  };

  return (
    <form className="space-y-4">
      {/* 질문 카테고리 */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">관심 있는 분야를 선택해주세요</h3>
        {categoriesLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="text-gray-500">카테고리를 불러오는 중...</div>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex items-center justify-center py-4">
            <div className="text-gray-500">사용 가능한 카테고리가 없습니다.</div>
          </div>
        ) : (
          <div className="flex space-x-3">
            {categories.map(category => (
            <label 
              key={category.id} 
              className={`flex-1 flex items-center justify-center space-x-2 cursor-pointer p-2 rounded-lg border transition-all duration-300 ${
                formData.categories.includes(category.id) 
                  ? 'border-brand-400 bg-brand-50 shadow-sm' 
                  : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              <div className="relative">
                <input
                  type="radio"
                  name="category"
                  checked={formData.categories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                  formData.categories.includes(category.id)
                    ? 'border-brand-400 bg-gradient-to-r from-brand-500 to-brand-600'
                    : 'border-gray-300'
                }`}>
                  <div className={`w-2 h-2 rounded-full bg-white transition-all duration-300 transform ${
                    formData.categories.includes(category.id) ? 'scale-100' : 'scale-0'
                  }`} />
                </div>
              </div>
              <span className={`text-sm font-medium transition-all duration-300 shadow-sm ${
                formData.categories.includes(category.id) ? 'text-brand-700' : 'text-gray-700'
              }`}>
                {category.label}
              </span>
            </label>
            ))}
          </div>
        )}
        <p className="text-sm text-gray-500 mt-2">* 하나의 분야를 선택해주세요</p>
        {formErrors.category && (
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {formErrors.category}
          </p>
        )}
      </div>

      {/* 문제 받는 주기 */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">문제를 받고 싶은 요일을 선택해주세요</h3>
        <div className="grid grid-cols-4 gap-3">
          {weekdays.map(weekday => (
            <label 
              key={weekday.id} 
              className={`flex items-center justify-center space-x-2 cursor-pointer p-2 rounded-lg border transition-all duration-300 ${
                formData.weekdays.includes(weekday.id)
                  ? 'border-brand-400 bg-brand-50 shadow-sm'
                  : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.weekdays.includes(weekday.id)}
                  onChange={() => handleWeekdayChange(weekday.id)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border-2 transition-all duration-300 flex items-center justify-center ${
                  formData.weekdays.includes(weekday.id)
                    ? 'border-brand-400 bg-gradient-to-r from-brand-500 to-brand-600'
                    : 'border-gray-300'
                }`}>
                  <svg 
                    className={`w-2.5 h-2.5 text-white transition-all duration-300 transform ${
                      formData.weekdays.includes(weekday.id) ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                    }`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <span className={`text-sm font-medium transition-all duration-300 shadow-sm ${
                formData.weekdays.includes(weekday.id) ? 'text-brand-700' : 'text-gray-700'
              }`}>
                {weekday.label}
              </span>
            </label>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">* 최소 1개 이상 선택해주세요</p>
        {formErrors.weekdays && (
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {formErrors.weekdays}
          </p>
        )}
      </div>

      {/* 구독 기간 선택 */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">구독 기간을 선택해주세요</h3>
        <div className="grid grid-cols-2 gap-3">
          {periods.map(period => (
            <label 
              key={period.id} 
              className={`flex items-center justify-center space-x-2 cursor-pointer p-3 rounded-lg border transition-all duration-300 ${
                formData.period === period.id
                  ? 'border-brand-400 bg-brand-50 shadow-sm'
                  : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              <div className="relative">
                <input
                  type="radio"
                  name="period"
                  checked={formData.period === period.id}
                  onChange={() => handlePeriodChange(period.id)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                  formData.period === period.id
                    ? 'border-brand-400 bg-gradient-to-r from-brand-500 to-brand-600'
                    : 'border-gray-300'
                }`}>
                  <div className={`w-2 h-2 rounded-full bg-white transition-all duration-300 transform ${
                    formData.period === period.id ? 'scale-100' : 'scale-0'
                  }`} />
                </div>
              </div>
              <span className={`text-sm font-medium transition-all duration-300 shadow-sm ${
                formData.period === period.id ? 'text-brand-700' : 'text-gray-700'
              }`}>
                {period.label}
              </span>
            </label>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">* 구독 기간을 선택해주세요</p>
        {formErrors.period && (
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {formErrors.period}
          </p>
        )}
      </div>

      {/* 이메일 입력 */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">이메일 주소</h3>
        <div className="flex space-x-2 items-start">
          <div className="flex-1">
            <input
              type="email"
              name="email"
              inputMode="email"
              value={formData.email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="example@email.com"
              className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:border-brand-400 outline-none transition-all duration-300 shadow-sm ${
                emailError 
                  ? 'border-red-300 focus:ring-red-400 focus:border-red-400' 
                  : 'border-gray-300 focus:ring-brand-400'
              }`}
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {emailError}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onVerifyEmail}
            disabled={checkEmailMutation.isPending || emailVerificationMutation.isPending || !!emailError || !formData.email}
            className="px-4 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 text-sm shadow-sm"
          >
            {checkEmailMutation.isPending ? '확인 중...' : emailVerificationMutation.isPending ? '발송 중...' : '인증하기'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default FormStep;