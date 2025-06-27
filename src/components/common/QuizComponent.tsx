import React, { useState } from 'react';

interface QuizOption {
  id: number;
  text: string;
}

interface QuizComponentProps {
  question: string;
  options: QuizOption[];
  onSubmit: (selectedAnswer: number) => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ question, options, onSubmit }) => {
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
    <div className="font-pretendard text-center py-8">
      {/* Question Box */}
      <div className="bg-brand-50 border border-brand-200 rounded-xl p-6 text-lg font-medium text-gray-800 mb-8 inline-block max-w-2xl">
        <strong>Q. {question}</strong>
      </div>

      {/* Quiz Form */}
      <form onSubmit={handleSubmit}>
        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
          {options.map((option) => (
            <div
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              className={`border-2 p-4 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedAnswer === option.id
                  ? 'border-brand-500 bg-brand-100 text-brand-800'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-brand-300'
              }`}
            >
              <span className="font-medium">{option.text}</span>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-gradient-to-r from-brand-500 to-brand-600 text-white px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 hover:from-brand-600 hover:to-brand-700 hover:scale-105 hover:shadow-lg"
        >
          제출하기
        </button>
      </form>
    </div>
  );
};

export default QuizComponent;