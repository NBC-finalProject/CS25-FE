export interface FormData {
  categories: string[];
  weekdays: string[];
  email: string;
  period: string;
}

export interface FormErrors {
  category?: string;
  weekdays?: string;
  period?: string;
  verification?: string;
  subscription?: string;
}

export type Step = "form" | "verification" | "success";

export interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}
