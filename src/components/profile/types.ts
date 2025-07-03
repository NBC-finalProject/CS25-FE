export interface WrongQuizDto {
  question: string;
  userAnswer: string;
  answer: string;
  commentary: string;
}

export type TabType = 'overview' | 'wrong-quiz' | 'correct-rate';