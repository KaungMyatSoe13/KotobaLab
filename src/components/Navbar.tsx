import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom"; // <--- import Link

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="absolute top-0 bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900 shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-gray-600">
              KotobaLab
            </Link>
          </div>

          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Vocabs
            </Link>
            <Link
              to="/kanji"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Kanji
            </Link>
            <Link
              to="/books"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Books
            </Link>
            <Link
              to="/feedback"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Feedback
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-800 shadow-md">
          <Link
            to="/books"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Books
          </Link>
          <Link
            to="/feedback"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Feedback
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
