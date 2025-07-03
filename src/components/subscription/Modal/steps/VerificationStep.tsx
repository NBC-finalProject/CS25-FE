import React from 'react';
import { FormData, FormErrors } from '../types';

interface VerificationStepProps {
  formData: FormData;
  formErrors: FormErrors;
  verificationCode: string;
  onVerificationCodeChange: (code: string) => void;
  onVerifyCode: () => void;
  onBackToForm: () => void;
}

const VerificationStep: React.FC<VerificationStepProps> = ({
  formData,
  formErrors,
  verificationCode,
  onVerificationCodeChange,
  onVerifyCode,
  onBackToForm
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900">📧 이메일 인증</h2>
        <p className="text-gray-600 mb-2">
          <span className="font-medium text-gray-900">{formData.email}</span>로
        </p>
        <p className="text-gray-600">인증 코드를 발송했습니다. 이메일을 확인해주세요.</p>
      </div>

      <div>
        <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
          인증 코드 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="verificationCode"
          value={verificationCode}
          onChange={(e) => onVerificationCodeChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-center text-lg tracking-widest"
          placeholder="6자리 숫자"
          maxLength={6}
        />
        {formErrors.verification && <p className="mt-1 text-sm text-red-600">{formErrors.verification}</p>}
      </div>

      <div className="space-y-3">
        <button
          onClick={onVerifyCode}
          className="w-full bg-gradient-to-r from-brand-500 to-brand-600 text-white py-3 px-4 rounded-lg font-medium hover:from-brand-600 hover:to-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all duration-300"
        >
          인증 확인
        </button>
        
        <button
          onClick={onBackToForm}
          className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300"
        >
          이전으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default VerificationStep;