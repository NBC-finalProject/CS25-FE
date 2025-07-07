import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkle } from "lucide-react";
import QuizSection from "../sections/QuizSection";

interface EmailTemplateProps {
  toEmail: string;
  quizLink: string;
}

const EmailTemplate: React.FC<EmailTemplateProps> = ({ toEmail, quizLink }) => {
  const navigate = useNavigate();
  const [showQuiz, setShowQuiz] = useState(false);
  if (showQuiz) {
    return (
      <div className="font-pretendard py-4 sm:p-6 lg:p-10">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-xl bg-white shadow-lg sm:rounded-2xl">
          {/* Header with Logo */}
          <div className="from-brand-500 to-brand-600 bg-gradient-to-r p-6 text-center sm:p-8">
            <div className="mb-3 flex items-center justify-center space-x-2 sm:mb-4">
              <img src="/cs25.png" alt="CS25" className="h-6 w-auto sm:h-8" />
            </div>
            <h1 className="text-xl font-bold text-white sm:text-2xl">
              오늘의 CS 문제
            </h1>
            <p className="text-brand-100 mt-2 text-sm sm:text-base">
              AI가 준비한 맞춤형 문제를 확인하세요
            </p>
          </div>

          {/* Quiz Content */}
          <div className="p-6 sm:p-8">
            <QuizSection />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-pretendard py-4 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-xl bg-white shadow-lg sm:rounded-2xl">
        {/* Header with Logo */}
        <div className="from-brand-500 to-brand-600 bg-gradient-to-r p-6 text-center sm:p-8">
          <div className="mb-3 flex items-center justify-center space-x-2 sm:mb-4">
            <img src="/cs25.png" alt="CS25" className="h-6 w-auto sm:h-8" />
          </div>
          <h1 className="text-xl font-bold text-white sm:text-2xl">
            오늘의 CS 문제
          </h1>
          <p className="text-brand-100 mt-2 text-sm sm:text-base">
            AI가 준비한 맞춤형 문제를 확인하세요
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="mb-6 text-center sm:mb-8">
            <div className="bg-brand-100 mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full sm:mb-4 sm:h-20 sm:w-20">
              <svg
                className="text-brand-600 h-8 w-8 sm:h-10 sm:w-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="mb-3 text-xl font-bold text-gray-900 sm:mb-4 sm:text-2xl">
              오늘의 문제를 풀어보세요!
            </h2>
            <p className="mb-4 break-keep px-2 text-sm leading-relaxed text-gray-600 sm:mb-6 sm:px-0 sm:text-base">
              안녕하세요! CS25에서 오늘의 맞춤형{" "}
              <br className="block sm:hidden" /> CS 문제를 보내드립니다.
              <br className="hidden sm:block" />
              <span className="block sm:inline">
                데일리 문제와 상세한 AI 해설로{" "}
                <br className="block sm:hidden" />
                CS 지식을 향상시켜보세요.
              </span>
            </p>
          </div>

          {/* Action Button */}
          <div className="mb-6 text-center sm:mb-8">
            <button
              onClick={() => setShowQuiz(true)}
              className="animate-subscribe-pulse from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 focus:from-brand-600 focus:to-brand-700 active:from-brand-700 active:to-brand-800 focus:ring-brand-300 group relative inline-block w-full max-w-xs overflow-hidden rounded-full bg-gradient-to-r px-6 py-3 text-base font-semibold text-white transition-all duration-500 hover:scale-105 hover:animate-none hover:shadow-2xl focus:outline-none focus:ring-4 active:scale-95 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
            >
              {/* 반짝이는 애니메이션 효과 */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-1000 group-hover:animate-pulse group-hover:opacity-100"></div>

              {/* 물결 효과 */}
              <div className="absolute inset-0 -z-10 rounded-full bg-white/10 opacity-0 transition-all duration-700 group-hover:scale-150 group-hover:opacity-100"></div>

              <span className="relative flex items-center justify-center gap-2">
                <Sparkle className="group-hover:animate-sparkle absolute bottom-2 left-2 z-20 h-2 w-2 rotate-12 fill-white opacity-0 transition-all duration-300 group-hover:opacity-100" />
                <Sparkle className="group-hover:animate-sparkle absolute left-1 top-2 h-1.5 w-1.5 -rotate-12 fill-white opacity-0 transition-all duration-300 group-hover:opacity-100" />
                <Sparkle className="group-hover:animate-sparkle absolute right-2 top-2 h-1.5 w-1.5 fill-white opacity-0 transition-all duration-300 group-hover:opacity-100" />
                <span className="group-hover:animate-text-shimmer bg-gradient-to-r from-white via-white/90 to-white bg-[length:200%_auto] bg-clip-text transition-all duration-300 group-hover:tracking-wide">
                  연습문제 풀기
                </span>
              </span>
            </button>
          </div>

          {/* Today's Topic Preview */}
          <div className="mb-6 rounded-lg bg-gray-50 p-4 sm:mb-8 sm:rounded-xl sm:p-6">
            <h3 className="mb-2 text-base font-bold text-gray-900 sm:text-lg">
              오늘의 주제
            </h3>
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              <span className="bg-brand-100 text-brand-700 rounded-full px-3 py-1 text-xs font-medium sm:text-sm">
                알고리즘
              </span>
              <span className="bg-navy-100 text-navy-700 rounded-full px-3 py-1 text-xs font-medium sm:text-sm">
                시간복잡도
              </span>
            </div>
          </div>

          {/* Subscription Settings */}
          {/* <div className="mb-6 text-center sm:mb-8">
            <button
              disabled
              className="inline-flex items-center space-x-2 rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200 hover:shadow-sm sm:px-4 sm:text-sm"
            >
              <span className="text-sm sm:text-base">⚙️</span>
              <span>구독 설정</span>
            </button>
          </div> */}

          {/* Footer */}
          <div className="border-t border-gray-200 pt-4 sm:pt-6">
            <div className="space-y-2 text-center text-xs text-gray-500 sm:text-sm">
              <p className="px-2 sm:px-0">
                이 메일은{" "}
                <span className="font-medium text-gray-700">{toEmail}</span>{" "}
                계정으로 발송되었습니다.
              </p>
              <p>매일 새로운 CS 지식으로 성장하는 개발자가 되어보세요! 🚀</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplate;
