// src/components/Feedback.tsx
import React, { useState } from "react";
import { MessageSquare, Send, X, Star } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/config";

interface FeedbackProps {
  onClose?: () => void;
}

export const Feedback: React.FC<FeedbackProps> = ({ onClose }) => {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating!");
      return;
    }

    if (feedback.trim().length < 10) {
      alert("Please provide more detailed feedback (at least 10 characters)");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to Firestore
      await addDoc(collection(db, "feedback"), {
        rating,
        feedback,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent, // Optional: browser info
      });

      setIsSubmitted(true);

      setTimeout(() => {
        onClose?.();
      }, 2000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900 p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 sm:p-12 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✨</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Thank You!
          </h2>
          <p className="text-purple-300/80 text-sm sm:text-base">
            Your feedback helps us improve KotobaLab
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 sm:p-12 max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                We'd Love Your Feedback
              </h1>
              <p className="text-purple-300/80 text-sm sm:text-base">
                Help us improve your learning experience
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-white font-semibold mb-3">
              How would you rate your experience?
            </label>
            <div className="flex gap-2 justify-center sm:justify-start">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 sm:w-12 sm:h-12 ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-500"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-purple-300 text-sm mt-2 text-center sm:text-left">
                {rating === 5 && "Amazing! 🎉"}
                {rating === 4 && "Great! 😊"}
                {rating === 3 && "Good 👍"}
                {rating === 2 && "Could be better 🤔"}
                {rating === 1 && "Needs improvement 😕"}
              </p>
            )}
          </div>

          {/* Feedback Text */}
          <div>
            <label className="block text-white font-semibold mb-3">
              Tell us more about your experience
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What did you like? What could be improved? Any bugs or issues?"
              rows={6}
              className="w-full bg-white/10 border border-gray-500/30 rounded-xl p-4 text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-500/50 focus:bg-white/15 transition-all resize-none"
            />
            <p className="text-xs text-gray-400 mt-2">
              {feedback.length} / 500 characters
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="hover:cursor-pointer w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600/50 text-white px-6 py-4 rounded-xl font-bold hover:from-purple-600 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Feedback
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-xs text-gray-400 text-center">
            Your feedback is anonymous and helps us make KotobaLab better for
            everyone
          </p>
        </div>
      </div>
    </div>
  );
};
