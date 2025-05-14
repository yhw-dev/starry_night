import { db } from "@/lib/firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const logSearch = async (userId: string, keyword: string) => {
  const ref = collection(db, "users", userId, "search_logs");
  await addDoc(ref, {
    keyword,
    timestamp: serverTimestamp(),
  });
};
