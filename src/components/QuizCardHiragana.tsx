// src/components/QuizCard.tsx
import React from "react";
import { Eye, ChevronRight, EyeOff } from "lucide-react";
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
}

export const QuizCardHiragana: React.FC<QuizCardProps> = ({
  currentWord,
  currentIndex,
  totalWords,
  isRevealed,
  isFinished,
  onReveal,
  onNext,
  onHideAnswer,
}) => {
  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8 mb-6 border border-purple-500/20 flex-1 flex flex-col">
      {!isFinished && (
        <div className="text-center mb-6">
          <p className="text-sm sm:text-base text-purple-300/80 mb-3 font-medium">
            Word {currentIndex + 1} of {totalWords}
          </p>

          {/* Display hiragana word */}
          <div className="mb-4">
            <p className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              {currentWord.japanese}
            </p>
          </div>

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
            className="hover:cursor-pointer flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600/20 to-purple-800/20 hover:from-cyan-500/30 hover:to-cyan-700/30 backdrop-blur-md border border-cyan-400/30 hover:border-cyan-300/50 text-cyan-200 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm sm:text-base"
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            Reveal Answer
          </button>
        )}

        {!isFinished && (
          <button
            onClick={onNext}
            className="hover:cursor-pointer flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600/20 to-blue-800/20 hover:from-cyan-500/30 hover:to-cyan-700/30 backdrop-blur-md border border-cyan-400/30 hover:border-cyan-300/50 text-cyan-200 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm sm:text-base"
          >
            Next Word
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
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
            You completed all {totalWords} kanji characters!
          </p>
        </div>
      )}
    </div>
  );
};
