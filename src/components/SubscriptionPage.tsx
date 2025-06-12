import React, { useState } from 'react';
import Container from './common/Container';
import Section from './common/Section';

interface FormData {
  categories: string[];
  weekdays: string[];
  email: string;
}

interface FormErrors {
  category?: string;
  weekdays?: string;
  verification?: string;
}

type Step = 'form' | 'verification' | 'success';

const SubscriptionPage: React.FC = () => {
  const [step, setStep] = useState<Step>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [emailError, setEmailError] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    categories: [],
    weekdays: [],
    email: ''
  });

  const categories = [
    { id: 'frontend', label: '프론트엔드' },
    { id: 'backend', label: '백엔드' },
    { id: 'certification', label: '자격증' }
  ];

  const weekdays = [
    { id: 'MONDAY', label: '월' },
    { id: 'TUESDAY', label: '화' },
    { id: 'WEDNESDAY', label: '수' },
    { id: 'THURSDAY', label: '목' },
    { id: 'FRIDAY', label: '금' },
    { id: 'SATURDAY', label: '토' },
    { id: 'SUNDAY', label: '일' }
  ];

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categories: [categoryId]
    }));
    if (formErrors.category) {
      setFormErrors(prev => ({ ...prev, category: undefined }));
    }
  };

  const handleWeekdayChange = (weekdayId: string) => {
    setFormData(prev => ({
      ...prev,
      weekdays: prev.weekdays.includes(weekdayId)
        ? prev.weekdays.filter(id => id !== weekdayId)
        : [...prev.weekdays, weekdayId]
    }));
    if (formErrors.weekdays) {
      setFormErrors(prev => ({ ...prev, weekdays: undefined }));
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData(prev => ({
      ...prev,
      email: email
    }));

    if (email && !validateEmail(email)) {
      setEmailError('유효하지 않은 이메일입니다.');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleVerifyEmail = async () => {
    const errors: FormErrors = {};
    
    if (formData.categories.length === 0) {
      errors.category = '최소 하나의 카테고리를 선택해주세요.';
    }
    
    if (formData.weekdays.length === 0) {
      errors.weekdays = '최소 하나의 요일을 선택해주세요.';
    }

    if (!formData.email) {
      setEmailError('이메일을 입력해주세요.');
      return;
    }

    if (!validateEmail(formData.email)) {
      setEmailError('유효하지 않은 이메일입니다.');
      return;
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setEmailError('');
    setIsLoading(true);
    
    setTimeout(() => {
      setStep('verification');
      setIsLoading(false);
    }, 1000);
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setFormErrors({});
    setIsLoading(true);
    
    setTimeout(() => {
      setStep('success');
      setIsLoading(false);
    }, 1000);
  };

  const resetForm = () => {
    setStep('form');
    setFormData({ categories: [], weekdays: [], email: '' });
    setVerificationCode('');
    setEmailError('');
    setFormErrors({});
    setIsLoading(false);
  };

  const renderFormStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
          <span className="bg-gradient-to-r from-brand-600 to-navy-600 bg-clip-text text-transparent">구독 설정</span>
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          맞춤형 CS 문제를 받아보실 설정을 완료해주세요
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">관심 있는 분야를 선택해주세요</h3>
            <div className="flex space-x-4">
              {categories.map(category => (
                <label 
                  key={category.id} 
                  className={`flex-1 flex items-center justify-center space-x-2 cursor-pointer p-4 rounded-lg border transition-all duration-300 ${
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
                  <span className={`font-medium transition-all duration-300 ${
                    formData.categories.includes(category.id) ? 'text-brand-700' : 'text-gray-700'
                  }`}>
                    {category.label}
                  </span>
                </label>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-3">* 하나의 분야를 선택해주세요</p>
            {formErrors.category && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {formErrors.category}
              </p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">문제를 받고 싶은 요일을 선택해주세요</h3>
            <div className="grid grid-cols-4 gap-3">
              {weekdays.map(weekday => (
                <label 
                  key={weekday.id} 
                  className={`flex items-center justify-center space-x-2 cursor-pointer p-3 rounded-lg border transition-all duration-300 ${
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
                  <span className={`font-medium transition-all duration-300 ${
                    formData.weekdays.includes(weekday.id) ? 'text-brand-700' : 'text-gray-700'
                  }`}>
                    {weekday.label}
                  </span>
                </label>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-3">* 최소 1개 이상 선택해주세요</p>
            {formErrors.weekdays && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {formErrors.weekdays}
              </p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">이메일 주소</h3>
            <div className="flex space-x-3 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.email}
                  onChange={handleEmailChange}
                  placeholder="example@email.com"
                  autoComplete="email"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-brand-400 outline-none transition-all duration-300 shadow-sm ${
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
                onClick={handleVerifyEmail}
                disabled={isLoading || !!emailError || !formData.email}
                className="px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-sm"
              >
                {isLoading ? '발송 중...' : '인증하기'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  const renderVerificationStep = () => (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-semibold text-gray-800 mb-3">인증 메일을 발송했습니다</h1>
        <p className="text-gray-600 mb-1">{formData.email}로</p>
        <p className="text-gray-600">인증번호가 포함된 메일을 발송했습니다.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleVerificationSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => {
                setVerificationCode(e.target.value);
                if (formErrors.verification) {
                  setFormErrors(prev => ({ ...prev, verification: undefined }));
                }
              }}
              placeholder="인증번호 6자리 입력"
              maxLength={6}
              className="w-full px-4 py-4 text-center text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400 outline-none tracking-widest"
            />
            {formErrors.verification && (
              <p className="text-red-500 text-sm mt-2 flex items-center justify-center">
                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {formErrors.verification}
              </p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '인증 중...' : '인증 완료'}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={handleVerifyEmail}
            disabled={isLoading}
            className="text-sm text-brand-400 hover:text-brand-500 underline disabled:opacity-50"
          >
            인증 메일 재발송
          </button>
        </div>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-semibold text-gray-800 mb-3">구독이 완료되었습니다!</h1>
        <p className="text-gray-600 mb-6">
          선택하신 요일에 맞춰<br />
          기술 면접 문제를 발송해드리겠습니다.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="bg-gray-50 p-6 rounded-xl mb-6">
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong className="text-gray-800">이메일:</strong> {formData.email}</p>
            <p><strong className="text-gray-800">분야:</strong> {formData.categories.map(cat => 
              categories.find(c => c.id === cat)?.label).join(', ')}</p>
            <p><strong className="text-gray-800">요일:</strong> {formData.weekdays.map(day => 
              weekdays.find(w => w.id === day)?.label).join(', ')}</p>
          </div>
        </div>

        <button
          onClick={resetForm}
          className="w-full px-4 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-300 shadow-sm"
        >
          확인
        </button>
      </div>
    </div>
  );

  return (
    <Section className="py-20 min-h-screen bg-gray-50">
      <Container>
        {step === 'form' && renderFormStep()}
        {step === 'verification' && renderVerificationStep()}
        {step === 'success' && renderSuccessStep()}
      </Container>
    </Section>
  );
};

export default SubscriptionPage;