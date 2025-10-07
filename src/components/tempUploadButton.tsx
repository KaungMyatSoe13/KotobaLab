// Add to your main component or create UploadButton.tsx
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { Shin_Nihongo_no_Kiso_1 } from "../data/Shin_Nihongo_no_Kiso_1";

function UploadButton() {
  const handleUpload = async () => {
    console.log("Starting upload...");

    for (const lesson of Shin_Nihongo_no_Kiso_1) {
      try {
        await setDoc(doc(db, "Shin Nihongo No Kiso 1", `lesson${lesson.id}`), {
          id: lesson.id,
          title: lesson.title,
          vocabulary: lesson.vocabulary,
          createdAt: new Date().toISOString(),
        });
        console.log(`✓ Lesson ${lesson.id} uploaded`);
      } catch (error) {
        console.error(`✗ Lesson ${lesson.id} failed:`, error);
      }
    }

    alert("Upload complete! Check console.");
  };

  return (
    <button
      onClick={handleUpload}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Upload to Firebase (Click Once)
    </button>
  );
}

export default UploadButton;
