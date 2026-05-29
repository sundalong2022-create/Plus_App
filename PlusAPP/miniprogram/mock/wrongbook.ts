import type { WrongItem } from "../types/api";

export const initialWrongItems: WrongItem[] = [
  {
    questionId: "q_3x6",
    formula: "3×6",
    answer: 18,
    wrongCount: 2,
    continuousWrongCount: 2,
    lastWrongAt: "2026-05-25T10:20:00+08:00",
    mastered: false
  },
  {
    questionId: "q_4x7",
    formula: "4×7",
    answer: 28,
    wrongCount: 1,
    continuousWrongCount: 1,
    lastWrongAt: "2026-05-24T18:10:00+08:00",
    mastered: false
  },
  {
    questionId: "q_7x8",
    formula: "7×8",
    answer: 56,
    wrongCount: 1,
    continuousWrongCount: 1,
    lastWrongAt: "2026-05-24T18:15:00+08:00",
    mastered: false
  }
];
