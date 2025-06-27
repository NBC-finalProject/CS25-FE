import React, { useState } from 'react';
import Modal from './Modal';

interface SubscriptionSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SettingsData {
  email: string;
  categories: string[];
  difficulty: string;
  frequency: string;
  timePreference: string;
}

const SubscriptionSettings: React.FC<SubscriptionSettingsProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<SettingsData>({
    email: 'user@example.com', // 인증된 이메일 (수정 불가)
    categories: ['알고리즘', '자료구조'],
    difficulty: 'intermediate',
    frequency: 'daily',
    timePreference: 'morning'
  });

  const [isSaving, setIsSaving] = useState(false);

  const availableCategories = [
    '알고리즘', '자료구조', '운영체제', '네트워크', 
    '데이터베이스', '컴퓨터구조', '소프트웨어공학', '보안'
  ];

  const handleCategoryChange = (category: string) => {
    setSettings(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // 실제로는 API 호출을 하겠지만, 여기서는 시뮬레이션
    setTimeout(() => {
      setIsSaving(false);
      alert('설정이 저장되었습니다!');
      onClose();
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="구독 설정">
      <div className="space-y-6">
        {/* Email Section (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이메일 주소
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="email"
              value={settings.email}
              disabled
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <span className="flex items-center text-green-600 text-sm font-medium">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              인증됨
            </span>
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            관심 분야 선택 (최소 1개)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {availableCategories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  settings.categories.includes(category)
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-brand-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            난이도 수준
          </label>
          <select
            value={settings.difficulty}
            onChange={(e) => setSettings(prev => ({ ...prev, difficulty: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          >
            <option value="beginner">초급 - 기본 개념 위주</option>
            <option value="intermediate">중급 - 실무 활용 수준</option>
            <option value="advanced">고급 - 심화 이론 및 최적화</option>
          </select>
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            발송 빈도
          </label>
          <select
            value={settings.frequency}
            onChange={(e) => setSettings(prev => ({ ...prev, frequency: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          >
            <option value="daily">매일</option>
            <option value="weekdays">평일만</option>
            <option value="weekly">주 1회</option>
          </select>
        </div>

        {/* Time Preference */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            발송 시간대
          </label>
          <select
            value={settings.timePreference}
            onChange={(e) => setSettings(prev => ({ ...prev, timePreference: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          >
            <option value="morning">오전 (9:00)</option>
            <option value="lunch">점심 (12:00)</option>
            <option value="evening">저녁 (18:00)</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || settings.categories.length === 0}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg font-medium hover:from-brand-600 hover:to-brand-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? '저장 중...' : '설정 저장'}
          </button>
        </div>

        {/* Unsubscribe */}
        <div className="pt-4 border-t border-gray-200 text-center">
          <button className="text-sm text-red-600 hover:text-red-700 font-medium">
            구독 해지하기
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SubscriptionSettings;