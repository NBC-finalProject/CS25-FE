import React from 'react';
import { getCategoryLabel } from '../../../../utils/categoryUtils';
import { FormData } from '../types';

interface SuccessStepProps {
  formData: FormData;
  onClose: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ formData, onClose }) => {
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

  const sortWeekdays = (selectedWeekdays: string[]) => {
    const weekdayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    return selectedWeekdays.sort((a, b) => weekdayOrder.indexOf(a) - weekdayOrder.indexOf(b));
  };

  return (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">구독이 완료되었습니다!</h3>
        <p className="text-gray-600 mb-4">
          선택하신 요일에 맞춰<br />
          기술 면접 문제를 발송해드리겠습니다.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg text-left">
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>이메일:</strong> {formData.email}</p>
            <p><strong>분야:</strong> {formData.categories.map(cat => getCategoryLabel(cat)).join(', ')}</p>
            <p><strong>요일:</strong> {sortWeekdays(formData.weekdays).map(day => 
              weekdays.find(w => w.id === day)?.label).join(', ')}</p>
            <p><strong>구독 기간:</strong> {periods.find(p => p.id === formData.period)?.label}</p>
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-300 shadow-sm"
      >
        확인
      </button>
    </div>
  );
};

export default SuccessStep;