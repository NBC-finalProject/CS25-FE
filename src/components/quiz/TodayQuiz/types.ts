export interface QuizCategoryData {
  main: string; // 대분류
  sub?: string; // 소분류
}

export interface QuizData {
  question: string;
  choice1?: string; // 객관식만
  choice2?: string; // 객관식만
  choice3?: string; // 객관식만
  choice4?: string; // 객관식만
  answerNumber?: string; // 객관식만 - 정답 번호
  answer?: string; // 주관식만 - 모범답안
  commentary: string;
  category?: QuizCategoryData; // 문제 카테고리
  quizType: string;
  quizLevel: string; // 난이도: "HARD", "NORMAL", "EASY"
}

export interface AnswerResult {
  isCorrect: boolean;
  answer: string;
  commentary: string;
  aiFeedback?: string; // 주관식 AI 피드백
}

export interface SelectionRatesData {
  selectionRates: {
    [key: string]: number;
  };
  totalCount: number;
}
