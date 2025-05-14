import { db } from "@/lib/firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const logReadPoem = async (userId: string, poemId: string) => {
  const ref = collection(db, "users", userId, "read_logs");
  await addDoc(ref, {
    poemId,
    timestamp: serverTimestamp(),
  });
};
