// src/components/QuizControls.tsx
import React from "react";
import { Play, RotateCcw, Home } from "lucide-react";
interface QuizControlsProps {
  isStarted: boolean;
  isFinished: boolean;
  vocabLength: number;
  isLoading: boolean;
  onStart: () => void;
  onGoHome: () => void;
  hasFile: boolean; // Add this new prop
}

export const QuizControls: React.FC<QuizControlsProps> = ({
  isStarted,
  isFinished,
  vocabLength,
  isLoading,
  onStart,
  onGoHome,
  hasFile,
}) => {
  // Don't render anything if no file is uploaded and quiz hasn't started
  if (!hasFile && !isStarted) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
      <button
        onClick={onStart}
        disabled={vocabLength === 0 || isLoading}
        className="hover:cursor-pointer flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600/50 text-white px-6 py-3.5 rounded-xl text-sm sm:text-base font-bold hover:from-emerald-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 disabled:shadow-none"
      >
        {isStarted ? (
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
        ) : (
          <Play className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
        {isStarted ? "Restart Quiz" : "Start Quiz"}
      </button>

      {isFinished ? (
        <button
          onClick={onGoHome}
          disabled={vocabLength === 0}
          className="hover:cursor-pointer flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-500 to-blue-600/50 text-white px-6 py-3.5 rounded-xl text-sm sm:text-base font-bold hover:from-gray-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-blue-500/50 disabled:shadow-none"
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          Go Back to Home
        </button>
      ) : null}

      {!isFinished && isStarted && (
        <>
          <button
            onClick={onGoHome}
            className="hover:cursor-pointer flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-600/50 text-white px-6 py-3.5 rounded-xl text-sm sm:text-base font-bold hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-red-500/50"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            End Session
          </button>
        </>
      )}
    </div>
  );
};
