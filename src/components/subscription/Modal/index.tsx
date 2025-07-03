import React, { useState } from "react";
import Modal from "../../common/Modal";
import { useQuizCategories } from "../../../hooks/useQuiz";
import {
  useRequestEmailVerification,
  useVerifyCode,
  useCreateSubscription,
  useCheckEmail,
} from "../../../hooks";
import FormStep from "./steps/FormStep";
import VerificationStep from "./steps/VerificationStep";
import SuccessStep from "./steps/SuccessStep";
import { FormData, FormErrors, Step, SubscriptionModalProps } from "./types";

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<Step>("form");
  const [verificationCode, setVerificationCode] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    categories: [],
    weekdays: [],
    email: "",
    period: "",
  });

  const { data: categoriesData, isLoading: categoriesLoading } =
    useQuizCategories(isOpen);

  // React Query 훅들
  const checkEmailMutation = useCheckEmail();
  const emailVerificationMutation = useRequestEmailVerification();
  const verifyCodeMutation = useVerifyCode();
  const createSubscriptionMutation = useCreateSubscription();

  const handleFormDataChange = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    // 해당 필드의 에러 제거
    if (data.categories)
      setFormErrors((prev) => ({ ...prev, category: undefined }));
    if (data.weekdays)
      setFormErrors((prev) => ({ ...prev, weekdays: undefined }));
    if (data.period) setFormErrors((prev) => ({ ...prev, period: undefined }));
  };

  const handleEmailChange = (email: string) => {
    setFormData((prev) => ({ ...prev, email }));
    setEmailError("");
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (formData.categories.length === 0) {
      errors.category = "분야를 선택해주세요.";
    }

    if (formData.weekdays.length === 0) {
      errors.weekdays = "요일을 선택해주세요.";
    }

    if (!formData.period) {
      errors.period = "구독 기간을 선택해주세요.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleVerifyEmail = async () => {
    if (!validateForm()) {
      return;
    }

    setEmailError("");

    try {
      // 이메일 중복 확인
      await checkEmailMutation.mutateAsync(formData.email);

      // 인증 이메일 발송
      await emailVerificationMutation.mutateAsync(formData.email);
      setStep("verification");
    } catch (error: any) {
      if (error?.response?.data?.message) {
        setEmailError(error.response.data.message);
      } else {
        setEmailError("이메일 발송에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setFormErrors({ verification: "인증 코드를 입력해주세요." });
      return;
    }

    try {
      await verifyCodeMutation.mutateAsync({
        email: formData.email,
        code: verificationCode,
      });

      // 구독 생성
      const periodMap: { [key: string]: number } = {
        ONE_MONTH: 1,
        THREE_MONTHS: 3,
        SIX_MONTHS: 6,
        ONE_YEAR: 12,
      };

      await createSubscriptionMutation.mutateAsync({
        email: formData.email,
        category: formData.categories[0], // 첫 번째 카테고리만 사용
        days: formData.weekdays,
        period: periodMap[formData.period] || 1,
      });

      setStep("success");
    } catch (error: any) {
      if (error?.response?.data?.message) {
        setFormErrors({ verification: error.response.data.message });
      } else {
        setFormErrors({
          verification: "인증에 실패했습니다. 코드를 확인해주세요.",
        });
      }
    }
  };

  const handleModalClose = () => {
    setStep("form");
    setVerificationCode("");
    setEmailError("");
    setFormErrors({});
    setFormData({
      categories: [],
      weekdays: [],
      email: "",
      period: "",
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} title="">
      {step === "form" && (
        <FormStep
          formData={formData}
          formErrors={formErrors}
          emailError={emailError}
          categoriesData={categoriesData}
          categoriesLoading={categoriesLoading}
          onFormDataChange={handleFormDataChange}
          onVerifyEmail={handleVerifyEmail}
          onEmailChange={handleEmailChange}
          checkEmailMutation={checkEmailMutation}
          emailVerificationMutation={emailVerificationMutation}
        />
      )}

      {step === "verification" && (
        <VerificationStep
          formData={formData}
          formErrors={formErrors}
          verificationCode={verificationCode}
          onVerificationCodeChange={setVerificationCode}
          onVerifyCode={handleVerifyCode}
          onResendEmail={handleVerifyEmail}
          verifyCodeMutation={verifyCodeMutation}
          createSubscriptionMutation={createSubscriptionMutation}
          checkEmailMutation={checkEmailMutation}
          emailVerificationMutation={emailVerificationMutation}
        />
      )}

      {step === "success" && (
        <SuccessStep formData={formData} onClose={handleModalClose} />
      )}
    </Modal>
  );
};

export default SubscriptionModal;
