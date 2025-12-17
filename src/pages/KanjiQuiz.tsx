//import>kanji-quiz
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Languages,
  Eye,
  EyeOff,
  Home,
  RotateCcw,
  X,
} from "lucide-react";

interface KanjiItem {
  kanji: string;
  japanese: string;
  chinese: string;
  example: string;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const KanjiQuiz: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Try to restore from sessionStorage first, then fall back to navigation state
  const getInitialKanjiList = (): KanjiItem[] => {
    const stored = sessionStorage.getItem("quizKanjiList");
    if (stored) return JSON.parse(stored);
    return location.state?.kanjiList || [];
  };

  const getInitialPracticeMode = ():
    | "kanjiToMeaning"
    | "meaningToKanji"
    | null => {
    const stored = sessionStorage.getItem("quizPracticeMode");
    if (stored) return stored as "kanjiToMeaning" | "meaningToKanji";
    return location.state?.practiceMode || null;
  };

  const kanjiList: KanjiItem[] = getInitialKanjiList();
  const practiceMode: "kanjiToMeaning" | "meaningToKanji" | null =
    getInitialPracticeMode();

  const [currentIndex, setCurrentIndex] = useState(() => {
    const stored = sessionStorage.getItem("quizCurrentIndex");
    return stored ? parseInt(stored) : 0;
  });
  const [isRevealed, setIsRevealed] = useState(() => {
    const stored = sessionStorage.getItem("quizIsRevealed");
    return stored === "true";
  });
  const [shuffledIndices, setShuffledIndices] = useState<number[]>(() => {
    const stored = sessionStorage.getItem("quizShuffledIndices");
    return stored ? JSON.parse(stored) : [];
  });
  const [isFinished, setIsFinished] = useState(() => {
    const stored = sessionStorage.getItem("quizIsFinished");
    return stored === "true";
  });
  const [isStarted, setIsStarted] = useState(() => {
    const stored = sessionStorage.getItem("quizIsStarted");
    return stored === "true";
  });

  // Redirect if no kanji data or mode
  useEffect(() => {
    if (kanjiList.length === 0 || !practiceMode) {
      navigate("/kanji");
    }
  }, [kanjiList, practiceMode, navigate]);

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    if (kanjiList.length > 0) {
      sessionStorage.setItem("quizKanjiList", JSON.stringify(kanjiList));
    }
    if (practiceMode) {
      sessionStorage.setItem("quizPracticeMode", practiceMode);
    }
    sessionStorage.setItem("quizCurrentIndex", currentIndex.toString());
    sessionStorage.setItem("quizIsRevealed", isRevealed.toString());
    sessionStorage.setItem(
      "quizShuffledIndices",
      JSON.stringify(shuffledIndices)
    );
    sessionStorage.setItem("quizIsFinished", isFinished.toString());
    sessionStorage.setItem("quizIsStarted", isStarted.toString());
  }, [
    kanjiList,
    practiceMode,
    currentIndex,
    isRevealed,
    shuffledIndices,
    isFinished,
    isStarted,
  ]);

  // Start quiz automatically when component mounts
  useEffect(() => {
    const hasStoredData = sessionStorage.getItem("quizIsStarted") === "true";

    if (kanjiList.length > 0 && practiceMode && !isStarted && !hasStoredData) {
      const indices = shuffleArray([...Array(kanjiList.length).keys()]);
      setShuffledIndices(indices);
      setCurrentIndex(0);
      setIsRevealed(false);
      setIsFinished(false);
      setIsStarted(true);
    }
  }, [kanjiList, practiceMode, isStarted]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isStarted || isFinished) return;

      if (e.key === " ") {
        e.preventDefault();
        if (!isRevealed) {
          handleReveal();
        } else {
          handleNext();
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "h" || e.key === "H") {
        e.preventDefault();
        setIsRevealed(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isStarted, isRevealed, isFinished, currentIndex]);

  const handleNext = (): void => {
    setIsRevealed(false);
    if (currentIndex < shuffledIndices.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleReveal = (): void => {
    setIsRevealed(true);
  };

  const handleGoHome = (): void => {
    // Clear sessionStorage when ending session
    sessionStorage.removeItem("quizKanjiList");
    sessionStorage.removeItem("quizPracticeMode");
    sessionStorage.removeItem("quizCurrentIndex");
    sessionStorage.removeItem("quizIsRevealed");
    sessionStorage.removeItem("quizShuffledIndices");
    sessionStorage.removeItem("quizIsFinished");
    sessionStorage.removeItem("quizIsStarted");
    navigate("/kanji");
  };

  const handleRestart = (): void => {
    const indices = shuffleArray([...Array(kanjiList.length).keys()]);
    setShuffledIndices(indices);
    setCurrentIndex(0);
    setIsRevealed(false);
    setIsFinished(false);
    setIsStarted(true);
  };

  const currentKanji: KanjiItem | null =
    isStarted && shuffledIndices.length > 0
      ? kanjiList[shuffledIndices[currentIndex]]
      : null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900 p-1 sm:p-6 md:p-8 overflow-auto">
      <div className="w-full min-h-screen flex flex-col items-center py-4">
        <div className="bg-white/5 w-full sm:w-[90%] lg:w-[80%] backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-6 sm:p-8 md:p-10 lg:p-12 flex-1 flex flex-col">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-gray-400 to-pink-400 mb-2">
              Kanji Quiz
            </h1>
            <p className="text-gray-300/60 text-sm sm:text-base">
              Master your kanji recognition and writing skills
            </p>
          </div>

          {/* Mode Badge */}
          <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-md border-2 border-cyan-400/30 text-white p-4 rounded-xl shadow-lg mb-6">
            <div className="flex items-center justify-center gap-3">
              {practiceMode === "kanjiToMeaning" ? (
                <>
                  <BookOpen className="w-6 h-6 text-cyan-400" />
                  <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                    Kanji → Meaning Mode
                  </span>
                </>
              ) : (
                <>
                  <Languages className="w-6 h-6 text-purple-400" />
                  <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                    Meaning → Kanji Mode
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quiz Card */}
          {isStarted && currentKanji && !isFinished && (
            <div className="flex-1 flex flex-col justify-center">
              {/* Control Buttons - Restart and End Session */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={handleRestart}
                  className="hover:cursor-pointer flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600/20 to-cyan-800/20 hover:from-cyan-500/30 hover:to-cyan-700/30 backdrop-blur-md border border-cyan-400/30 hover:border-cyan-300/50 text-cyan-200 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm sm:text-base"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restart Quiz
                </button>
                <button
                  onClick={handleGoHome}
                  className="hover:cursor-pointer flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600/20 to-red-800/20 hover:from-red-500/30 hover:to-red-700/30 backdrop-blur-md border border-red-400/30 hover:border-red-300/50 text-red-200 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm sm:text-base"
                >
                  <X className="w-4 h-4" />
                  End Session
                </button>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 sm:p-12 mb-6">
                {/* Progress */}
                <div className="text-center mb-6">
                  <div className="text-sm text-gray-400 mb-2">
                    Question {currentIndex + 1} / {shuffledIndices.length}
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-300"
                      style={{
                        width: `${
                          ((currentIndex + 1) / shuffledIndices.length) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Question */}
                <div className="mb-8">
                  {practiceMode === "kanjiToMeaning" ? (
                    <div className="text-center">
                      <div className="text-7xl sm:text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-200 via-purple-200 to-pink-200 mb-4">
                        {currentKanji.kanji}
                      </div>
                      <div className="text-gray-400 text-sm sm:text-base">
                        What does this kanji mean?
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-semibold text-purple-200 mb-2">
                        {currentKanji.japanese}
                      </div>
                      <div className="text-xl sm:text-2xl text-cyan-300 mb-4">
                        {currentKanji.chinese}
                      </div>
                      <div className="text-gray-400 text-sm sm:text-base">
                        What is the kanji character?
                      </div>
                    </div>
                  )}
                </div>

                {/* Answer */}
                {isRevealed && (
                  <div className="border-t-2 border-white/10 pt-8 animate-fadeIn">
                    {practiceMode === "kanjiToMeaning" ? (
                      <div className="space-y-3 text-center">
                        <div className="text-2xl sm:text-3xl font-semibold text-purple-200">
                          {currentKanji.japanese}
                        </div>
                        <div className="text-xl sm:text-2xl text-cyan-300">
                          {currentKanji.chinese}
                        </div>
                        <div className="text-base sm:text-lg text-gray-300 mt-4 bg-white/5 rounded-lg p-4 border border-white/10">
                          <span className="font-medium text-purple-300">
                            Example:
                          </span>{" "}
                          <span className="text-gray-200">
                            {currentKanji.example}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 text-center">
                        <div className="text-7xl sm:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-200 via-purple-200 to-pink-200 mb-4">
                          {currentKanji.kanji}
                        </div>
                        <div className="text-base sm:text-lg text-gray-300 bg-white/5 rounded-lg p-4 border border-white/10">
                          <span className="font-medium text-purple-300">
                            Example:
                          </span>{" "}
                          <span className="text-gray-200">
                            {currentKanji.example}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Controls */}
                <div className="grid grid-cols-2 gap-3 mt-8">
                  <button
                    onClick={handleReveal}
                    disabled={isRevealed}
                    className="hover:cursor-pointer flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600/20 to-purple-800/20 hover:from-cyan-500/30 hover:to-cyan-700/30 backdrop-blur-md border border-cyan-400/30 hover:border-cyan-300/50 text-cyan-200 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm sm:text-base"
                  >
                    <Eye className="w-5 h-5" />
                    Reveal Answer
                  </button>
                  <button
                    onClick={handleNext}
                    className="hover:cursor-pointer flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600/20 to-blue-800/20 hover:from-cyan-500/30 hover:to-cyan-700/30 backdrop-blur-md border border-cyan-400/30 hover:border-cyan-300/50 text-cyan-200 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm sm:text-base"
                  >
                    Next Word
                  </button>
                </div>
              </div>
            </div>
          )}
          {isFinished && (
            <div className="flex gap-3 mb-4">
              <button
                onClick={handleRestart}
                className="hover:cursor-pointer flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600/20 to-cyan-800/20 hover:from-cyan-500/30 hover:to-cyan-700/30 backdrop-blur-md border border-cyan-400/30 hover:border-cyan-300/50 text-cyan-200 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm sm:text-base"
              >
                <RotateCcw className="w-4 h-4" />
                Restart Quiz
              </button>
              <button
                onClick={handleGoHome}
                className="hover:cursor-pointer flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600/20 to-red-800/20 hover:from-red-500/30 hover:to-red-700/30 backdrop-blur-md border border-red-400/30 hover:border-red-300/50 text-red-200 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm sm:text-base"
              >
                <X className="w-4 h-4" />
                End Session
              </button>
            </div>
          )}

          {/* Finished Screen */}
          {isFinished && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 mb-6 shadow-xl border border-white/20 flex-1 flex flex-col items-center justify-center">
              <p className="text-center text-purple-200 mb-4 text-sm sm:text-base font-medium">
                Congratulations 🎉
              </p>
              <div className="text-3xl sm:text-4xl text-center mb-4 font-bold text-white animate-pulse">
                You did it! ✨
              </div>
              <p className="text-center text-purple-300/80 text-sm sm:text-base">
                You completed all {shuffledIndices.length} kanji characters!
              </p>
            </div>
          )}

          {/* Hide button removed from bottom */}
        </div>
      </div>
    </div>
  );
};

export default KanjiQuiz;
