import React from "react";
import Container from "./Container";

const Footer: React.FC = () => {
  return (
    <footer className="font-pretendard bg-gray-800 py-6 sm:py-8 lg:py-10 text-white">
      <Container>
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          {/* 연락처 정보 */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6 lg:gap-8">
            {/* GitHub 링크 */}
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <a
                href="https://github.com/NBC-finalProject"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-medium text-gray-300 transition-colors duration-300 hover:text-white"
              >
                CS25 Github
              </a>
            </div>

            {/* 이메일 */}
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5"
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
              <a
                href="mailto:noreplycs25@gmail.com"
                className="text-xs sm:text-sm font-medium text-gray-300 transition-colors duration-300 hover:text-white break-all"
              >
                noreplycs25@gmail.com
              </a>
            </div>

            {/* 팀소개 링크 */}
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.746c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933z"/>
              </svg>
              <a
                href="http://determined-visitor-52a.notion.site/CS25-223e2a3e053580888faef79fdf6bfbcf?pvs=74"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-medium text-gray-300 transition-colors duration-300 hover:text-white"
              >
                팀소개
              </a>
            </div>
          </div>

          {/* 법적 고지 링크 */}
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4 lg:gap-6">
            <a
              href="/privacy-policy"
              className="text-sm font-medium text-gray-300 transition-colors duration-300 hover:text-white"
            >
              개인정보처리방침
            </a>
            <a
              href="/terms-of-service"
              className="text-sm font-medium text-gray-300 transition-colors duration-300 hover:text-white"
            >
              서비스 이용약관
            </a>
          </div>

          {/* 저작권 */}
          <p className="text-xs sm:text-sm text-gray-400 text-center px-4">
            &copy; 2025 CS25. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
