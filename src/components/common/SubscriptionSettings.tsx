import React, { useState } from "react";
import Modal from "./Modal";

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

const SubscriptionSettings: React.FC<SubscriptionSettingsProps> = ({
  isOpen,
  onClose,
}) => {
  const [settings, setSettings] = useState<SettingsData>({
    email: "user@example.com", // 인증된 이메일 (수정 불가)
    categories: ["알고리즘", "자료구조"],
    difficulty: "intermediate",
    frequency: "daily",
    timePreference: "morning",
  });

  const [isSaving, setIsSaving] = useState(false);

  const availableCategories = [
    "알고리즘",
    "자료구조",
    "운영체제",
    "네트워크",
    "데이터베이스",
    "컴퓨터구조",
    "소프트웨어공학",
    "보안",
  ];

  const handleCategoryChange = (category: string) => {
    setSettings((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    // 실제로는 API 호출을 하겠지만, 여기서는 시뮬레이션
    setTimeout(() => {
      setIsSaving(false);
      alert("설정이 저장되었습니다!");
      onClose();
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="구독 설정">
      <div className="space-y-6">
        {/* Email Section (Read-only) */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            이메일 주소
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="email"
              value={settings.email}
              disabled
              className="flex-1 cursor-not-allowed rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-500"
            />
            <span className="flex items-center text-sm font-medium text-green-600">
              <svg
                className="mr-1 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              인증됨
            </span>
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">
            관심 분야 선택 (최소 1개)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {availableCategories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                  settings.categories.includes(category)
                    ? "bg-brand-500 text-white"
                    : "hover:bg-brand-100 bg-gray-100 text-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Level */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            난이도 수준
          </label>
          <select
            value={settings.difficulty}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, difficulty: e.target.value }))
            }
            className="focus:ring-brand-500 focus:border-brand-500 w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2"
          >
            <option value="beginner">초급 - 기본 개념 위주</option>
            <option value="intermediate">중급 - 실무 활용 수준</option>
            <option value="advanced">고급 - 심화 이론 및 최적화</option>
          </select>
        </div>

        {/* Frequency */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            발송 빈도
          </label>
          <select
            value={settings.frequency}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, frequency: e.target.value }))
            }
            className="focus:ring-brand-500 focus:border-brand-500 w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2"
          >
            <option value="daily">매일</option>
            <option value="weekdays">평일만</option>
            <option value="weekly">주 1회</option>
          </select>
        </div>

        {/* Time Preference */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            발송 시간대
          </label>
          <select
            value={settings.timePreference}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                timePreference: e.target.value,
              }))
            }
            className="focus:ring-brand-500 focus:border-brand-500 w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2"
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
            className="flex-1 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || settings.categories.length === 0}
            className="from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 flex-1 rounded-lg bg-gradient-to-r px-6 py-3 font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "저장 중..." : "설정 저장"}
          </button>
        </div>

        {/* Unsubscribe */}
        <div className="border-t border-gray-200 pt-4 text-center">
          <button className="text-sm font-medium text-red-600 hover:text-red-700">
            구독 해지하기
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SubscriptionSettings;
