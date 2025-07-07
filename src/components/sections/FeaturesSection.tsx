import React from "react";
import Container from "../common/Container";
import Section from "../common/Section";

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: (
        <div className="bg-brand-100 flex h-12 w-12 items-center justify-center rounded-xl">
          <svg
            className="text-brand-600 h-6 w-6"
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
      ),
      title: "AI 문제 생성",
      description: (
        <>
          개인 수준에 맞는 CS 문제를{" "}
          <br className="hidden sm:block" />
          AI가 실시간 생성
        </>
      ),
      details: "학습 패턴을 분석해 최적화된 문제 제공",
    },
    {
      icon: (
        <div className="bg-brand-100 flex h-12 w-12 items-center justify-center rounded-xl">
          <svg
            className="text-brand-600 h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
      ),
      title: "AI 해설",
      description: (
        <>
          문제와 함께 AI가 생성한{" "}
          <br className="hidden sm:block" />
          상세한 해설 제공
        </>
      ),
      details: "코드 예시와 개념 설명으로 완벽 이해",
    },
    {
      icon: (
        <div className="bg-brand-100 flex h-12 w-12 items-center justify-center rounded-xl">
          <svg
            className="text-brand-600 h-6 w-6"
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
      ),
      title: "데일리 메일",
      description: (
        <>
          매일 아침 새로운 CS 지식을{" "}
          <br className="hidden sm:block" />
          메일로 전송
        </>
      ),
      details: "알고리즘, 자료구조, 운영체제, 네트워크 등",
    },
  ];

  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto mb-12 max-w-3xl px-4 text-center sm:mb-16 sm:px-0">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl">
            AI 기반 CS 학습의{" "}
            <span className="from-brand-600 animate-pulse bg-gradient-to-r via-purple-600 to-blue-600 bg-clip-text text-transparent">
              혁신
            </span>
          </h2>
          <p className="text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl">
            AI가 생성하고 해설하는 <br className="blcok sm:hidden" />
            <span className="text-brand-600 inline-block cursor-default font-semibold transition-transform hover:scale-105">
              개인화된
            </span>{" "}
            CS 지식 학습 경험{" "}
            <span className="inline-block animate-bounce delay-100">✨</span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 px-4 sm:gap-8 sm:px-0 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group break-keep rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-2xl sm:p-8"
              style={{
                animationDelay: `${index * 200}ms`,
              }}
            >
              <div className="mb-4 transition-transform duration-300 group-hover:scale-110 sm:mb-6">
                {feature.icon}
              </div>

              <h3 className="group-hover:text-brand-600 mb-3 text-lg font-bold text-gray-900 transition-colors sm:mb-4 sm:text-xl">
                <span className="hover:animate-pulse">{feature.title}</span>
              </h3>

              <p className="mb-2 break-keep text-sm leading-relaxed text-gray-600 transition-colors group-hover:text-gray-700 sm:mb-3 sm:text-base">
                {feature.description}
              </p>

              <p className="text-xs text-gray-500 transition-colors group-hover:text-gray-600 sm:text-sm">
                <span className="inline-block group-hover:animate-bounce">
                  💡
                </span>{" "}
                {feature.details}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default FeaturesSection;
