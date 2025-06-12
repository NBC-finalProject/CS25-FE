import React from 'react';
import SocialButton from './SocialButton';

const LoginForm: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 leading-tight">
        CS25와 함께<br />시작하기
      </h1>
      <p className="text-base text-gray-600 mb-10 leading-relaxed">
        소셜 계정으로 간편하게 로그인하고<br />
        AI가 전하는 데일리 CS 지식을 받아보세요
      </p>
      
      <SocialButton provider="kakao" href="/oauth2/authorization/kakao">
        카카오로 시작하기
      </SocialButton>

      <SocialButton provider="github" href="/oauth2/authorization/github">
        GitHub로 시작하기
      </SocialButton>

      <SocialButton provider="naver" href="/oauth2/authorization/naver">
        네이버로 시작하기
      </SocialButton>

      <div className="mt-8 pt-5 border-t border-gray-200 text-gray-500 text-sm">
        로그인하시면 서비스 이용약관과<br />
        개인정보처리방침에 동의하게 됩니다
      </div>
    </div>
  );
};

export default LoginForm;