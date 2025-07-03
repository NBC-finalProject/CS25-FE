import { ReactNode } from "react";
import { useModalContext, ModalConfig } from "../contexts/ModalContext";
import LoginForm from "../components/common/LoginForm";

interface UseModalReturn {
  openModal: (config: Omit<ModalConfig, "id">) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  modals: ModalConfig[];
}

export const useModal = (): UseModalReturn => {
  const { openModal, closeModal, closeAllModals, modals } = useModalContext();

  return {
    openModal,
    closeModal,
    closeAllModals,
    modals,
  };
};

// 편의를 위한 특정 모달 훅들
export const useLoginModal = () => {
  const { openModal, closeModal } = useModal();

  const openLoginModal = () => {
    return openModal({
      content: <LoginForm />,
      size: "md",
    });
  };

  return { openLoginModal, closeModal };
};

export const useSubscriptionModal = () => {
  const { openModal, closeModal } = useModal();

  const openSubscriptionModal = () => {
    return openModal({
      title: "",
      content: <div>구독 모달이 여기에 들어갑니다</div>,
      size: "lg",
    });
  };

  return { openSubscriptionModal, closeModal };
};

// 커스텀 모달을 쉽게 열 수 있는 헬퍼
export const useCustomModal = () => {
  const { openModal, closeModal } = useModal();

  const openCustomModal = (
    title: string,
    content: ReactNode,
    options?: {
      size?: "sm" | "md" | "lg" | "xl";
      closable?: boolean;
      onClose?: () => void;
    },
  ) => {
    return openModal({
      title,
      content,
      ...options,
    });
  };

  return { openCustomModal, closeModal };
};
