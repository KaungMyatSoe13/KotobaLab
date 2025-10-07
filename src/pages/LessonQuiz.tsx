import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import type { VocabItem } from "../utils/types";
import { shuffleArray, speakWord } from "../utils/utils";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { QuizControls } from "../components/QuizControls";
import { QuizCard } from "../components/QuizCard";
import { Loader2 } from "lucide-react";
import { Instructions } from "../components/Instructions";
import { lessonStorage } from "../utils/storage";
import { fetchLessonsVocabulary } from "../services/booksService";

const LessonQuiz: React.FC = () => {
  const { bookName } = useParams<{ bookName: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Try to get selectedLessons from location.state first, then from storage
  const selectedLessonsFromState = location.state?.selectedLessons || [];
  const selectedLessonsFromStorage = lessonStorage.getSelectedLessons();
  const storedBookName = lessonStorage.getBookName();

  // Use state if available, otherwise use storage
  const initialSelectedLessons =
    selectedLessonsFromState.length > 0
      ? selectedLessonsFromState
      : selectedLessonsFromStorage;

  const [vocabList, setVocabList] = useState<VocabItem[]>(
    lessonStorage.getVocabList()
  );
  const [currentIndex, setCurrentIndex] = useState<number>(
    lessonStorage.getCurrentIndex()
  );
  const [isStarted, setIsStarted] = useState<boolean>(
    lessonStorage.getIsStarted()
  );
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>(
    lessonStorage.getShuffledIndices()
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [selectedLessons] = useState<number[]>(initialSelectedLessons);

  // Persist state to storage
  useEffect(() => {
    lessonStorage.setVocabList(vocabList);
  }, [vocabList]);

  useEffect(() => {
    lessonStorage.setCurrentIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    lessonStorage.setIsStarted(isStarted);
  }, [isStarted]);

  useEffect(() => {
    lessonStorage.setShuffledIndices(shuffledIndices);
  }, [shuffledIndices]);

  useEffect(() => {
    lessonStorage.setSelectedLessons(selectedLessons);
  }, [selectedLessons]);

  useEffect(() => {
    if (bookName) {
      lessonStorage.setBookName(bookName);
    }
  }, [bookName]);

  // Fetch lessons data on mount or when lessons change
  useEffect(() => {
    // If no lessons selected and no lessons in storage, redirect back
    if (selectedLessons.length === 0) {
      navigate(`/books/${bookName}`);
      return;
    }

    // If bookName doesn't match stored bookName, clear and redirect
    if (bookName && storedBookName && bookName !== storedBookName) {
      lessonStorage.clearAll();
      navigate(`/books/${bookName}`);
      return;
    }

    // If vocab list is empty, fetch it
    if (vocabList.length === 0) {
      loadLessonsData();
    }
  }, []);

  const loadLessonsData = async () => {
    if (!bookName) return;

    try {
      setIsLoading(true);
      const vocabulary = await fetchLessonsVocabulary(
        bookName,
        selectedLessons
      );
      setVocabList(vocabulary);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      alert("Failed to load lessons. Please try again.");
      navigate(`/books/${bookName}`);
    }
  };

  const handleStart = (): void => {
    if (vocabList.length === 0) {
      alert("No vocabulary loaded!");
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
    lessonStorage.clearAll();
    navigate(`/books/${bookName}`);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300 text-lg">
            Loading vocabulary(Might take a while)...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900 p-1 sm:p-6 md:p-8 overflow-auto">
      <div className="w-full min-h-screen flex flex-col items-center py-4">
        <div className="bg-white/5 w-full sm:w-[90%] lg:w-[80%] backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-6 sm:p-8 md:p-10 lg:p-12 flex-1 flex flex-col">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-gray-400 to-pink-400 mb-2">
              Japanese Vocabulary Quiz
            </h1>
            <p className="text-gray-300/60 text-sm sm:text-base">
              {bookName} - {selectedLessons.length} lesson
              {selectedLessons.length !== 1 ? "s" : ""}
            </p>
          </div>

          <QuizControls
            isStarted={isStarted}
            isFinished={isFinished}
            vocabLength={vocabList.length}
            isLoading={isLoading}
            onStart={handleStart}
            onGoHome={handleGoHome}
            hasFile={true}
          />

          {!isStarted && !isFinished && <Instructions />}

          {!isStarted && !isFinished && (
            <div className="text-center text-purple-200/80 bg-white/5 rounded-xl p-6 border border-white/10 mt-5">
              <p className="text-base sm:text-lg font-semibold mb-2">
                Loaded {vocabList.length} vocabulary words
              </p>
              <p className="text-sm sm:text-base text-purple-300/60">
                Press Start Quiz to begin your practice!
              </p>
            </div>
          )}

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
        </div>
      </div>
    </div>
  );
};

export default LessonQuiz;
