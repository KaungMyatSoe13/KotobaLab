// src/fileHandler.ts
import * as XLSX from "xlsx";
import type { VocabItem } from "./types";

export const downloadTemplate = (): void => {
  const template = [
    {
      Pronunciation: "konnichiwa",
      "Japanese Writing": "こんにちは",
      Meaning: "Hello",
    },
    {
      Pronunciation: "arigatou",
      "Japanese Writing": "ありがとう",
      Meaning: "Thank you",
    },
    {
      Pronunciation: "sayounara",
      "Japanese Writing": "さようなら",
      Meaning: "Goodbye",
    },
  ];
  const ws = XLSX.utils.json_to_sheet(template);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Vocabulary");
  XLSX.writeFile(wb, "vocabulary_template.xlsx");
};

export const parseExcelFile = (
  file: File,
  onSuccess: (vocab: VocabItem[]) => void,
  onError: () => void
): void => {
  const reader = new FileReader();

  reader.onload = (event: ProgressEvent<FileReader>) => {
    try {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      const vocab: VocabItem[] = json.map((row: any) => ({
        pronunciation: row.Pronunciation || row.pronunciation || "",
        japanese: row["Japanese Writing"] || row.japanese || row.Japanese || "",
        meaning: row.Meaning || row.meaning || "",
      }));

      onSuccess(vocab);
    } catch (error) {
      onError();
    }
  };

  reader.readAsArrayBuffer(file);
};
