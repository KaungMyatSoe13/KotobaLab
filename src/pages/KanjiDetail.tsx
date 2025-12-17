//book>kanji-quiz
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Loader2,
  Play,
  ArrowLeft,
  Eye,
  RotateCcw,
  X,
  Languages,
} from "lucide-react";
import { fetchKanjiByLevel, type KanjiItem } from "../services/booksService";
import { kanjiStorage } from "../utils/kanjiStorage";

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

interface QuizKanjiItem {
  kanji: string;
  japanese: string;
  chinese: string;
  example: string;
}

function KanjiDetail() {
  const { level } = useParams<{ level: string }>();
  const navigate = useNavigate();
  const [kanjiList, setKanjiList] = useState<KanjiItem[]>(
    kanjiStorage.getKanjiList()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [practiceMode, setPracticeMode] = useState<
    "kanjiToMeaning" | "meaningToKanji"
  >(kanjiStorage.getPracticeMode());

  // Quiz states
  const [isQuizStarted, setIsQuizStarted] = useState(
    kanjiStorage.getIsQuizStarted()
  );
  const [currentIndex, setCurrentIndex] = useState(
    kanjiStorage.getCurrentIndex()
  );
  const [isRevealed, setIsRevealed] = useState(kanjiStorage.getIsRevealed());
  const [shuffledIndices, setShuffledIndices] = useState<number[]>(
    kanjiStorage.getShuffledIndices()
  );
  const [isFinished, setIsFinished] = useState(kanjiStorage.getIsFinished());
  const [quizKanjiList, setQuizKanjiList] = useState<QuizKanjiItem[]>(
    kanjiStorage.getQuizKanjiList()
  );

  useEffect(() => {
    loadKanji();
  }, [level]);

  // Persist level
  useEffect(() => {
    if (level) {
      kanjiStorage.setLevel(level);
    }
  }, [level]);

  // Persist all states
  useEffect(() => {
    kanjiStorage.setKanjiList(kanjiList);
  }, [kanjiList]);

  useEffect(() => {
    kanjiStorage.setQuizKanjiList(quizKanjiList);
  }, [quizKanjiList]);

  useEffect(() => {
    kanjiStorage.setCurrentIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    kanjiStorage.setIsQuizStarted(isQuizStarted);
  }, [isQuizStarted]);

  useEffect(() => {
    kanjiStorage.setIsRevealed(isRevealed);
  }, [isRevealed]);

  useEffect(() => {
    kanjiStorage.setShuffledIndices(shuffledIndices);
  }, [shuffledIndices]);

  useEffect(() => {
    kanjiStorage.setIsFinished(isFinished);
  }, [isFinished]);

  useEffect(() => {
    kanjiStorage.setPracticeMode(practiceMode);
  }, [practiceMode]);

  const loadKanji = async () => {
    try {
      setLoading(true);
      setError(null);
      if (level) {
        const fetchedKanji = await fetchKanjiByLevel(level);
        console.log("Fetched kanji:", fetchedKanji);
        setKanjiList(fetchedKanji);
      }
    } catch (err) {
      console.error("Error fetching kanji:", err);
      setError("Failed to load kanji. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    const mapped = kanjiList.map((item) => ({
      kanji: item.Kanji,
      japanese: item.Japanese,
      chinese: item.Chinese,
      example: item.Example,
    }));
    setQuizKanjiList(mapped);
    const indices = shuffleArray([...Array(mapped.length).keys()]);
    setShuffledIndices(indices);
    setCurrentIndex(0);
    setIsRevealed(false);
    setIsFinished(false);
    setIsQuizStarted(true);
  };

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

  const handleEndQuiz = (): void => {
    setIsQuizStarted(false);
    setIsFinished(false);
    setCurrentIndex(0);
    setIsRevealed(false);
    setShuffledIndices([]);
    kanjiStorage.clearAll();
  };

  const handleRestart = (): void => {
    const indices = shuffleArray([...Array(quizKanjiList.length).keys()]);
    setShuffledIndices(indices);
    setCurrentIndex(0);
    setIsRevealed(false);
    setIsFinished(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!isQuizStarted || isFinished) return;

    const handleKeyPress = (e: KeyboardEvent) => {
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
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isQuizStarted, isRevealed, isFinished, currentIndex]);

  const currentKanji: QuizKanjiItem | null =
    isQuizStarted && shuffledIndices.length > 0
      ? quizKanjiList[shuffledIndices[currentIndex]]
      : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-pink-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300 text-lg">Loading kanji...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 max-w-md w-full">
          <p className="text-red-400 text-center mb-4">{error}</p>
          <button
            onClick={loadKanji}
            className="w-full bg-gradient-to-r from-red-500 to-rose-600/50 hover:from-red-600 hover:to-rose-700 text-white py-3 rounded-xl font-bold transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Quiz View
  if (isQuizStarted) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900 p-1 sm:p-6 md:p-8 overflow-auto">
        <div className="w-full min-h-screen flex flex-col items-center py-4">
          <div className="bg-white/5 w-full sm:w-[90%] lg:w-[80%] backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-6 sm:p-8 md:p-10 lg:p-12 flex-1 flex flex-col">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-gray-400 to-pink-400 mb-2">
                Kanji {level} Quiz
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
            {currentKanji && !isFinished && (
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
                    onClick={handleEndQuiz}
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
                          {currentKanji.kanji.split("(")[0].trim()}
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
                            {currentKanji.kanji.split("(")[0].trim()}
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
                      className="hover:cursor-pointer flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600/20 to-purple-800/20 hover:from-cyan-500/30 hover:to-cyan-700/30 backdrop-blur-md border border-cyan-400/30 hover:border-cyan-300/50 text-cyan-200 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* Finished Screen */}
            {isFinished && (
              <>
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={handleRestart}
                    className="hover:cursor-pointer flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600/20 to-cyan-800/20 hover:from-cyan-500/30 hover:to-cyan-700/30 backdrop-blur-md border border-cyan-400/30 hover:border-cyan-300/50 text-cyan-200 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm sm:text-base"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restart Quiz
                  </button>
                  <button
                    onClick={handleEndQuiz}
                    className="hover:cursor-pointer flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600/20 to-red-800/20 hover:from-red-500/30 hover:to-red-700/30 backdrop-blur-md border border-red-400/30 hover:border-red-300/50 text-red-200 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm sm:text-base"
                  >
                    <X className="w-4 h-4" />
                    End Session
                  </button>
                </div>
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
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Setup View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/books")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Books
        </button>

        <div className="text-center mb-6 sm:mb-8">
          <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-gray-400 to-pink-400 mb-2">
            Kanji Quiz {level}
          </h1>
          <p className="text-gray-300/60 text-sm sm:text-base">
            Master your Kanji with interactive practice
          </p>
        </div>

        {/* Practice Mode Selection */}
        <div
          className={`backdrop-blur-md border-2 text-white p-4 rounded-xl shadow-lg mb-4 ${
            practiceMode
              ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/30"
              : "bg-white/5 border-white/20"
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            {practiceMode === "kanjiToMeaning" ? (
              <>
                <BookOpen className="w-6 h-6 text-cyan-400" />
                <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                  Kanji → Meaning Mode
                </span>
              </>
            ) : practiceMode === "meaningToKanji" ? (
              <>
                <Languages className="w-6 h-6 text-purple-400" />
                <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                  Meaning → Kanji Mode
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-400">
                Select Practice Mode Below
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <button
            onClick={() => setPracticeMode("kanjiToMeaning")}
            className={`group relative overflow-hidden backdrop-blur-md border-2 p-6 rounded-2xl hover:cursor-pointer ${
              practiceMode === "kanjiToMeaning"
                ? "bg-gradient-to-br from-cyan-600/30 to-cyan-800/30 border-cyan-400/50 shadow-lg shadow-cyan-500/20"
                : "bg-white/5 border-white/20 hover:border-cyan-400/50 hover:bg-white/10"
            }`}
          >
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div
                className={`p-4 rounded-full ${
                  practiceMode === "kanjiToMeaning"
                    ? "bg-cyan-500/20"
                    : "bg-white/10"
                }`}
              >
                <BookOpen
                  className={`w-12 h-12 ${
                    practiceMode === "kanjiToMeaning"
                      ? "text-cyan-400"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <div>
                <div
                  className={`font-bold text-lg mb-1 ${
                    practiceMode === "kanjiToMeaning"
                      ? "text-cyan-200"
                      : "text-gray-300"
                  }`}
                >
                  Kanji → Meaning
                </div>
                <div className="text-sm text-gray-400">
                  See kanji, guess the meaning
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setPracticeMode("meaningToKanji")}
            className={`group relative overflow-hidden backdrop-blur-md border-2 p-6 rounded-2xl hover:cursor-pointer ${
              practiceMode === "meaningToKanji"
                ? "bg-gradient-to-br from-purple-600/30 to-purple-800/30 border-purple-400/50 shadow-lg shadow-purple-500/20"
                : "bg-white/5 border-white/20 hover:border-purple-400/50 hover:bg-white/10"
            }`}
          >
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div
                className={`p-4 rounded-full ${
                  practiceMode === "meaningToKanji"
                    ? "bg-purple-500/20"
                    : "bg-white/10"
                }`}
              >
                <Languages
                  className={`w-12 h-12 ${
                    practiceMode === "meaningToKanji"
                      ? "text-purple-400"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <div>
                <div
                  className={`font-bold text-lg mb-1 ${
                    practiceMode === "meaningToKanji"
                      ? "text-purple-200"
                      : "text-gray-300"
                  }`}
                >
                  Meaning → Kanji
                </div>
                <div className="text-sm text-gray-400">
                  See meaning, guess the kanji
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Start Quiz Button */}
        <button
          onClick={handleStartQuiz}
          className="w-full hover:cursor-pointer flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600/20 to-green-800/20 hover:from-green-500/30 hover:to-green-700/30 backdrop-blur-md border border-cyan-400/30 hover:border-cyan-300/50 text-cyan-200 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-6 h-6" />
          Start Quiz ({kanjiList.length} Kanjis)
        </button>
      </div>
    </div>
  );
}

export default KanjiDetail;
