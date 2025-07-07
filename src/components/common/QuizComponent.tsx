import React, { useState } from "react";

interface QuizOption {
  id: number;
  text: string;
}

interface QuizComponentProps {
  question: string;
  options: QuizOption[];
  onSubmit: (selectedAnswer: number) => void;
  openModal: (params: { title?: string; content: React.ReactNode; size?: "sm" | "md" | "lg" | "xl" }) => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({
  question,
  options,
  onSubmit,
  openModal,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleOptionClick = (optionId: number) => {
    setSelectedAnswer(optionId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAnswer === null) {
      openModal({
        title: "선택 필요",
        content: (
          <div className="py-4 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
              <svg
                className="h-8 w-8 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="text-lg text-gray-700">선택지를 먼저 클릭해주세요!</p>
          </div>
        ),
        size: "sm",
      });
      return;
    }
    onSubmit(selectedAnswer);
  };

  return (
    <div className="font-pretendard py-4 text-center sm:py-8">
      {/* Question Box */}
      <div className="bg-brand-50 border-brand-200 mb-6 mx-auto max-w-2xl rounded-xl border p-4 text-base font-medium text-gray-800 sm:mb-8 sm:p-6 sm:text-lg">
        <strong>Q. {question}</strong>
      </div>

      {/* Quiz Form */}
      <form onSubmit={handleSubmit}>
        {/* Options Grid */}
        <div className="mx-auto mb-6 grid max-w-2xl grid-cols-1 gap-3 sm:mb-8 sm:gap-4 md:grid-cols-2">
          {options.map((option) => (
            <div
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              className={`cursor-pointer rounded-xl border-2 p-3 text-sm transition-all duration-200 hover:shadow-md sm:p-4 sm:text-base ${
                selectedAnswer === option.id
                  ? "border-brand-500 bg-brand-100 text-brand-800"
                  : "hover:border-brand-300 border-gray-300 bg-white text-gray-700"
              }`}
            >
              <span className="font-medium">{option.text}</span>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 rounded-full bg-gradient-to-r px-6 py-2.5 text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg sm:px-8 sm:py-3 sm:text-lg"
        >
          제출하기
        </button>
      </form>
    </div>
  );
};

export default QuizComponent;
