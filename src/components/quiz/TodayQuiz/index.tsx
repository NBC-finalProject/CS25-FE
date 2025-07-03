import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Container from "../../common/Container";
import Section from "../../common/Section";
import { useModal } from "../../../hooks/useModal";
import QuizDisplay from "./QuizDisplay";
import QuizAnswerForm from "./QuizAnswerForm";
import QuizResultSection from "./QuizResultSection";
import QuizStatistics from "./QuizStatistics";
import { useQuizData } from "./hooks/useQuizData";
import { useQuizSubmission } from "./hooks/useQuizSubmission";
import { useQuizAnimations } from "./hooks/useQuizAnimations";
import { quizAPI } from "../../../utils/api";

const TodayQuizSection: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [subjectiveAnswer, setSubjectiveAnswer] = useState<string>("");
  const { openModal } = useModal();

  const subscriptionId = searchParams.get("subscriptionId");
  const quizId = searchParams.get("quizId");

  // 퀴즈 데이터 관리
  const {
    displayQuiz,
    isLoading,
    selectionRates,
    setSelectionRates,
    animatedPercentages,
    setAnimatedPercentages,
  } = useQuizData(subscriptionId, quizId);

  // 퀴즈 제출 관리
  const {
    isSubmitted,
    answerResult,
    isDuplicateAnswer,
    isAiFeedbackLoading,
    streamingFeedback,
    feedbackResult,
    feedbackContent,
    isStreamingComplete,
    isCorrectFromAI,
    resultChars,
    feedbackChars,
    setResultChars,
    setFeedbackChars,
    submitAnswer,
    cleanup,
  } = useQuizSubmission();

  // 애니메이션 관리
  useQuizAnimations(
    isSubmitted,
    selectionRates,
    selectedAnswer,
    isDuplicateAnswer,
    feedbackResult,
    feedbackContent,
    resultChars,
    setAnimatedPercentages,
    setResultChars,
    setFeedbackChars,
  );

  // SSE 연결 정리 - 컴포넌트 언마운트 시
  useEffect(() => {
    const handleBeforeUnload = () => {
      cleanup();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      cleanup();
    };
  }, [cleanup]); // cleanup을 다시 dependency로 추가 (이제 useCallback으로 메모이제이션됨)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 객관식인 경우 선택지 확인
    if (
      displayQuiz?.quizType === "MULTIPLE_CHOICE" &&
      selectedAnswer === null
    ) {
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

    // 서술형인 경우 답안 확인
    if (
      (displayQuiz?.quizType === "SHORT_ANSWER" ||
        displayQuiz?.quizType === "SUBJECTIVE") &&
      subjectiveAnswer.trim() === ""
    ) {
      openModal({
        title: "답안 입력 필요",
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
            <p className="text-lg text-gray-700">답안을 입력해주세요!</p>
          </div>
        ),
        size: "sm",
      });
      return;
    }

    if (quizId && subscriptionId && displayQuiz) {
      try {
        const result = await submitAnswer(
          quizId,
          subscriptionId,
          displayQuiz,
          selectedAnswer,
          subjectiveAnswer,
          openModal,
        );

        // 중복 답변인 경우 이전 선택한 답안 복원 (객관식만)
        if (result.isDuplicate && displayQuiz.quizType === "MULTIPLE_CHOICE") {
          const userAnswer = (result.responseData as any)?.userAnswer;
          if (userAnswer) {
            // userAnswer에서 선택 번호 추출 (예: "1. text" -> 1)
            const answerMatch = userAnswer.match(/^(\d+)/);
            if (answerMatch) {
              setSelectedAnswer(parseInt(answerMatch[1]));
            }
          }

          // 선택 비율 가져오기
          if (quizId) {
            try {
              const ratesResponse = await quizAPI.getQuizSelectionRates(quizId);
              if (ratesResponse && typeof ratesResponse === "object") {
                const ratesData =
                  "data" in ratesResponse ? ratesResponse.data : ratesResponse;
                setSelectionRates(ratesData as any);
              }
            } catch (error) {
              console.error(
                "중복 답변 - 선택 비율 데이터 가져오기 실패:",
                error,
              );
            }
          }
        }
      } catch (error: any) {
        // 400 에러 체크 및 메시지 처리
        if (error?.status) {
          const errorMessage =
            error?.response?.data?.message ||
            "잘못된 요청입니다. 답안 제출에 실패했습니다.";

          openModal({
            title: "알림",
            content: (
              <div className="py-4 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <svg
                    className="h-8 w-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-lg text-gray-700">{errorMessage}</p>
              </div>
            ),
            size: "sm",
          });
          return;
        }

        console.error("답안 제출 실패:", error);
      }
    }
  };

  const handleOptionClick = (value: number) => {
    if (!isSubmitted && displayQuiz?.quizType === "MULTIPLE_CHOICE") {
      setSelectedAnswer(value);
    }
  };

  if (isLoading) {
    return (
      <Section className="bg-gray-50 py-20">
        <Container>
          <div className="text-center">
            <div className="border-brand-500 mx-auto h-12 w-12 animate-spin rounded-full border-b-2"></div>
            <p className="mt-4 text-gray-600">퀴즈를 불러오는 중...</p>
          </div>
        </Container>
      </Section>
    );
  }

  const totalCount = selectionRates
    ? isSubmitted && !isDuplicateAnswer
      ? selectionRates.totalCount + 1
      : selectionRates.totalCount
    : undefined;

  return (
    <Section className="bg-gray-50 py-20">
      <Container>
        <QuizDisplay
          quiz={displayQuiz}
          totalCount={totalCount}
          isDuplicateAnswer={isDuplicateAnswer}
        />

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-8">
          <div className="font-pretendard py-4 text-center sm:py-8">
            <QuizAnswerForm
              quiz={displayQuiz}
              selectedAnswer={selectedAnswer}
              subjectiveAnswer={subjectiveAnswer}
              isSubmitted={isSubmitted}
              onOptionClick={handleOptionClick}
              onSubjectiveChange={setSubjectiveAnswer}
              onSubmit={handleSubmit}
            />

            {/* Result Section - 제출 후에만 표시 */}
            {isSubmitted && answerResult && (
              <>
                <QuizResultSection
                  quiz={displayQuiz}
                  answerResult={answerResult}
                  isAiFeedbackLoading={isAiFeedbackLoading}
                  feedbackResult={feedbackResult}
                  resultChars={resultChars}
                  feedbackContent={feedbackContent}
                  feedbackChars={feedbackChars}
                  streamingFeedback={streamingFeedback}
                  isStreamingComplete={isStreamingComplete}
                  isCorrectFromAI={isCorrectFromAI}
                />

                {/* 선택 비율 섹션 - 객관식에만 표시 */}
                {selectionRates && (
                  <QuizStatistics
                    quiz={displayQuiz}
                    answerResult={answerResult}
                    selectionRates={selectionRates}
                    selectedAnswer={selectedAnswer}
                    animatedPercentages={animatedPercentages}
                    isDuplicateAnswer={isDuplicateAnswer}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default TodayQuizSection;
