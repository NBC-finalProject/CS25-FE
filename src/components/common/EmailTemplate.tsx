import React from 'react';
import { useNavigate } from 'react-router-dom';

interface EmailTemplateProps {
  toEmail: string;
  quizLink: string;
}

const EmailTemplate: React.FC<EmailTemplateProps> = ({ toEmail, quizLink }) => {
  const navigate = useNavigate();
  return (
    <div className="font-pretendard p-10">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header with Logo */}
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 p-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-3xl font-bold text-white">CS</span>
            <span className="text-3xl font-bold text-blue-100">25</span>
          </div>
          <h1 className="text-2xl font-bold text-white">오늘의 CS 문제</h1>
          <p className="text-brand-100 mt-2">AI가 준비한 맞춤형 문제를 확인하세요</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">오늘의 문제를 풀어보세요!</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              안녕하세요! CS25에서 오늘의 맞춤형 CS 문제를 보내드립니다.<br />
              AI가 생성한 문제와 상세한 해설로 CS 지식을 향상시켜보세요.
            </p>
          </div>

          {/* Action Button */}
          <div className="text-center mb-8">
            <button
              onClick={() => navigate('/quiz')}
              className="inline-block bg-gradient-to-r from-brand-500 to-brand-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
            >
              🧠 연습문제 풀기
            </button>
          </div>

          {/* Today's Topic Preview */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-2">오늘의 주제</h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-sm font-medium">알고리즘</span>
              <span className="bg-navy-100 text-navy-700 px-3 py-1 rounded-full text-sm font-medium">시간복잡도</span>
            </div>
          </div>

          {/* Subscription Settings */}
          <div className="text-center mb-8">
            <button
              className="inline-flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm border border-gray-200 transition-all duration-200 hover:shadow-sm"
            >
              <span className="text-base">⚙️</span>
              <span>구독 설정</span>
            </button>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6">
            <div className="text-center text-gray-500 text-sm space-y-2">
              <p>
                이 메일은 <span className="font-medium text-gray-700">{toEmail}</span> 계정으로 발송되었습니다.
              </p>
              <p>
                매일 새로운 CS 지식으로 성장하는 개발자가 되어보세요! 🚀
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplate;