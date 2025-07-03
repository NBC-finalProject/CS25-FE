import React, { useState, useEffect } from "react";
import { QuizData, AnswerResult } from "./types";

interface QuizResultSectionProps {
  quiz: QuizData;
  answerResult: AnswerResult;
  isAiFeedbackLoading: boolean;
  feedbackResult: string;
  resultChars: string[];
  feedbackContent: string;
  feedbackChars: string[];
  streamingFeedback: string;
  isStreamingComplete: boolean;
  isCorrectFromAI: boolean | null;
}

const QuizResultSection: React.FC<QuizResultSectionProps> = ({
  quiz,
  answerResult,
  isAiFeedbackLoading,
  feedbackResult,
  resultChars,
  feedbackContent,
  feedbackChars,
  streamingFeedback,
  isStreamingComplete,
  isCorrectFromAI,
}) => {
  // 로딩 메시지 순환을 위한 상태
  const loadingMessages = [
    "AI가 깊은 명상에 들어갔어요!",
    "국어사전을 뒤지고 있어요!",
    "커피 한잔 마시고 올게요?!",
    "AI야, 너는 계획이 다 있구나?",
    "우주의 기운을 모으는 중입니다..",
    "답변이 야무지셔서 조금 걸려요!",
    "답변이 좋은데요-?",
    "넷플릭스 보면서 답변 생성 중이에요!",
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // feedbackResult가 있을 때 메시지 순환
  useEffect(() => {
    if (feedbackResult && resultChars.length === 0) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => {
          let newIndex;
          do {
            newIndex = Math.floor(Math.random() * loadingMessages.length);
          } while (newIndex === prev && loadingMessages.length > 1); // 연속으로 같은 메시지 방지
          return newIndex;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [feedbackResult, resultChars.length, loadingMessages.length]);
  return (
    <div className="mx-auto mb-8 max-w-4xl">
      {/* 정답/오답 메시지 - 객관식에만 표시 */}
      {quiz?.quizType === "MULTIPLE_CHOICE" && (
        <div
          className={`mb-6 inline-flex items-center rounded-full px-6 py-3 ${
            answerResult.isCorrect ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <span
            className={`text-lg font-bold ${
              answerResult.isCorrect ? "text-green-700" : "text-red-700"
            }`}
          >
            {answerResult.isCorrect ? "🎉 정답입니다!" : "❌ 틀렸습니다!"}
          </span>
        </div>
      )}

      <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-xl font-bold text-gray-900">결과</h3>
        <p className="mb-4 leading-relaxed text-gray-700">
          답안이 성공적으로 제출되었습니다.
        </p>

        {/* 정답 섹션 - 객관식에만 표시 */}
        {quiz?.quizType === "MULTIPLE_CHOICE" && (
          <div className="bg-brand-50 mb-6 rounded-xl p-4">
            <p className="text-brand-800 font-medium">
              정답:{" "}
              <span className="font-bold">
                {answerResult.answer.match(/^(\d+번)/)?.[1]}
              </span>
              {answerResult.answer.replace(/^\d+번/, "")}
            </p>
          </div>
        )}

        {/* 모범답안 표시 (주관식, 서술형) */}
        {(quiz?.quizType === "SHORT_ANSWER" ||
          quiz?.quizType === "SUBJECTIVE") && (
          <div className="mb-6 rounded-xl bg-green-50 p-4">
            <h4 className="mb-2 text-lg font-bold text-gray-900">모범답안</h4>
            <p className="font-medium leading-relaxed text-green-800">
              {answerResult.answer}
            </p>
          </div>
        )}

        {/* AI 피드백 표시 (서술형만) */}
        {quiz?.quizType === "SUBJECTIVE" && (
          <div className="mb-6 rounded-xl bg-blue-50 p-4">
            <h4 className="mb-2 text-lg font-bold text-gray-900">AI 피드백</h4>
            {(isAiFeedbackLoading && !feedbackResult) ||
            (feedbackResult && resultChars.length === 0) ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="text-blue-700">
                  {!feedbackResult
                    ? "AI가 피드백을 생성하고 있습니다..."
                    : loadingMessages[currentMessageIndex]}
                </p>
              </div>
            ) : (
              <div>
                {/* 결과 설명 */}
                {resultChars.length > 0 && (
                  <div
                    className={`animate-reveal-up mb-3 rounded-lg p-3 ${
                      isCorrectFromAI ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    <p
                      className={`whitespace-pre-wrap break-words text-sm leading-relaxed ${
                        isCorrectFromAI ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      <span className="animate-text-reveal-down font-semibold">
                        {isCorrectFromAI ? "정답: " : "오답: "}
                      </span>
                      {resultChars.map((char, index) => {
                        if (char === "\n") {
                          return <br key={`result-br-${index}`} />;
                        }
                        return (
                          <span
                            key={`result-${index}`}
                            className="inline-block opacity-0"
                            style={{
                              animation: `wave-reveal 0.6s cubic-bezier(0.18,0.89,0.82,1.04) forwards`,
                              animationDelay: `${index * 50}ms`,
                              wordSpacing: "0.25em",
                              letterSpacing: "0.02em",
                            }}
                          >
                            {char}
                          </span>
                        );
                      })}
                    </p>
                  </div>
                )}

                {/* 피드백 내용 - 결과 부분이 완료된 후에만 표시 */}
                {feedbackChars.length > 0 && (
                  <div className="animate-reveal-up rounded-lg bg-blue-50 p-3">
                    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-blue-800">
                      <span className="animate-text-reveal-down font-semibold">
                        피드백
                      </span>
                      {feedbackChars.map((char, index) => {
                        if (char === "\n") {
                          return <br key={`feedback-br-${index}`} />;
                        }
                        return (
                          <span
                            key={`feedback-${index}`}
                            className="inline-block opacity-0"
                            style={{
                              animation: `wave-reveal 0.6s cubic-bezier(0.18,0.89,0.82,1.04) forwards`,
                              animationDelay: `${index * 50}ms`,
                              wordSpacing: "0.25em",
                              letterSpacing: "0.02em",
                            }}
                          >
                            {char}
                          </span>
                        );
                      })}
                    </p>
                  </div>
                )}

                {/* 스트리밍 중인 전체 텍스트 (파싱되지 않은 경우) */}
                {streamingFeedback &&
                  !feedbackResult &&
                  !feedbackContent &&
                  streamingFeedback !== "AI 응답 대기 중..." && (
                    <div className="rounded-lg bg-blue-50 p-3">
                      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-blue-800">
                        <span
                          style={{
                            wordSpacing: "0.25em",
                            letterSpacing: "0.02em",
                          }}
                        >
                          {streamingFeedback}
                        </span>
                        {!isStreamingComplete && (
                          <span className="ml-1 animate-pulse text-blue-600">
                            ▊
                          </span>
                        )}
                      </p>
                    </div>
                  )}
              </div>
            )}
          </div>
        )}

        <div className="mb-6 rounded-xl bg-gray-50 p-4">
          <h4 className="mb-2 text-lg font-bold text-gray-900">해설</h4>
          <p className="leading-relaxed text-gray-700">
            {answerResult.commentary}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizResultSection;
