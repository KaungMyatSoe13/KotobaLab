// src/utils/kanjiStorage.ts
import type { KanjiItem } from "../services/booksService";

interface QuizKanjiItem {
  kanji: string;
  japanese: string;
  chinese: string;
  example: string;
}

export const kanjiStorage = {
  // Kanji List
  getKanjiList: (): KanjiItem[] => {
    const saved = sessionStorage.getItem("kanji_kanjiList");
    return saved ? JSON.parse(saved) : [];
  },
  setKanjiList: (list: KanjiItem[]): void => {
    sessionStorage.setItem("kanji_kanjiList", JSON.stringify(list));
  },

  // Quiz Kanji List
  getQuizKanjiList: (): QuizKanjiItem[] => {
    const saved = sessionStorage.getItem("kanji_quizKanjiList");
    return saved ? JSON.parse(saved) : [];
  },
  setQuizKanjiList: (list: QuizKanjiItem[]): void => {
    sessionStorage.setItem("kanji_quizKanjiList", JSON.stringify(list));
  },

  // Current Index
  getCurrentIndex: (): number => {
    const saved = sessionStorage.getItem("kanji_currentIndex");
    return saved ? parseInt(saved) : 0;
  },
  setCurrentIndex: (index: number): void => {
    sessionStorage.setItem("kanji_currentIndex", index.toString());
  },

  // Is Quiz Started
  getIsQuizStarted: (): boolean => {
    const saved = sessionStorage.getItem("kanji_isQuizStarted");
    return saved ? JSON.parse(saved) : false;
  },
  setIsQuizStarted: (value: boolean): void => {
    sessionStorage.setItem("kanji_isQuizStarted", JSON.stringify(value));
  },

  // Is Revealed
  getIsRevealed: (): boolean => {
    const saved = sessionStorage.getItem("kanji_isRevealed");
    return saved ? JSON.parse(saved) : false;
  },
  setIsRevealed: (value: boolean): void => {
    sessionStorage.setItem("kanji_isRevealed", JSON.stringify(value));
  },

  // Shuffled Indices
  getShuffledIndices: (): number[] => {
    const saved = sessionStorage.getItem("kanji_shuffledIndices");
    return saved ? JSON.parse(saved) : [];
  },
  setShuffledIndices: (indices: number[]): void => {
    sessionStorage.setItem("kanji_shuffledIndices", JSON.stringify(indices));
  },

  // Is Finished
  getIsFinished: (): boolean => {
    const saved = sessionStorage.getItem("kanji_isFinished");
    return saved ? JSON.parse(saved) : false;
  },
  setIsFinished: (value: boolean): void => {
    sessionStorage.setItem("kanji_isFinished", JSON.stringify(value));
  },

  // Practice Mode
  getPracticeMode: (): "kanjiToMeaning" | "meaningToKanji" => {
    const saved = sessionStorage.getItem("kanji_practiceMode");
    return (saved as "kanjiToMeaning" | "meaningToKanji") || "kanjiToMeaning";
  },
  setPracticeMode: (mode: "kanjiToMeaning" | "meaningToKanji"): void => {
    sessionStorage.setItem("kanji_practiceMode", mode);
  },

  // Level
  getLevel: (): string => {
    return sessionStorage.getItem("kanji_level") || "";
  },
  setLevel: (level: string): void => {
    sessionStorage.setItem("kanji_level", level);
  },

  // Clear All
  clearAll: (): void => {
    sessionStorage.removeItem("kanji_kanjiList");
    sessionStorage.removeItem("kanji_quizKanjiList");
    sessionStorage.removeItem("kanji_currentIndex");
    sessionStorage.removeItem("kanji_isQuizStarted");
    sessionStorage.removeItem("kanji_isRevealed");
    sessionStorage.removeItem("kanji_shuffledIndices");
    sessionStorage.removeItem("kanji_isFinished");
    sessionStorage.removeItem("kanji_practiceMode");
    sessionStorage.removeItem("kanji_level");
  },
};
