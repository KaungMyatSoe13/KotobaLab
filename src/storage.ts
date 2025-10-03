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
