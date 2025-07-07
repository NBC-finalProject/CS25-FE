import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg text-center">
        {/* 404 숫자 with gradient - 모바일 대응 */}
        <div className="relative mb-6 sm:mb-8">
          <h1 className="animate-pulse bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-6xl font-bold text-transparent sm:text-7xl md:text-8xl lg:text-9xl">
            404
          </h1>
          <div className="absolute inset-0 -z-10 text-6xl font-bold text-gray-200 sm:text-7xl md:text-8xl lg:text-9xl">
            404
          </div>
        </div>

        {/* 이모지와 메시지 - 모바일 대응 */}
        <div className="mb-6 break-keep sm:mb-8">
          <h2 className="mb-3 text-xl font-bold text-gray-800 sm:mb-4 sm:text-2xl md:text-3xl">
            페이지를 찾을 수 없어요!
          </h2>
          <p className="px-2 text-sm leading-relaxed text-gray-600 sm:px-0 sm:text-base">
            요청하신 페이지가 존재하지 않습니다.
          </p>
        </div>

        {/* 버튼들 - 모바일 대응 */}
        <div className="space-y-3 sm:space-y-4">
          <Link
            to="/"
            className="inline-block transform rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg sm:px-8 sm:py-4 sm:text-base"
          >
            <span>홈으로 돌아가기</span>
          </Link>
          <div>
            <button
              onClick={() => window.history.back()}
              className="text-sm font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800 hover:underline sm:text-base"
            >
              이전 페이지로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
