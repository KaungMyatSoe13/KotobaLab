// src/storage.ts
import type { VocabItem } from "./types";

export const storage = {
  getVocabList: (): VocabItem[] => {
    const saved = sessionStorage.getItem("vocabList");
    return saved ? JSON.parse(saved) : [];
  },

  setVocabList: (list: VocabItem[]): void => {
    sessionStorage.setItem("vocabList", JSON.stringify(list));
  },

  getCurrentIndex: (): number => {
    const saved = sessionStorage.getItem("currentIndex");
    return saved ? parseInt(saved) : 0;
  },

  setCurrentIndex: (index: number): void => {
    sessionStorage.setItem("currentIndex", index.toString());
  },

  getIsStarted: (): boolean => {
    const saved = sessionStorage.getItem("isStarted");
    return saved ? JSON.parse(saved) : false;
  },

  setIsStarted: (value: boolean): void => {
    sessionStorage.setItem("isStarted", JSON.stringify(value));
  },

  getFileName: (): string => {
    return sessionStorage.getItem("fileName") || "";
  },

  setFileName: (name: string): void => {
    sessionStorage.setItem("fileName", name);
  },

  getShuffledIndices: (): number[] => {
    const saved = sessionStorage.getItem("shuffledIndices");
    return saved ? JSON.parse(saved) : [];
  },

  setShuffledIndices: (indices: number[]): void => {
    sessionStorage.setItem("shuffledIndices", JSON.stringify(indices));
  },
};

export const lessonStorage = {
  getVocabList: (): VocabItem[] => {
    const saved = sessionStorage.getItem("lessonQuiz_vocabList");
    return saved ? JSON.parse(saved) : [];
  },

  setVocabList: (list: VocabItem[]): void => {
    sessionStorage.setItem("lessonQuiz_vocabList", JSON.stringify(list));
  },

  getCurrentIndex: (): number => {
    const saved = sessionStorage.getItem("lessonQuiz_currentIndex");
    return saved ? parseInt(saved) : 0;
  },

  setCurrentIndex: (index: number): void => {
    sessionStorage.setItem("lessonQuiz_currentIndex", index.toString());
  },

  getIsStarted: (): boolean => {
    const saved = sessionStorage.getItem("lessonQuiz_isStarted");
    return saved ? JSON.parse(saved) : false;
  },

  setIsStarted: (value: boolean): void => {
    sessionStorage.setItem("lessonQuiz_isStarted", JSON.stringify(value));
  },

  getShuffledIndices: (): number[] => {
    const saved = sessionStorage.getItem("lessonQuiz_shuffledIndices");
    return saved ? JSON.parse(saved) : [];
  },

  setShuffledIndices: (indices: number[]): void => {
    sessionStorage.setItem(
      "lessonQuiz_shuffledIndices",
      JSON.stringify(indices)
    );
  },

  getSelectedLessons: (): number[] => {
    const saved = sessionStorage.getItem("lessonQuiz_selectedLessons");
    return saved ? JSON.parse(saved) : [];
  },

  setSelectedLessons: (lessons: number[]): void => {
    sessionStorage.setItem(
      "lessonQuiz_selectedLessons",
      JSON.stringify(lessons)
    );
  },

  getBookName: (): string => {
    return sessionStorage.getItem("lessonQuiz_bookName") || "";
  },

  setBookName: (bookName: string): void => {
    sessionStorage.setItem("lessonQuiz_bookName", bookName);
  },

  clearAll: (): void => {
    sessionStorage.removeItem("lessonQuiz_vocabList");
    sessionStorage.removeItem("lessonQuiz_currentIndex");
    sessionStorage.removeItem("lessonQuiz_isStarted");
    sessionStorage.removeItem("lessonQuiz_shuffledIndices");
    sessionStorage.removeItem("lessonQuiz_selectedLessons");
    sessionStorage.removeItem("lessonQuiz_bookName");
  },
};
