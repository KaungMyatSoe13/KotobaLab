import React, { useState, useEffect } from "react";
import type { VocabItem } from "../utils/types";
import { shuffleArray, speakWord } from "../utils/utils";
import { storage } from "../utils/storage";
import { downloadTemplate, parseExcelFile } from "../services/fileHandler";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { FileUpload } from "../components/FileUpload";
import { QuizControls } from "../components/QuizControls";
import { Instructions } from "../components/Instructions";
import { QuizCard } from "../components/QuizCard";

const clearAll = () => {
  sessionStorage.clear();
};

const JapaneseVocabQuiz: React.FC = () => {
  const [vocabList, setVocabList] = useState<VocabItem[]>(
    storage.getVocabList()
  );
  const [currentIndex, setCurrentIndex] = useState<number>(
    storage.getCurrentIndex()
  );
  const [isStarted, setIsStarted] = useState<boolean>(storage.getIsStarted());
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>(storage.getFileName());
  const [shuffledIndices, setShuffledIndices] = useState<number[]>(
    storage.getShuffledIndices()
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Persist state to storage
  useEffect(() => {
    storage.setVocabList(vocabList);
  }, [vocabList]);

  useEffect(() => {
    storage.setCurrentIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    storage.setIsStarted(isStarted);
  }, [isStarted]);

  useEffect(() => {
    storage.setFileName(fileName);
  }, [fileName]);

  useEffect(() => {
    storage.setShuffledIndices(shuffledIndices);
  }, [shuffledIndices]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);

    parseExcelFile(
      file,
      (vocab) => {
        setVocabList(vocab);
        setIsStarted(false);
        setCurrentIndex(0);
        setIsRevealed(false);
        setIsLoading(false);
        console.log("Parsed vocabulary:", vocab);
      },
      () => {
        alert("Error reading file. Please make sure it's a valid Excel file.");
        setIsLoading(false);
      }
    );
  };

  const handleStart = (): void => {
    if (vocabList.length === 0) {
      alert("Please upload a file first!");
      return;
    }
    const indices = shuffleArray([...Array(vocabList.length).keys()]);
    setShuffledIndices(indices);
    setCurrentIndex(0);
    setIsStarted(true);
    setIsRevealed(false);
    setIsFinished(false);
    speakWord(vocabList[indices[0]].pronunciation);
  };

  const handleReplay = (): void => {
    if (isStarted && shuffledIndices.length > 0) {
      const currentWord = vocabList[shuffledIndices[currentIndex]];
      speakWord(currentWord.pronunciation);
    }
  };

  const handleNext = (): void => {
    setIsRevealed(false);
    if (currentIndex < shuffledIndices.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      speakWord(vocabList[shuffledIndices[nextIdx]].pronunciation);
    } else {
      setIsFinished(true);
    }
  };

  const handleReveal = (): void => {
    setIsRevealed(true);
  };

  const handleGoHome = (): void => {
    setIsStarted(false);
    setIsFinished(false);
    setCurrentIndex(0);
    setIsRevealed(false);
    clearAll();
  };

  useKeyboardShortcuts({
    isStarted,
    isRevealed,
    isFinished,
    onNext: handleNext,
    onReveal: handleReveal,
    onReplay: handleReplay,
    onHide: () => setIsRevealed(false),
  });

  const currentWord: VocabItem | null =
    isStarted && shuffledIndices.length > 0
      ? vocabList[shuffledIndices[currentIndex]]
      : null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900 p-1 sm:p-6 md:p-8 overflow-auto">
      <div className="w-full min-h-screen flex flex-col items-center py-4">
        <div className="bg-white/5 w-full sm:w-[90%] lg:w-[80%] backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-6 sm:p-8 md:p-10 lg:p-12 flex-1 flex flex-col">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-gray-400 to-pink-400 mb-2">
              Japanese Vocabulary Quiz
            </h1>
            <p className="text-gray-300/60 text-sm sm:text-base">
              Master your Japanese vocabulary with audio practice
            </p>
          </div>

          {!isStarted && (
            <FileUpload
              fileName={fileName}
              isLoading={isLoading}
              onFileChange={handleFileUpload}
              onDownloadTemplate={downloadTemplate}
            />
          )}

          <QuizControls
            isStarted={isStarted}
            isFinished={isFinished}
            vocabLength={vocabList.length}
            isLoading={isLoading}
            onStart={handleStart}
            onGoHome={handleGoHome}
            hasFile={fileName !== ""}
          />

          {!isStarted && <Instructions />}

          {isStarted && currentWord && (
            <QuizCard
              currentWord={currentWord}
              currentIndex={currentIndex}
              totalWords={vocabList.length}
              isRevealed={isRevealed}
              isFinished={isFinished}
              onReplay={handleReplay}
              onReveal={handleReveal}
              onNext={handleNext}
              onHideAnswer={() => setIsRevealed(false)}
            />
          )}

          {vocabList.length > 0 && !isStarted && (
            <div className="text-center text-purple-200/80 bg-white/5 rounded-xl p-6 border border-white/10 mt-5">
              <p className="text-base sm:text-lg font-semibold mb-2">
                Loaded {vocabList.length} vocabulary words
              </p>
              <p className="text-sm sm:text-base text-purple-300/60">
                Press Start Quiz to begin your practice!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JapaneseVocabQuiz;
