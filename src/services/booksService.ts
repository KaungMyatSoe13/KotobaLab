import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import type { VocabItem } from "../utils/types";

export interface Book {
  id: string;
  name: string;
  image: string;
  totalLessons?: number;
}

export interface Lesson {
  id: number;
  title: string;
  vocabularyCount: number;
}

export interface BookDetails {
  name: string;
  image: string;
}

/**
 * List of all book collections in Firestore
 * Add new book collection names here when you create them
 */
export const BOOK_COLLECTIONS = [
  "Shin Nihongo No Kiso 1",
  // Add more book collection names here
];

/**
 * Fetch all books from Firestore
 */
export const fetchAllBooks = async (): Promise<Book[]> => {
  const booksData: Book[] = [];

  for (const collectionName of BOOK_COLLECTIONS) {
    try {
      // Get the details document from the collection
      const detailsDocRef = doc(db, collectionName, "details");
      const detailsDoc = await getDoc(detailsDocRef);

      if (detailsDoc.exists()) {
        const data = detailsDoc.data();

        // Count lessons (get all documents except details)
        const collectionRef = collection(db, collectionName);
        const collectionSnapshot = await getDocs(collectionRef);
        const lessonCount = collectionSnapshot.docs.filter(
          (doc) => doc.id !== "details"
        ).length;

        booksData.push({
          id: collectionName,
          name: data.name || collectionName,
          image: data.image || "",
          totalLessons: lessonCount,
        });
      }
    } catch (err) {
      console.error(`Error fetching ${collectionName}:`, err);
    }
  }

  return booksData;
};

/**
 * Fetch book details and lessons
 */
export const fetchBookDetails = async (
  bookName: string
): Promise<{ details: BookDetails | null; lessons: Lesson[] }> => {
  let details: BookDetails | null = null;
  const lessons: Lesson[] = [];

  try {
    // Get book details
    const detailsDocRef = doc(db, bookName, "details");
    const detailsDoc = await getDoc(detailsDocRef);

    if (detailsDoc.exists()) {
      const data = detailsDoc.data();
      details = {
        name: data.name || bookName,
        image: data.image || "",
      };
    }

    // Get all lessons from the collection
    const collectionRef = collection(db, bookName);
    const collectionSnapshot = await getDocs(collectionRef);

    collectionSnapshot.forEach((docSnapshot) => {
      // Skip the details document
      if (docSnapshot.id !== "details") {
        const lessonData = docSnapshot.data();
        lessons.push({
          id: lessonData.id,
          title: lessonData.title,
          vocabularyCount:
            lessonData.vocabularyCount || lessonData.vocabulary?.length || 0,
        });
      }
    });

    // Sort lessons by id
    lessons.sort((a, b) => a.id - b.id);
  } catch (err) {
    console.error("Error fetching book data:", err);
    throw err;
  }

  return { details, lessons };
};

/**
 * Fetch vocabulary from selected lessons
 */
export const fetchLessonsVocabulary = async (
  bookName: string,
  lessonIds: number[]
): Promise<VocabItem[]> => {
  const allVocab: VocabItem[] = [];

  try {
    // Fetch each selected lesson
    for (const lessonId of lessonIds) {
      const lessonDocRef = doc(db, bookName, `lesson${lessonId}`);
      const lessonDoc = await getDoc(lessonDocRef);

      if (lessonDoc.exists()) {
        const data = lessonDoc.data();
        if (data.vocabulary && Array.isArray(data.vocabulary)) {
          allVocab.push(...data.vocabulary);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching lessons vocabulary:", error);
    throw error;
  }

  return allVocab;
};
