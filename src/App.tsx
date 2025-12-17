import { Routes, Route } from "react-router-dom";
import Books from "./pages/Books";
import BookDetail from "./pages/BookDetail";
import LessonQuiz from "./pages/LessonQuiz";
import Home from "./pages/Home";
import { Feedback } from "./pages/Feedback";
import Kanji from "./pages/Kanji";
import KanjiQuiz from "./pages/KanjiQuiz";
import KanjiDetail from "./pages/KanjiDetail";

function App() {
  return (
    <div className="pt-16">
      {" "}
      {/* add padding for fixed navbar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:bookName" element={<BookDetail />} />
        <Route path="/books/:bookName/quiz" element={<LessonQuiz />} />
        <Route path="/kanji" element={<Kanji />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/kanji-quiz" element={<KanjiQuiz />} />
        <Route path="/kanji/:level/kanji-quiz" element={<KanjiDetail />} />
      </Routes>
    </div>
  );
}

export default App;
