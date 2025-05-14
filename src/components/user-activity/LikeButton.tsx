"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@/lib/firebase/auth";
import { checkLikedPoem, logLikePoem } from "@/lib/user-activity";

interface LikeButtonProps {
  poemId: string;
}

export default function LikeButton({ poemId }: LikeButtonProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (user) {
        const result = await checkLikedPoem(user.uid, poemId);
        setLiked(result);
      }
      setLoading(false);
    };
    fetch();
  }, [user, poemId]);

  const handleClick = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    setAnimating(true);
    const result = await logLikePoem(user.uid, poemId);
    setLiked(result);
    setTimeout(() => setAnimating(false), 300);
  };

  if (loading) return null;

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition transform
        ${liked
          ? "bg-blue-500 text-white animate-glow scale-105"
          : "bg-white text-blue-500 hover:bg-blue-100 hover:shadow-md"}
        ${animating ? "scale-110" : ""}`}
      style={{
        boxShadow: liked
          ? "0 0 12px rgba(99, 179, 237, 0.6), 0 0 24px rgba(99, 179, 237, 0.4)"
          : undefined,
      }}
    >
      <Heart
        className="w-5 h-5 transition"
        fill={liked ? "white" : "none"}
        stroke="currentColor"
      />
      {liked ? "좋아요됨" : "좋아요"}
    </button>
  );
}
