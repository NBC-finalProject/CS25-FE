import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '../common/Container';
import Section from '../common/Section';
import { useSubscriptionById, useUpdateSubscription } from '../../hooks/useSubscription';
import { useQuizCategories } from '../../hooks/useQuiz';
import { useModal } from '../../hooks/useModal';


interface FormData {
  category: string;
  email: string;
  weekdays: string[];
  period: string;
  active: boolean;
}

interface FormErrors {
  category?: string;
  weekdays?: string;
  period?: string;
}

const SubscriptionEditSection: React.FC = () => {
  const { subscriptionId } = useParams<{ subscriptionId: string }>();
  const navigate = useNavigate();
  const { openModal, closeModal } = useModal();
  
  const [formData, setFormData] = useState<FormData>({
    category: '',
    email: '',
    weekdays: [],
    period: '',
    active: true
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // 구독정보 조회
  const { data: subscription, isLoading: subscriptionLoading, error: subscriptionError } = useSubscriptionById(subscriptionId!);
  
  // 카테고리 목록 조회
  const { data: categoriesData, isLoading: categoriesLoading } = useQuizCategories(true);

  // 구독정보 수정
  const updateMutation = useUpdateSubscription();

  const handleUpdateSuccess = () => {
    openModal({
      title: '수정 완료',
      content: (
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-700 text-lg">구독정보가 성공적으로 수정되었습니다.</p>
        </div>
      ),
      size: 'sm'
    });
  };

  const formatErrorMessage = (errorMessage: string) => {
    // "field: message" 형태의 에러가 있는지 확인
    if (errorMessage.includes(': ')) {
      // 여러 필드 에러를 파싱
      const errors = errorMessage.split(', ').map(error => {
        const [field, message] = error.split(': ');
        return { field: field?.trim(), message: message?.trim() };
      });

      return (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="flex items-start space-x-2 text-left">
              <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm text-gray-600">{error.message}</span>
            </div>
          ))}
        </div>
      );
    } else {
      // 단일 에러 메시지
      return (
        <div className="flex items-start space-x-2 text-left">
          <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
          <span className="text-sm text-gray-600">{errorMessage}</span>
        </div>
      );
    }
  };

  const handleUpdateError = (error: any) => {
    const errorMessage = error?.message || error?.response?.data?.message || '구독정보 수정에 실패했습니다.';
    
    openModal({
      title: '수정 실패',
      content: (
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-700 text-lg mb-4">구독정보 수정에 실패했습니다.</p>
          {formatErrorMessage(errorMessage)}
        </div>
      ),
      size: 'md'
    });
  };

  // 구독정보가 로드되면 폼 데이터 초기화
  useEffect(() => {
    if (subscription) {
      setFormData({
        category: subscription.category,
        email: subscription.email,
        weekdays: subscription.days,
        period: '', // 기간 연장은 기본적으로 선택하지 않음
        active: subscription.active
      });
    }
  }, [subscription]);

  // period 문자열을 월 단위 숫자로 변환
  const getMonthsFromPeriod = (period: string): number => {
    switch (period) {
      case 'ONE_MONTH':
        return 1;
      case 'THREE_MONTHS':
        return 3;
      case 'SIX_MONTHS':
        return 6;
      case 'ONE_YEAR':
        return 12;
      default:
        return 0;
    }
  };

  // 구독 기간 연장이 1년 제한을 초과하는지 확인
  const validateSubscriptionPeriod = (selectedPeriod: string): boolean => {
    if (!selectedPeriod || !subscription?.startDate || !subscription?.endDate) {
      return true; // 필요한 데이터가 없으면 검증 통과
    }

    const startDate = new Date(subscription.startDate);
    const endDate = new Date(subscription.endDate);
    const extensionMonths = getMonthsFromPeriod(selectedPeriod);
    
    // 현재 종료일에 연장 기간을 더한 날짜
    const newEndDate = new Date(endDate);
    newEndDate.setMonth(newEndDate.getMonth() + extensionMonths);
    
    // 시작일로부터 1년 후 날짜
    const oneYearFromStart = new Date(startDate);
    oneYearFromStart.setFullYear(oneYearFromStart.getFullYear() + 1);
    
    // 새로운 종료일이 시작일로부터 1년을 초과하는지 확인
    return newEndDate <= oneYearFromStart;
  };

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
    { id: 'THREE_MONTHS', label: '3개월' },
    { id: 'SIX_MONTHS', label: '6개월' },
    { id: 'ONE_YEAR', label: '1년' }
  ];

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      category: categoryId
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
    // 같은 기간을 다시 클릭하면 선택 해제 (빈 문자열로 설정)
    const newPeriod = formData.period === periodId ? '' : periodId;
    
    setFormData(prev => ({
      ...prev,
      period: newPeriod
    }));
    
    // 기간 연장 제한 실시간 검증
    if (newPeriod && !validateSubscriptionPeriod(newPeriod)) {
      setFormErrors(prev => ({ 
        ...prev, 
        period: '구독 기간 연장 시 시작일로부터 1년을 초과할 수 없습니다.' 
      }));
    } else if (formErrors.period) {
      setFormErrors(prev => ({ ...prev, period: undefined }));
    }
  };

  const handleActiveChange = (active: boolean) => {
    if (!active) {
      // 구독 해지 확인 모달
      const modalId = openModal({
        title: '구독 해지 확인',
        content: (
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-700 text-lg mb-2">구독을 해지하시겠습니까?</p>
            <p className="text-gray-600 text-sm mb-6">구독을 해지하면 문제 발송이 중단됩니다.</p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  closeModal(modalId);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    active: false
                  }));
                  closeModal(modalId);
                }}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                해지
              </button>
            </div>
          </div>
        ),
        size: 'sm'
      });
    } else {
      setFormData(prev => ({
        ...prev,
        active: active
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: FormErrors = {};
    
    if (!formData.category) {
      errors.category = '카테고리를 선택해주세요.';
    }
    
    if (formData.weekdays.length === 0) {
      errors.weekdays = '최소 하나의 요일을 선택해주세요.';
    }

    // 구독 기간 연장 제한 검증
    if (formData.period && !validateSubscriptionPeriod(formData.period)) {
      errors.period = '구독 기간 연장 시 시작일로부터 1년을 초과할 수 없습니다.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    
    const requestData = {
      category: formData.category,
      email: formData.email,
      days: formData.weekdays,
      period: getMonthsFromPeriod(formData.period),
      active: formData.active,
    };
    
    updateMutation.mutate({
      subscriptionId: subscriptionId!,
      data: requestData
    }, {
      onSuccess: handleUpdateSuccess,
      onError: handleUpdateError,
    });
  };

  if (subscriptionLoading) {
    return (
      <Section className="py-20 bg-gray-50">
        <Container>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">구독정보를 불러오는 중...</p>
          </div>
        </Container>
      </Section>
    );
  }

  if (subscriptionError || !subscription) {
    return (
      <Section className="py-20 bg-gray-50">
        <Container>
          <div className="text-center">
            <p className="text-red-600">구독정보를 불러올 수 없습니다.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
            >
              홈으로 돌아가기
            </button>
          </div>
        </Container>
      </Section>
    );
  }

  const subscriptionData = subscription;

  return (
    <Section className="py-20 bg-gray-50">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">구독정보 수정</h1>
              <p className="text-gray-600">구독 설정을 변경할 수 있습니다.</p>
            </div>

            {/* 이메일 정보 (수정 불가) */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-600 mb-1">이메일 주소</h3>
              <p className="text-lg font-bold text-gray-900">{subscriptionData?.email}</p>
              <p className="text-sm text-gray-500 mt-1">이메일은 변경할 수 없습니다.</p>
            </div>

            {/* 구독 정보 */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">구독 정보</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">구독 시작일</span>
                  <span className="text-sm font-medium text-gray-900">{subscriptionData?.startDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">구독 종료일</span>
                  <span className="text-sm font-medium text-gray-900">{subscriptionData?.endDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">구독 진행일</span>
                  <span className="text-sm font-medium text-brand-600">
                    {subscriptionData?.startDate ? Math.ceil((new Date().getTime() - new Date(subscriptionData.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0}일차
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">구독 상태</span>
                  <span className={`text-sm font-medium ${subscriptionData?.active ? 'text-green-600' : 'text-red-600'}`}>
                    {subscriptionData?.active ? '활성화' : '비활성화'}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 구독 활성화 설정 */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3">구독 활성화</h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">문제 발송 활성화</p>
                    <p className="text-sm text-gray-500">구독을 일시정지하거나 다시 시작할 수 있습니다.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleActiveChange(!formData.active)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                      formData.active ? 'bg-brand-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        formData.active ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* 카테고리 선택 */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3">관심 있는 분야</h3>
                {categoriesLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="text-gray-500">카테고리를 불러오는 중...</div>
                  </div>
                ) : (
                  <div className="flex space-x-3">
                    {categories.map(category => (
                      <label 
                        key={category.id} 
                        className={`flex-1 flex items-center justify-center space-x-2 cursor-pointer p-3 rounded-lg border transition-all duration-300 ${
                          formData.category === category.id
                            ? 'border-brand-400 bg-brand-50 shadow-sm' 
                            : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                      >
                        <div className="relative">
                          <input
                            type="radio"
                            name="category"
                            checked={formData.category === category.id}
                            onChange={() => handleCategoryChange(category.id)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                            formData.category === category.id
                              ? 'border-brand-400 bg-gradient-to-r from-brand-500 to-brand-600'
                              : 'border-gray-300'
                          }`}>
                            <div className={`w-2 h-2 rounded-full bg-white transition-all duration-300 transform ${
                              formData.category === category.id ? 'scale-100' : 'scale-0'
                            }`} />
                          </div>
                        </div>
                        <span className={`text-sm font-medium transition-all duration-300 ${
                          formData.category === category.id ? 'text-brand-700' : 'text-gray-700'
                        }`}>
                          {category.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
                {formErrors.category && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {formErrors.category}
                  </p>
                )}
              </div>

              {/* 요일 선택 */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3">문제를 받고 싶은 요일</h3>
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
                      <span className={`text-sm font-medium transition-all duration-300 ${
                        formData.weekdays.includes(weekday.id) ? 'text-brand-700' : 'text-gray-700'
                      }`}>
                        {weekday.label}
                      </span>
                    </label>
                  ))}
                </div>
                {formErrors.weekdays && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {formErrors.weekdays}
                  </p>
                )}
              </div>

              {/* 구독 기간 연장 */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3">구독 기간 연장</h3>
                <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    선택사항: 선택한 기간은 현재 구독 종료일({subscriptionData?.endDate})로부터 추가됩니다.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {periods.map(period => (
                    <button
                      key={period.id}
                      type="button"
                      onClick={() => handlePeriodChange(period.id)}
                      className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-all duration-300 ${
                        formData.period === period.id
                          ? 'border-brand-400 bg-brand-50 shadow-sm'
                          : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <div className="relative">
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
                      <span className={`text-sm font-medium transition-all duration-300 ${
                        formData.period === period.id ? 'text-brand-700' : 'text-gray-700'
                      }`}>
                        {period.label}
                      </span>
                    </button>
                  ))}
                </div>
                {formErrors.period && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {formErrors.period}
                  </p>
                )}
              </div>

              {/* 버튼들 */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending || (!!formData.period && !validateSubscriptionPeriod(formData.period))}
                  className="flex-1 font-bold px-4 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateMutation.isPending ? '수정 중...' : '수정하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default SubscriptionEditSection;