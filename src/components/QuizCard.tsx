// src/components/QuizCard.tsx
import React from "react";
import { Eye, ChevronRight, EyeOff, RotateCcw } from "lucide-react";
import type { VocabItem } from "../utils/types";

interface QuizCardProps {
  currentWord: VocabItem;
  currentIndex: number;
  totalWords: number;
  isRevealed: boolean;
  isFinished: boolean;
  onReveal: () => void;
  onNext: () => void;
  onHideAnswer: () => void;
  onReplay: () => void; // Add this prop
}

export const QuizCard: React.FC<QuizCardProps> = ({
  currentWord,
  currentIndex,
  totalWords,
  isRevealed,
  isFinished,
  onReveal,
  onNext,
  onHideAnswer,
  onReplay, // Destructure new prop
}) => {
  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8 mb-6 border border-purple-500/20 flex-1 flex flex-col">
      {!isFinished && (
        <div className="text-center mb-6">
          <p className="text-sm sm:text-base text-purple-300/80 mb-3 font-medium">
            Word {currentIndex + 1} of {totalWords}
          </p>

          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-500 ease-out"
              style={{
                width: `${((currentIndex + 1) / totalWords) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {isRevealed && !isFinished && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl space-y-4 border border-white/20 mb-6 relative">
          <button
            onClick={onHideAnswer}
            className="hover:cursor-pointer absolute top-3 right-3 bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            aria-label="Hide answer"
          >
            <EyeOff className="w-4 h-4" />
          </button>
          <div className="border-b border-white/10 pb-4">
            <p className="text-xs sm:text-sm text-purple-300/60 mb-2 uppercase tracking-wider font-semibold">
              Pronunciation
            </p>
            <p className="text-xl sm:text-2xl font-bold text-cyan-300">
              {currentWord.pronunciation}
            </p>
          </div>
          <div className="border-b border-white/10 pb-4">
            <p className="text-xs sm:text-sm text-purple-300/60 mb-2 uppercase tracking-wider font-semibold">
              Japanese Writing
            </p>
            <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              {currentWord.japanese}
            </p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-purple-300/60 mb-2 uppercase tracking-wider font-semibold">
              Meaning
            </p>
            <p className="text-lg sm:text-xl text-purple-100 font-medium">
              {currentWord.meaning}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {!isRevealed && !isFinished && (
          <button
            onClick={onReveal}
            className="hover:cursor-pointer flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600/50 text-white px-6 py-3.5 rounded-xl text-sm sm:text-base font-bold hover:from-amber-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-amber-500/50"
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            Reveal Answer
          </button>
        )}

        {!isFinished && (
          <>
            <button
              onClick={onReplay}
              className="hover:cursor-pointer flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600/50 text-white px-6 py-3.5 rounded-xl text-sm sm:text-base font-bold hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              Replay Audio
            </button>

            <button
              onClick={onNext}
              className="hover:cursor-pointer flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600/50 text-white px-6 py-3.5 rounded-xl text-sm sm:text-base font-bold hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
            >
              Next Word
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}
      </div>

      {isFinished && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 mb-6 shadow-xl border border-white/20 flex-1 flex flex-col items-center justify-center">
          <p className="text-center text-purple-200 mb-4 text-sm sm:text-base font-medium">
            Congratulations 🎉
          </p>
          <div className="text-3xl sm:text-4xl text-center mb-4 font-bold text-white animate-pulse">
            You did it! ✨
          </div>
          <p className="text-center text-purple-300/80 text-sm sm:text-base">
            You completed all {totalWords} words!
          </p>
        </div>
      )}
    </div>
  );
};
