import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, BookOpen, CheckCircle2 } from "lucide-react";
import {
  fetchBookDetails,
  type BookDetails,
  type Lesson,
} from "../services/booksService";

function BookDetail() {
  const { bookName } = useParams<{ bookName: string }>();
  const navigate = useNavigate();
  const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLessons, setSelectedLessons] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBookData();
  }, [bookName]);

  const loadBookData = async () => {
    if (!bookName) return;

    try {
      setLoading(true);
      setError(null);
      const { details, lessons } = await fetchBookDetails(bookName);

      if (!details) {
        setError("Book details are not found");
      } else {
        setBookDetails(details);
        setLessons(lessons);
      }
    } catch (err) {
      console.error("Error fetching book data:", err);
      setError("Failed to load book data");
    } finally {
      setLoading(false);
    }
  };

  const toggleLessonSelection = (lessonId: number) => {
    setSelectedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const selectAllLessons = () => {
    setSelectedLessons((prev) => {
      if (prev.length === lessons.length) {
        return [];
      } else {
        return lessons.map((l) => l.id);
      }
    });
  };

  const handleStartQuiz = () => {
    if (selectedLessons.length === 0) {
      alert("Please select at least one lesson!");
      return;
    }
    // Navigate to quiz page with selected lessons
    navigate(`/books/${bookName}/quiz`, {
      state: { selectedLessons: selectedLessons.sort((a, b) => a - b) },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300 text-lg">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error || !bookDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 max-w-md text-center">
          <p className="text-red-400 mb-4">{error || "Book not found"}</p>
          <button
            onClick={() => navigate("/books")}
            className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 px-6 py-2 rounded-lg transition"
          >
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/books")}
          className="hover:cursor-pointer flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Books
        </button>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
          {/* Book Cover Section */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden sticky top-24">
              <div className="aspect-[3/4] bg-gray-800/50">
                {bookDetails.image ? (
                  <img
                    src={bookDetails.image}
                    alt={bookDetails.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/300x400?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-gray-600" />
                  </div>
                )}
              </div>
              <div className="p-4 sm:p-6">
                <h2 className="text-white font-bold text-lg sm:text-xl mb-2">
                  {bookDetails.name}
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  {lessons.length} Lessons Available
                </p>
                <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/30">
                  <p className="text-cyan-300 text-sm font-semibold">
                    {selectedLessons.length} lesson
                    {selectedLessons.length !== 1 ? "s" : ""} selected
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lessons Selection Section */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-gray-400 to-gray-400">
                Select Lessons
              </h1>
              <button
                onClick={selectAllLessons}
                className="hover:cursor-pointer bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2 rounded-xl border border-white/10 transition text-sm font-semibold"
              >
                {selectedLessons.length === lessons.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>

            {lessons.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No lessons available</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
                  {lessons.map((lesson) => {
                    const isSelected = selectedLessons.includes(lesson.id);
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => toggleLessonSelection(lesson.id)}
                        className={`bg-white/5 backdrop-blur-xl rounded-xl border cursor-pointer transform transition-all duration-300 hover:scale-[1.02] p-4 ${
                          isSelected
                            ? "border-cyan-500/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/20"
                            : "border-white/10 hover:bg-white/10 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                isSelected
                                  ? "bg-gradient-to-br from-cyan-500 to-gray-500"
                                  : "bg-gradient-to-br from-gray-600 to-gray-700"
                              }`}
                            >
                              {lesson.id}
                            </div>
                            <div>
                              <h3 className="text-white font-semibold text-sm sm:text-base">
                                {lesson.title}
                              </h3>
                              <p className="text-gray-400 text-xs">
                                {lesson.vocabularyCount} words
                              </p>
                            </div>
                          </div>
                          <CheckCircle2
                            className={`w-6 h-6 transition-all ${
                              isSelected
                                ? "text-cyan-400 scale-100"
                                : "text-gray-600 scale-0"
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={handleStartQuiz}
                  disabled={selectedLessons.length === 0}
                  className="hover:cursor-pointer w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  Start Quiz ({selectedLessons.length} lesson
                  {selectedLessons.length !== 1 ? "s" : ""})
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
