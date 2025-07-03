import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../common/Container";
import Section from "../common/Section";
import EmailTemplate from "../common/EmailTemplate";
import SubscriptionSettings from "../common/SubscriptionSettings";

const TodayEmailFormSection: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto mb-8 max-w-3xl px-4 text-center sm:mb-12 sm:px-0">
          <div className="bg-brand-100 mb-6 inline-flex items-center rounded-full px-4 py-2 sm:mb-8 sm:px-6">
            <span className="text-brand-700 text-xs font-medium sm:text-sm">
              메일 미리보기
            </span>
          </div>

          <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:mb-6 sm:text-3xl md:text-4xl">
            매일 받게 될{" "}
            <span className="from-brand-600 to-navy-600 bg-gradient-to-r bg-clip-text text-transparent">
              CS 지식
            </span>
          </h2>

          <p className="mb-6 text-base leading-relaxed text-gray-600 sm:mb-8 sm:text-lg">
            아래와 같은 형태의 맞춤형 메일을 받아보실 수 있습니다.
          </p>
        </div>

        {/* Email Template Preview */}
        <div className="mx-auto max-w-4xl px-4 sm:px-0">
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
