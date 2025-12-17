import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  parseKanjiExcelFile,
  downloadKanjiTemplate,
  type KanjiItem,
} from "../services/fileHandler";
import { FileUpload } from "../components/FileUpload";
import { BookOpen, Languages } from "lucide-react";
import { KanjiInstructions } from "../components/Instructions";

const Kanji: React.FC = () => {
  const navigate = useNavigate();
  const [kanjiList, setKanjiList] = useState<KanjiItem[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [practiceMode, setPracticeMode] = useState<
    "kanjiToMeaning" | "meaningToKanji" | null
  >(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);

    parseKanjiExcelFile(
      file,
      (kanji) => {
        setKanjiList(kanji);
        setIsLoading(false);
        console.log("Parsed kanji:", kanji);
      },
      () => {
        alert("Error reading file. Please make sure it's a valid Excel file.");
        setIsLoading(false);
      }
    );
  };

  const handleStartQuiz = (): void => {
    if (kanjiList.length === 0) {
      alert("Please upload a file first!");
      return;
    }
    if (!practiceMode) {
      alert("Please select a practice mode first!");
      return;
    }
    navigate("/kanji-quiz", { state: { kanjiList, practiceMode } });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900 p-1 sm:p-6 md:p-8 overflow-auto">
      <div className="w-full min-h-screen flex flex-col items-center py-4">
        <div className="bg-white/5 w-full sm:w-[90%] lg:w-[80%] backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-6 sm:p-8 md:p-10 lg:p-12 flex-1 flex flex-col">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-gray-400 to-pink-400 mb-2">
              Kanji Quiz
            </h1>
            <p className="text-gray-300/60 text-sm sm:text-base">
              Master your Kanji with interactive practice
            </p>
          </div>

          {/* File Upload */}
          <FileUpload
            fileName={fileName}
            isLoading={isLoading}
            onFileChange={handleFileUpload}
            onDownloadTemplate={downloadKanjiTemplate}
          />

          {/* Mode Selection - Only show when file is loaded */}
          {kanjiList.length > 0 && (
            <>
              <div
                className={`backdrop-blur-md border-2 text-white p-4 rounded-xl shadow-lg mb-4 ${
                  practiceMode
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/30"
                    : "bg-white/5 border-white/20"
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  {practiceMode === "kanjiToMeaning" ? (
                    <>
                      <BookOpen className="w-6 h-6 text-cyan-400" />
                      <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                        Kanji → Meaning Mode
                      </span>
                    </>
                  ) : practiceMode === "meaningToKanji" ? (
                    <>
                      <Languages className="w-6 h-6 text-purple-400" />
                      <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                        Meaning → Kanji Mode
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-gray-400">
                      Select Practice Mode Below
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <button
                  onClick={() => setPracticeMode("kanjiToMeaning")}
                  className={`group relative overflow-hidden backdrop-blur-md border-2 p-6 rounded-2xl hover:cursor-pointer ${
                    practiceMode === "kanjiToMeaning"
                      ? "bg-gradient-to-br from-cyan-600/30 to-cyan-800/30 border-cyan-400/50 shadow-lg shadow-cyan-500/20"
                      : "bg-white/5 border-white/20 hover:border-cyan-400/50 hover:bg-white/10"
                  }`}
                >
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div
                      className={`p-4 rounded-full ${
                        practiceMode === "kanjiToMeaning"
                          ? "bg-cyan-500/20"
                          : "bg-white/10"
                      }`}
                    >
                      <BookOpen
                        className={`w-12 h-12 ${
                          practiceMode === "kanjiToMeaning"
                            ? "text-cyan-400"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div>
                      <div
                        className={`font-bold text-lg mb-1 ${
                          practiceMode === "kanjiToMeaning"
                            ? "text-cyan-200"
                            : "text-gray-300"
                        }`}
                      >
                        Kanji → Meaning
                      </div>
                      <div className="text-sm text-gray-400">
                        See kanji, guess the meaning
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setPracticeMode("meaningToKanji")}
                  className={`group relative overflow-hidden backdrop-blur-md border-2 p-6 rounded-2xl hover:cursor-pointer ${
                    practiceMode === "meaningToKanji"
                      ? "bg-gradient-to-br from-purple-600/30 to-purple-800/30 border-purple-400/50 shadow-lg shadow-purple-500/20"
                      : "bg-white/5 border-white/20 hover:border-purple-400/50 hover:bg-white/10"
                  }`}
                >
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div
                      className={`p-4 rounded-full ${
                        practiceMode === "meaningToKanji"
                          ? "bg-purple-500/20"
                          : "bg-white/10"
                      }`}
                    >
                      <Languages
                        className={`w-12 h-12 ${
                          practiceMode === "meaningToKanji"
                            ? "text-purple-400"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div>
                      <div
                        className={`font-bold text-lg mb-1 ${
                          practiceMode === "meaningToKanji"
                            ? "text-purple-200"
                            : "text-gray-300"
                        }`}
                      >
                        Meaning → Kanji
                      </div>
                      <div className="text-sm text-gray-400">
                        See meaning, guess the kanji
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              <button
                onClick={handleStartQuiz}
                disabled={!practiceMode}
                className="hover:cursor-pointer flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600/20 to-green-800/20 hover:from-green-500/30 hover:to-green-700/30 backdrop-blur-md border border-cyan-400/30 hover:border-cyan-300/50 text-cyan-200 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {practiceMode ? "Start Quiz" : "Select a Mode to Continue"}
              </button>
            </>
          )}

          <KanjiInstructions />

          {/* Loaded state */}
          {kanjiList.length > 0 && (
            <div className="space-y-4">
              <div className="text-center text-purple-200/80 bg-white/5 rounded-xl p-6 border border-white/10">
                <p className="text-base sm:text-lg font-semibold mb-2">
                  Loaded {kanjiList.length} kanji characters
                </p>
                <p className="text-sm sm:text-base text-purple-300/60">
                  Press Start Quiz to begin your practice!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Kanji;
