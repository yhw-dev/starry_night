// components/user-activity/LikeButton.tsx
"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/lib/firebase/auth"; // 로그인 정보 가져오는 커스텀 훅
import { Heart } from "lucide-react";

interface LikeButtonProps {
  poemId: string;
}

export default function LikeButton({ poemId }: LikeButtonProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    if (!user) return alert("로그인이 필요합니다.");

    await addDoc(collection(db, "user_logs"), {
      userId: user.uid,
      type: "like",
      poemId,
      timestamp: serverTimestamp(),
    });

    setLiked(true);
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
        liked ? "bg-blue-300 text-white" : "bg-white text-blue-500"
      } shadow-xl hover:scale-105`}
    >
      <Heart fill={liked ? "white" : "none"} className="w-5 h-5" />
      {liked ? "좋아요 완료" : "좋아요"}
    </button>
  );
}
