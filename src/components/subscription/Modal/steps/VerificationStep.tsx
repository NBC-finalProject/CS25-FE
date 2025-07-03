import React from "react";
import { FormData, FormErrors } from "../types";

interface VerificationStepProps {
  formData: FormData;
  formErrors: FormErrors;
  verificationCode: string;
  onVerificationCodeChange: (code: string) => void;
  onVerifyCode: () => void;
  onResendEmail: () => void;
  verifyCodeMutation: any;
  createSubscriptionMutation: any;
  checkEmailMutation: any;
  emailVerificationMutation: any;
}

const VerificationStep: React.FC<VerificationStepProps> = ({
  formData,
  formErrors,
  verificationCode,
  onVerificationCodeChange,
  onVerifyCode,
  onResendEmail,
  verifyCodeMutation,
  createSubscriptionMutation,
  checkEmailMutation,
  emailVerificationMutation,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerifyCode();
  };

  return (
    <div className="space-y-4 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
        <svg
          className="h-8 w-8 text-blue-500"
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

      <div>
        <h3 className="mb-2 text-xl font-semibold text-gray-800">
          인증 메일을 발송했습니다
        </h3>
        <p className="mb-1 text-gray-600">{formData.email}로</p>
        <p className="text-gray-600">인증번호가 포함된 메일을 발송했습니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => onVerificationCodeChange(e.target.value)}
            placeholder="인증번호 6자리 입력"
            maxLength={6}
            className="focus:ring-brand-400 focus:border-brand-400 w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-lg tracking-widest outline-none focus:ring-2"
          />
          {formErrors.verification && (
            <p className="mt-2 flex items-center justify-center text-sm text-red-500">
              <svg
                className="mr-1 h-4 w-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {formErrors.verification}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={
            verifyCodeMutation.isPending || createSubscriptionMutation.isPending
          }
          className="from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 w-full rounded-lg bg-gradient-to-r px-4 py-2 text-white shadow-sm transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {verifyCodeMutation.isPending || createSubscriptionMutation.isPending
            ? "처리 중..."
            : "인증 완료"}
        </button>

        {/* 구독 생성 에러 메시지 */}
        {formErrors.subscription && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="flex items-center text-sm text-red-700">
              <svg
                className="mr-2 h-4 w-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {formErrors.subscription}
            </p>
          </div>
        )}
      </form>

      <button
        onClick={onResendEmail}
        disabled={
          checkEmailMutation.isPending || emailVerificationMutation.isPending
        }
        className="text-brand-400 hover:text-brand-500 text-sm underline disabled:opacity-50"
      >
        인증 메일 재발송
      </button>
    </div>
  );
};

export default VerificationStep;
