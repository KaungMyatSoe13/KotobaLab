// src/components/FileUpload.tsx
import React from "react";
import { Upload, Download } from "lucide-react";

interface FileUploadProps {
  fileName: string;
  isLoading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadTemplate: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  fileName,
  isLoading,
  onFileChange,
  onDownloadTemplate,
}) => {
  return (
    <div className="mb-6 sm:mb-8">
      <label className="group flex flex-col items-center justify-center w-full h-32 sm:h-36 border-2 border-dashed border-gray-500/30 rounded-2xl cursor-pointer hover:border-purple-400/50 hover:bg-white/5 transition-all duration-300">
        <div className="flex flex-col items-center justify-center pt-3 pb-3 sm:pt-5 sm:pb-6">
          <div className="bg-gradient-to-br from-cyan-500 to-gray-600 p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <p className="text-sm sm:text-base text-gray-200/80 px-2 text-center font-medium">
            {isLoading
              ? "Loading file..."
              : fileName || "Upload Excel file (.xlsx, .xls)"}
          </p>
          {fileName && !isLoading && (
            <p className="text-xs text-gray-300/50 mt-1">
              Click to change file
            </p>
          )}
        </div>
        <input
          type="file"
          className="hidden"
          accept=".xlsx,.xls"
          onChange={onFileChange}
          disabled={isLoading}
        />
      </label>

      <div className="mt-4 text-center">
        <button
          onClick={onDownloadTemplate}
          className="hover:cursor-pointer inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download Template Excel
        </button>
      </div>
    </div>
  );
};
