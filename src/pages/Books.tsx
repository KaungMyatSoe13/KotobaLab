import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Loader2 } from "lucide-react";
import { fetchAllBooks, fetchAllKanjiBooks } from "../services/booksService";

interface Book {
  id: string;
  name: string;
  image: string;
  totalLessons?: number;
}

function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [kanjiBooks, setKanjiBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedBooks = await fetchAllBooks();
      const fetchedKanjiBooks = await fetchAllKanjiBooks();

      setBooks(fetchedBooks);
      setKanjiBooks(fetchedKanjiBooks);
      console.log("Fetched books:", fetchedBooks);
      console.log("Fetched kanji books:", fetchedKanjiBooks);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Failed to load books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (bookId: string) => {
    if (bookId.startsWith("kanji-")) {
      // Navigate to kanji detail page
      const kanjiLevel = bookId.replace("kanji-", "");
      navigate(`/kanji/${kanjiLevel}/kanji-quiz`);
    } else {
      // Navigate to regular book page
      navigate(`/books/${bookId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300 text-lg">Loading books...</p>
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
            onClick={loadBooks}
            className="hover:cursor-pointer w-full bg-gradient-to-r from-red-500 to-rose-600/50 hover:from-red-600 hover:to-rose-700 text-white py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-red-500/50"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-gray-400 to-pink-400 mb-2">
            Books Library
          </h1>
          <p className="text-gray-300/60 text-sm sm:text-base">
            Browse and explore your Japanese learning collection
          </p>
        </div>
        <div className="mb-5 text-lg sm:text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-400 via-gray-400 to-blue-400 mb-2">
          {" "}
          Kotoba Books
        </div>
        {books.length === 0 ? (
          <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12">
            <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-xl mb-2">No books found</p>
            <p className="text-gray-500">Upload some lessons to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-10 ">
            {books.map((book) => (
              <div
                key={book.id}
                onClick={() => handleBookClick(book.id)}
                className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-2xl hover:shadow-cyan-500/30"
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
                  {book.image ? (
                    <img
                      src={book.image}
                      alt={book.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
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
                  {book.totalLessons && book.totalLessons > 0 && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                      {book.totalLessons} Lessons
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="text-white font-bold text-base sm:text-lg line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300">
                    {book.name}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">
                    Click to view lessons
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mb-5 text-lg sm:text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-400 via-gray-400 to-blue-400 mb-2">
          {" "}
          Kanji Books
        </div>

        {kanjiBooks.length === 0 ? (
          <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12">
            <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-xl mb-2">No books found</p>
            <p className="text-gray-500">Upload some lessons to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {kanjiBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => handleBookClick(book.id)}
                className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-2xl hover:shadow-cyan-500/30"
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
                  {book.image ? (
                    <img
                      src={book.image}
                      alt={book.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
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
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                    {book.totalLessons} Kanjis
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="text-white font-bold text-base sm:text-lg line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300">
                    {book.name}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">
                    Click to pracitce
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Books;
