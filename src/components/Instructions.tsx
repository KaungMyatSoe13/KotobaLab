// src/components/Instructions.tsx
import React from "react";
// import UploadButton from "./tempUploadButton";

export const Instructions: React.FC = () => {
  return (
    <div className="rounded-2xl p-4 sm:p-6 text-white bg-purple-900/10">
      <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
        How to Use:
      </h2>
      {/* <UploadButton /> */}
      <ol className="list-decimal list-inside space-y-1.5 sm:space-y-2 text-sm sm:text-base text-white/90">
        <li>
          Upload an Excel file with "Pronunciation", "Japanese Writing", and
          "Meaning" columns
        </li>
        <li>Click "Start Quiz" to begin</li>
        <li>Listen to the audio and try to recall the word</li>
        <li>Click "Reveal" to check your answer</li>
        <li>Click "Next Word" to continue</li>
      </ol>
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs sm:text-sm text-purple-300/60">
          💡 <strong>Keyboard shortcuts:</strong> Press{" "}
          <kbd className="px-2 py-1 bg-white/10 rounded">Enter</kbd> or{" "}
          <kbd className="px-2 py-1 bg-white/10 rounded">Space</kbd> to
          reveal/next, <kbd className="px-2 py-1 bg-white/10 rounded">R</kbd> to
          replay, <kbd className="px-2 py-1 bg-white/10 rounded">H</kbd> to hide
          answer
        </p>
        <p className="text-xs text-yellow-400/70 mt-2">
          Note: Audio may require user interaction on some mobile devices
        </p>
        <p className="text-xs text-purple-300/50 mt-2">
          #Progress is saved in your browser session
        </p>
      </div>
    </div>
  );
};
