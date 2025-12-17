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
import { QuizCardHiragana } from "../components/QuizCardHiragana";
import { BookOpen, Headphones } from "lucide-react";

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
  const [practiceMode, setPracticeMode] = useState<
    "reading" | "listening" | null
  >(storage.getPracticeMode());

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

  useEffect(() => {
    storage.setPracticeMode(practiceMode);
  }, [practiceMode]);

  useEffect(() => {
    storage.setIsFinished(isFinished);
  }, [isFinished]);

  useEffect(() => {
    storage.setIsRevealed(isRevealed);
  }, [isRevealed]);

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

  const handleStartReadingMode = (): void => {
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
    // speakWord(vocabList[indices[0]].pronunciation);
  };

  const handleStartListeningMode = (): void => {
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

  const handleNextReadingMode = (): void => {
    setIsRevealed(false);
    if (currentIndex < shuffledIndices.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      // speakWord(vocabList[shuffledIndices[nextIdx]].pronunciation);
    } else {
      setIsFinished(true);
    }
  };

  const handleNextListeningMode = (): void => {
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
    setPracticeMode(null);
    vocabList.length === 0;
    currentIndex === 0;
    fileName === "";
    shuffledIndices.length === 0;
  };

  useKeyboardShortcuts({
    isStarted,
    isRevealed,
    isFinished,
    onNext:
      practiceMode === "reading"
        ? handleNextReadingMode
        : handleNextListeningMode,
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

          {fileName !== "" && (
            <div
              className={`backdrop-blur-md border-2 text-white p-4 rounded-xl shadow-lg mb-4 ${
                practiceMode
                  ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/30"
                  : "bg-white/5 border-white/20"
              }`}
            >
              {" "}
              <div className="flex items-center justify-center gap-3">
                {practiceMode === "reading" ? (
                  <>
                    <BookOpen className="w-6 h-6 text-cyan-400" />
                    <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                      Reading Practice Mode
                    </span>
                  </>
                ) : practiceMode === "listening" ? (
                  <>
                    <Headphones className="w-6 h-6 text-purple-400" />
                    <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                      Listening Practice Mode
                    </span>
                  </>
                ) : practiceMode === null ? (
                  <span className="text-lg font-bold text-gray-400">
                    Select Practice Mode Below
                  </span>
                ) : null}
              </div>
            </div>
          )}

          <QuizControls
            isStarted={isStarted}
            isFinished={isFinished}
            vocabLength={vocabList.length}
            isLoading={isLoading}
            onStart={
              practiceMode === "reading"
                ? handleStartReadingMode
                : handleStartListeningMode
            }
            onGoHome={handleGoHome}
            hasFile={fileName !== ""}
            practiceMode={practiceMode} // Use the state variable
            onSelectMode={setPracticeMode} // Pass the setter function
          />

          {!isStarted && <Instructions />}

          {isStarted && currentWord && (
            <>
              {practiceMode === "reading" ? (
                <QuizCardHiragana
                  currentWord={currentWord}
                  currentIndex={currentIndex}
                  totalWords={vocabList.length}
                  isRevealed={isRevealed}
                  isFinished={isFinished}
                  onReveal={handleReveal}
                  onNext={handleNextReadingMode}
                  onHideAnswer={() => setIsRevealed(false)}
                />
              ) : (
                <QuizCard
                  currentWord={currentWord}
                  currentIndex={currentIndex}
                  totalWords={vocabList.length}
                  isRevealed={isRevealed}
                  isFinished={isFinished}
                  onReveal={handleReveal}
                  onNext={handleNextListeningMode}
                  onReplay={handleReplay}
                  onHideAnswer={() => setIsRevealed(false)}
                />
              )}
            </>
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
