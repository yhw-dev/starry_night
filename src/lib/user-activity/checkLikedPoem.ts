import { db } from "@/lib/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export const checkLikedPoem = async (userId: string, poemId: string): Promise<boolean> => {
  const ref = doc(db, "users", userId, "likes", poemId);
  const snap = await getDoc(ref);
  return snap.exists();
};
