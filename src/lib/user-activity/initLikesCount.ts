import { collection, getDocs, getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

export const initializeLikesCount = async () => {
  const poemsRef = collection(db, "poems");
  const usersRef = collection(db, "users");

  const poemsSnap = await getDocs(poemsRef);
  const usersSnap = await getDocs(usersRef);

  for (const poemDoc of poemsSnap.docs) {
    const poemId = poemDoc.id;
    let likeCount = 0;

    for (const userDoc of usersSnap.docs) {
      const likeDocRef = doc(db, "users", userDoc.id, "likes", poemId);
      const likeDocSnap = await getDoc(likeDocRef);
      if (likeDocSnap.exists()) likeCount++;
    }

    await updateDoc(doc(db, "poems", poemId), { likesCount: likeCount });
    console.log(`✅ ${poemId} → likesCount = ${likeCount}`);
  }
};
