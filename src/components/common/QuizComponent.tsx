import React, { useState } from "react";

interface QuizOption {
  id: number;
  text: string;
}

interface QuizComponentProps {
  question: string;
  options: QuizOption[];
  onSubmit: (selectedAnswer: number) => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({
  question,
  options,
  onSubmit,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleOptionClick = (optionId: number) => {
    setSelectedAnswer(optionId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAnswer === null) {
      alert("선택지를 먼저 클릭해주세요!");
      return;
    }
    onSubmit(selectedAnswer);
  };

  return (
    <div className="font-pretendard py-8 text-center">
      {/* Question Box */}
      <div className="bg-brand-50 border-brand-200 mb-8 inline-block max-w-2xl rounded-xl border p-6 text-lg font-medium text-gray-800">
        <strong>Q. {question}</strong>
      </div>

      {/* Quiz Form */}
      <form onSubmit={handleSubmit}>
        {/* Options Grid */}
        <div className="mx-auto mb-8 grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-2">
          {options.map((option) => (
            <div
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md ${
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
          className="from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 rounded-full bg-gradient-to-r px-8 py-3 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          제출하기
        </button>
      </form>
    </div>
  );
};

export default QuizComponent;
