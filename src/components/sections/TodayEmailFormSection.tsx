import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../common/Container';
import Section from '../common/Section';
import EmailTemplate from '../common/EmailTemplate';
import SubscriptionSettings from '../common/SubscriptionSettings';

const TodayEmailFormSection: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 px-4 sm:px-0">
          <div className="inline-flex items-center bg-brand-100 rounded-full px-4 sm:px-6 py-2 mb-6 sm:mb-8">
            <span className="text-xs sm:text-sm font-medium text-brand-700">📧 메일 미리보기</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gray-900">
            매일 받게 될 <span className="bg-gradient-to-r from-brand-600 to-navy-600 bg-clip-text text-transparent">CS 지식</span>
          </h2>
          
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8">
            아래와 같은 형태의 맞춤형 메일을 받아보실 수 있습니다.
          </p>
        </div>

        {/* Email Template Preview */}
        <div className="max-w-4xl mx-auto px-4 sm:px-0">
          <EmailTemplate
            toEmail="your-email@example.com"
            quizLink="/todayQuiz"
          />
        </div>

        {/* Settings Modal */}
        <SubscriptionSettings
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </Container>
    </Section>
  );
};

export default TodayEmailFormSection;