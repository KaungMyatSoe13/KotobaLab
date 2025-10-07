import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { Shin_Nihongo_no_Kiso_1 } from "../data/Shin_Nihongo_no_Kiso_1";

async function uploadLessons() {
  console.log("Starting upload to Firestore...");

  const bookName = "Shin Nihongo No Kiso 1";

  try {
    // Get details from the data
    const detailsData = Shin_Nihongo_no_Kiso_1.find((item) => item.details);

    // Upload details document
    if (detailsData && detailsData.details) {
      await setDoc(doc(db, "books", bookName, "data", "details"), {
        name: detailsData.details.name,
        image: detailsData.details.image,
        totalLessons: Shin_Nihongo_no_Kiso_1.filter((item) => item.id).length,
        createdAt: new Date().toISOString(),
      });
      console.log(`✓ Uploaded details for "${bookName}"`);
    }

    // Upload all lessons as separate documents
    for (const lesson of Shin_Nihongo_no_Kiso_1) {
      if (lesson.id && lesson.title && lesson.vocabulary) {
        try {
          await setDoc(
            doc(db, "books", bookName, "data", `lesson${lesson.id}`),
            {
              id: lesson.id,
              title: lesson.title,
              vocabulary: lesson.vocabulary,
              vocabularyCount: lesson.vocabulary.length,
              createdAt: new Date().toISOString(),
            }
          );

          console.log(
            `✓ Uploaded ${lesson.title} (${lesson.vocabulary.length} words)`
          );
        } catch (error) {
          console.error(`✗ Failed to upload ${lesson.title}:`, error);
        }
      }
    }

    console.log("\n✅ Upload complete! Check Firebase Console.");
    console.log(`Path: books/${bookName}/data/`);
  } catch (error) {
    console.error("❌ Upload failed:", error);
  }
}

uploadLessons();
