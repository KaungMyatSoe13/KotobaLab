import { Routes, Route } from "react-router-dom";
import Books from "./pages/Books";
import BookDetail from "./pages/BookDetail";
import LessonQuiz from "./pages/LessonQuiz";
import Home from "./pages/Home";
import { Feedback } from "./pages/Feedback";

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
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </div>
  );
}

export default App;
