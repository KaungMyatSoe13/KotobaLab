// src/services/fileHandler.ts
import * as XLSX from "xlsx";
import type { VocabItem } from "../utils/types";

// Existing vocab functions...
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

// ============ NEW KANJI FUNCTIONS ============

export interface KanjiItem {
  kanji: string;
  japanese: string;
  chinese: string;
  example: string;
}

export const downloadKanjiTemplate = (): void => {
  const template = [
    {
      kanji: "一",
      japanese: "Hito.tsu",
      chinese: "ichi/itsu",
      example: "一つ(hitotsu)",
    },
    {
      kanji: "二",
      japanese: "Futa.tsu",
      chinese: "ni",
      example: "二つ(futatsu)",
    },
    {
      kanji: "三",
      japanese: "Mi.ttsu",
      chinese: "san",
      example: "三つ(mittsu)",
    },
    {
      kanji: "四",
      japanese: "Yo.ttsu",
      chinese: "shi/yon",
      example: "四つ(yottsu)",
    },
    {
      kanji: "五",
      japanese: "Itsu.tsu",
      chinese: "go",
      example: "五つ(itsutsu)",
    },
  ];
  const ws = XLSX.utils.json_to_sheet(template);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Kanji");
  XLSX.writeFile(wb, "kanji_template.xlsx");
};

export const parseKanjiExcelFile = (
  file: File,
  onSuccess: (kanji: KanjiItem[]) => void,
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

      const kanji: KanjiItem[] = json.map((row: any) => ({
        kanji: row.kanji || row.Kanji || "",
        japanese: row.japanese || row.Japanese || "",
        chinese: row.chinese || row.Chinese || "",
        example: row.example || row.Example || "",
      }));

      onSuccess(kanji);
    } catch (error) {
      onError();
    }
  };

  reader.readAsArrayBuffer(file);
};
