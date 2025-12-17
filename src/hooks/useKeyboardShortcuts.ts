// src/hooks/useKeyboardShortcuts.ts
import { useEffect } from "react";

interface UseKeyboardShortcutsProps {
  isStarted: boolean;
  isRevealed: boolean;
  isFinished: boolean;
  onNext: () => void;
  onReveal: () => void;
  onReplay?: () => void;
  onHide: () => void;
}

export const useKeyboardShortcuts = ({
  isStarted,
  isRevealed,
  isFinished,
  onNext,
  onReveal,
  onReplay,
  onHide,
}: UseKeyboardShortcutsProps): void => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isStarted || isFinished) return;

      if (e.key === "Enter") {
        e.preventDefault();
        onNext();
      }

      if (e.key === " ") {
        e.preventDefault();
        if (isRevealed) {
          onNext();
        } else {
          onReveal();
        }
      }

      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        // onReplay();
      }

      if (e.key === "h" || e.key === "H") {
        e.preventDefault();
        if (isRevealed) {
          onHide();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isStarted, isRevealed, isFinished, onNext, onReveal, onReplay, onHide]);
};
