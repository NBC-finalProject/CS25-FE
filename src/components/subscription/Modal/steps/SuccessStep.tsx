import React from 'react';
import { FormData } from '../types';

interface SuccessStepProps {
  formData: FormData;
  onClose: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ formData, onClose }) => {
  const weekdayLabels: { [key: string]: string } = {
    'MONDAY': '월요일',
    'TUESDAY': '화요일',
    'WEDNESDAY': '수요일',
    'THURSDAY': '목요일',
    'FRIDAY': '금요일',
    'SATURDAY': '토요일',
    'SUNDAY': '일요일'
  };

  const periodLabels: { [key: string]: string } = {
    'ONE_MONTH': '1개월',
    'THREE_MONTHS': '3개월',
    'SIX_MONTHS': '6개월',
    'ONE_YEAR': '1년'
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900">🎉 구독 완료!</h2>
        <p className="text-gray-600">구독이 성공적으로 완료되었습니다.</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-3">구독 정보</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">이메일:</span>
            <span className="font-medium">{formData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">구독 기간:</span>
            <span className="font-medium">{periodLabels[formData.period] || formData.period}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">수신 요일:</span>
            <span className="font-medium">
              {formData.weekdays.map(day => weekdayLabels[day] || day).join(', ')}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              선택하신 요일에 새로운 CS 문제가 이메일로 전송됩니다. 
              정기적인 학습으로 실력을 향상시켜보세요!
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full bg-gradient-to-r from-brand-500 to-brand-600 text-white py-3 px-4 rounded-lg font-medium hover:from-brand-600 hover:to-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all duration-300"
      >
        완료
      </button>
    </div>
  );
};

export default SuccessStep;