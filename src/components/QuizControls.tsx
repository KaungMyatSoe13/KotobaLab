// src/components/QuizControls.tsx
import React from "react";
import { Play, RotateCcw, Home, BookOpen, Headphones } from "lucide-react";

interface QuizControlsProps {
  isStarted: boolean;
  isFinished: boolean;
  vocabLength: number;
  isLoading: boolean;
  onStart: () => void;
  onGoHome: () => void;
  hasFile: boolean;
  practiceMode: "reading" | "listening" | null; // Add practice mode
  onSelectMode: (mode: "reading" | "listening") => void; // Add mode selector
}

export const QuizControls: React.FC<QuizControlsProps> = ({
  isStarted,
  isFinished,
  vocabLength,
  isLoading,
  onStart,
  onGoHome,
  hasFile,
  practiceMode,
  onSelectMode,
}) => {
  // Don't render anything if no file is uploaded and quiz hasn't started
  if (!hasFile && !isStarted) {
    return null;
  }

  return (
    <div className="mb-6 sm:mb-8">
      {/* Practice Mode Selection - Only show before quiz starts */}
      {hasFile && !isStarted && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Reading Practice Block */}
          <button
            onClick={() => onSelectMode("reading")}
            className={`hover:cursor-pointer p-8 rounded-2xl transition-all duration-300 shadow-lg border-2 ${
              practiceMode === "reading"
                ? "bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-cyan-400 shadow-cyan-500/50"
                : "bg-white/5 border-white/10 hover:border-cyan-400/50 hover:bg-white/10"
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div
                className={`p-4 rounded-full ${
                  practiceMode === "reading" ? "bg-cyan-500/20" : "bg-white/10"
                }`}
              >
                <BookOpen
                  className={`w-12 h-12 ${
                    practiceMode === "reading"
                      ? "text-cyan-400"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <div className="text-center">
                <h3
                  className={`text-xl sm:text-2xl font-bold mb-2 ${
                    practiceMode === "reading"
                      ? "text-cyan-300"
                      : "text-gray-300"
                  }`}
                >
                  Reading Practice
                </h3>
                <p
                  className={`text-sm ${
                    practiceMode === "reading"
                      ? "text-cyan-200/80"
                      : "text-gray-400"
                  }`}
                >
                  See hiragana, guess the meaning
                </p>
              </div>
            </div>
          </button>

          {/* Listening Practice Block */}
          <button
            onClick={() => onSelectMode("listening")}
            className={`hover:cursor-pointer p-8 rounded-2xl transition-all duration-300 shadow-lg border-2 ${
              practiceMode === "listening"
                ? "bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-purple-400 shadow-purple-500/50"
                : "bg-white/5 border-white/10 hover:border-purple-400/50 hover:bg-white/10"
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div
                className={`p-4 rounded-full ${
                  practiceMode === "listening"
                    ? "bg-purple-500/20"
                    : "bg-white/10"
                }`}
              >
                <Headphones
                  className={`w-12 h-12 ${
                    practiceMode === "listening"
                      ? "text-purple-400"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <div className="text-center">
                <h3
                  className={`text-xl sm:text-2xl font-bold mb-2 ${
                    practiceMode === "listening"
                      ? "text-purple-300"
                      : "text-gray-300"
                  }`}
                >
                  Listening Practice
                </h3>
                <p
                  className={`text-sm ${
                    practiceMode === "listening"
                      ? "text-purple-200/80"
                      : "text-gray-400"
                  }`}
                >
                  Hear audio, guess the meaning
                </p>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={onStart}
          disabled={
            vocabLength === 0 || isLoading || (!isStarted && !practiceMode)
          }
          className="hover:cursor-pointer flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-400/20 to-green-800/20 hover:from-green-500/30 hover:to-green-700/30 backdrop-blur-md border border-cyan-400/30 hover:border-cyan-300/50 text-cyan-200 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm sm:text-base"
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
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600/20 to-red-800/20 hover:from-red-500/30 hover:to-red-700/30 backdrop-blur-md border border-cyan-400/30 hover:border-cyan-300/50 text-cyan-200 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm sm:text-base"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            Go Back to Home
          </button>
        ) : null}

        {!isFinished && isStarted && (
          <>
            <button
              onClick={onGoHome}
              className="hover:cursor-pointer flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600/20 to-red-800/20 hover:from-red-500/30 hover:to-red-700/30 backdrop-blur-md border border-red-400/30 hover:border-red-300/50 text-red-200 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm sm:text-base"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              End Session
            </button>
          </>
        )}
      </div>
    </div>
  );
};
