import { db } from "@/lib/firebase/firebase";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  updateDoc,
  increment,
} from "firebase/firestore";

export const logLikePoem = async (userId: string, poemId: string) => {
  const likeRef = doc(db, "users", userId, "likes", poemId);
  const snap = await getDoc(likeRef);
  const poemRef = doc(db, "poems", poemId);

  if (snap.exists()) {
    // 좋아요 취소
    await deleteDoc(likeRef);
    await updateDoc(poemRef, {
      likesCount: increment(-1),
    });
    return false;
  } else {
    // 좋아요 추가
    await setDoc(likeRef, {
      liked: true,
      timestamp: serverTimestamp(),
    });
    await updateDoc(poemRef, {
      likesCount: increment(1),
    });
    return true;
  }
};
