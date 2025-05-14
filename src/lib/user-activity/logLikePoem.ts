import { db } from "@/lib/firebase/firebase";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";

export const toggleLikePoem = async (userId: string, poemId: string) => {
  const ref = doc(db, "users", userId, "likes", poemId);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    // 이미 좋아요한 경우 삭제 (취소)
    await deleteDoc(ref);
    return false; // false = 좋아요 취소됨
  } else {
    // 좋아요 안 한 경우 → 추가
    await setDoc(ref, {
      liked: true,
      timestamp: serverTimestamp(),
    });
    return true; // true = 좋아요 추가됨
  }
};
