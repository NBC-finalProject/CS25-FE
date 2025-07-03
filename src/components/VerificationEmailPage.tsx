import React from "react";
import Container from "./common/Container";
import Section from "./common/Section";

const VerificationEmailPage: React.FC = () => {
  // URL 파라미터나 상태에서 인증코드를 받을 수 있지만, 예시로 고정값 사용
  const verificationCode = "123456";

  return (
    <Section className="min-h-screen bg-gray-50 py-20">
      <Container>
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mb-6 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">CS</span>
                <span className="text-3xl font-bold text-blue-600">25</span>
              </div>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <svg
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                인증코드
              </h1>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-gray-700">
                CS25에서 요청하신 인증을 위해 아래의 코드를 입력해주세요.
              </p>

              {/* Verification Code */}
              <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 text-center">
                <div className="mb-2 text-4xl font-bold tracking-wider text-blue-600">
                  {verificationCode}
                </div>
                <p className="text-sm font-medium text-blue-600">인증코드</p>
              </div>

              {/* Info Text */}
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <div className="text-center">
                  <div className="mb-2 flex items-center justify-center space-x-2">
                    <svg
                      className="h-5 w-5 text-yellow-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm font-medium text-yellow-800">
                      중요 안내
                    </p>
                  </div>
                  <p className="text-sm text-yellow-700">
                    해당 코드는 3분간 유효합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default VerificationEmailPage;
