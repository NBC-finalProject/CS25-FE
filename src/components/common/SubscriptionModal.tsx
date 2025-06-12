import React, { useState } from 'react';
import Modal from './Modal';
import { useQuizCategories } from '../../hooks/useQuiz';
import { useRequestEmailVerification, useVerifyCode, useCreateSubscription, useCheckEmail } from '../../hooks';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  categories: string[];
  weekdays: string[];
  email: string;
  period: string;
}

interface FormErrors {
  category?: string;
  weekdays?: string;
  period?: string;
  verification?: string;
}

type Step = 'form' | 'verification' | 'success';

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<Step>('form');
  const [verificationCode, setVerificationCode] = useState('');
  const [emailError, setEmailError] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    categories: [],
    weekdays: [],
    email: '',
    period: ''
  });

  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useQuizCategories(isOpen);
  
  // React Query 훅들
  const checkEmailMutation = useCheckEmail();
  const emailVerificationMutation = useRequestEmailVerification();
  const verifyCodeMutation = useVerifyCode();
  const createSubscriptionMutation = useCreateSubscription();
  
  const getCategoryLabel = (category: string) => {
    switch (category.toLowerCase()) {
      case 'frontend':
        return '프론트엔드';
      case 'backend':
        return '백엔드';
      case 'certification':
        return '자격증';
      default:
        return category;
    }
  };
  
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
    { id: 'THREE_MONTH', label: '3개월' },
    { id: 'SIX_MONTH', label: '6개월' },
    { id: 'ONE_YEAR', label: '1년' }
  ];

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categories: [categoryId] // 단일 선택만 허용
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

  const handlePeriodChange = (periodId: string) => {
    setFormData(prev => ({
      ...prev,
      period: periodId
    }));
    if (formErrors.period) {
      setFormErrors(prev => ({ ...prev, period: undefined }));
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

    // 실시간 이메일 유효성 검사
    if (email && !validateEmail(email)) {
      setEmailError('유효하지 않은 이메일입니다.');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 폼 제출은 이메일 인증하기 버튼에서 처리됨
  };

  const handleVerifyEmail = async () => {
    const errors: FormErrors = {};
    
    if (formData.categories.length === 0) {
      errors.category = '최소 하나의 카테고리를 선택해주세요.';
    }
    
    if (formData.weekdays.length === 0) {
      errors.weekdays = '최소 하나의 요일을 선택해주세요.';
    }

    if (!formData.period) {
      errors.period = '구독 기간을 선택해주세요.';
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
    
    // 1단계: 이메일 중복 체크
    checkEmailMutation.mutate(formData.email, {
      onSuccess: () => {
        // 2단계: 이메일이 사용 가능하면 인증번호 전송
        emailVerificationMutation.mutate(formData.email, {
          onSuccess: () => {
            setStep('verification');
          },
          onError: (error) => {
            console.error('이메일 인증 요청 실패:', error);
            setEmailError('이메일 인증 요청에 실패했습니다. 다시 시도해주세요.');
          },
        });
      },
      onError: (error) => {
        console.error('이메일 중복 체크 실패:', error);
        setEmailError('이미 구독 중인 이메일입니다.');
      },
    });
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode) {
      setFormErrors({ verification: '인증번호를 입력해주세요.' });
      return;
    }

    setFormErrors({});
    
    // 인증 코드 확인
    verifyCodeMutation.mutate(
      { email: formData.email, code: verificationCode },
      {
        onSuccess: () => {
          // 인증 성공 후 구독 생성
          createSubscriptionMutation.mutate(
            {
              email: formData.email,
              category: formData.categories[0], // 첫 번째 선택된 카테고리만 전송
              days: formData.weekdays,
              period: formData.period,
            },
            {
              onSuccess: () => {
                setStep('success');
              },
              onError: (error) => {
                console.error('구독 생성 실패:', error);
                setFormErrors({ verification: '구독 생성에 실패했습니다. 다시 시도해주세요.' });
              },
            }
          );
        },
        onError: (error) => {
          console.error('인증 실패:', error);
          setFormErrors({ verification: '인증에 실패했습니다. 인증번호를 확인해주세요.' });
        },
      }
    );
  };

  const handleModalClose = () => {
    setStep('form');
    setFormData({ categories: [], weekdays: [], email: '', period: '' });
    setVerificationCode('');
    setEmailError('');
    setFormErrors({});
    onClose();
  };


  const renderFormStep = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 질문 카테고리 */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">관심 있는 분야를 선택해주세요</h3>
        {categoriesLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="text-gray-500">카테고리를 불러오는 중...</div>
          </div>
        ) : categoriesError ? (
          <div className="flex items-center justify-center py-4">
            <div className="text-red-500">카테고리를 불러오는데 실패했습니다.</div>
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
              onChange={handleEmailChange}
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
            onClick={handleVerifyEmail}
            disabled={checkEmailMutation.isPending || emailVerificationMutation.isPending || !!emailError || !formData.email}
            className="px-4 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 text-sm shadow-sm"
          >
            {checkEmailMutation.isPending ? '확인 중...' : emailVerificationMutation.isPending ? '발송 중...' : '인증하기'}
          </button>
        </div>
      </div>

    </form>
  );

  const renderVerificationStep = () => (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">인증 메일을 발송했습니다</h3>
        <p className="text-gray-600 mb-1">{formData.email}로</p>
        <p className="text-gray-600">인증번호가 포함된 메일을 발송했습니다.</p>
      </div>

      <form onSubmit={handleVerificationSubmit} className="space-y-4">
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
            className="w-full px-4 py-3 text-center text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400 outline-none tracking-widest"
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
          disabled={verifyCodeMutation.isPending || createSubscriptionMutation.isPending}
          className="w-full px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {verifyCodeMutation.isPending || createSubscriptionMutation.isPending ? '처리 중...' : '인증 완료'}
        </button>
      </form>

      <button
        onClick={handleVerifyEmail}
        disabled={checkEmailMutation.isPending || emailVerificationMutation.isPending}
        className="text-sm text-brand-400 hover:text-brand-500 underline disabled:opacity-50"
      >
        인증 메일 재발송
      </button>
    </div>
  );

  const renderSuccessStep = () => (
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
            <p><strong>분야:</strong> {formData.categories.map(cat => 
              categories.find(c => c.id === cat)?.label).join(', ')}</p>
            <p><strong>요일:</strong> {formData.weekdays.map(day => 
              weekdays.find(w => w.id === day)?.label).join(', ')}</p>
            <p><strong>구독 기간:</strong> {periods.find(p => p.id === formData.period)?.label}</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleModalClose}
        className="w-full px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-300 shadow-sm"
      >
        확인
      </button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} title="">
      {step === 'form' && renderFormStep()}
      {step === 'verification' && renderVerificationStep()}
      {step === 'success' && renderSuccessStep()}
    </Modal>
  );
};

export default SubscriptionModal;