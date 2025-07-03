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
  onSubmit: (e: React.FormEvent) => void;
}

const FormStep: React.FC<FormStepProps> = ({
  formData,
  formErrors,
  emailError,
  categoriesData,
  categoriesLoading,
  onFormDataChange,
  onSubmit
}) => {
  const categories = categoriesData?.data || categoriesData || [];

  const handleCategoryChange = (category: string) => {
    const newCategories = formData.categories.includes(category)
      ? formData.categories.filter(c => c !== category)
      : [...formData.categories, category];
    onFormDataChange({ categories: newCategories });
  };

  const handleWeekdayChange = (day: string) => {
    const newWeekdays = formData.weekdays.includes(day)
      ? formData.weekdays.filter(d => d !== day)
      : [...formData.weekdays, day];
    onFormDataChange({ weekdays: newWeekdays });
  };

  const weekdayOptions = [
    { value: 'MONDAY', label: '월' },
    { value: 'TUESDAY', label: '화' },
    { value: 'WEDNESDAY', label: '수' },
    { value: 'THURSDAY', label: '목' },
    { value: 'FRIDAY', label: '금' },
    { value: 'SATURDAY', label: '토' },
    { value: 'SUNDAY', label: '일' }
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 text-gray-900">📧 이메일 구독하기</h2>
        <p className="text-gray-600">매일 새로운 CS 문제를 이메일로 받아보세요!</p>
      </div>

      {/* 카테고리 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          관심 카테고리 선택 <span className="text-red-500">*</span>
        </label>
        {categoriesLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {categories.map((category: string) => (
              <label key={category} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="h-4 w-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                />
                <span className="ml-3 text-sm text-gray-700">{getCategoryLabel(category)}</span>
              </label>
            ))}
          </div>
        )}
        {formErrors.category && <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>}
      </div>

      {/* 요일 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          수신 요일 선택 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-7 gap-2">
          {weekdayOptions.map((day) => (
            <label key={day.value} className={`flex items-center justify-center p-2 border rounded-lg cursor-pointer transition-all ${
              formData.weekdays.includes(day.value)
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-gray-200 hover:bg-gray-50'
            }`}>
              <input
                type="checkbox"
                checked={formData.weekdays.includes(day.value)}
                onChange={() => handleWeekdayChange(day.value)}
                className="sr-only"
              />
              <span className="text-sm font-medium">{day.label}</span>
            </label>
          ))}
        </div>
        {formErrors.weekdays && <p className="mt-1 text-sm text-red-600">{formErrors.weekdays}</p>}
      </div>

      {/* 이메일 주소 */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          이메일 주소 <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => onFormDataChange({ email: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          placeholder="example@email.com"
          required
        />
        {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
      </div>

      {/* 구독 기간 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          구독 기간 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 gap-3">
          {[
            { value: 'ONE_MONTH', label: '1개월', price: '무료' },
            { value: 'THREE_MONTHS', label: '3개월', price: '무료' },
            { value: 'SIX_MONTHS', label: '6개월', price: '무료' },
            { value: 'ONE_YEAR', label: '1년', price: '무료' }
          ].map((option) => (
            <label key={option.value} className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
              formData.period === option.value
                ? 'border-brand-500 bg-brand-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="period"
                  value={option.value}
                  checked={formData.period === option.value}
                  onChange={(e) => onFormDataChange({ period: e.target.value })}
                  className="h-4 w-4 text-brand-600 border-gray-300 focus:ring-brand-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">{option.label}</span>
              </div>
              <span className="text-sm font-bold text-green-600">{option.price}</span>
            </label>
          ))}
        </div>
        {formErrors.period && <p className="mt-1 text-sm text-red-600">{formErrors.period}</p>}
      </div>

      {/* 제출 버튼 */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-brand-500 to-brand-600 text-white py-3 px-4 rounded-lg font-medium hover:from-brand-600 hover:to-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all duration-300"
      >
        인증 이메일 발송
      </button>
    </form>
  );
};

export default FormStep;