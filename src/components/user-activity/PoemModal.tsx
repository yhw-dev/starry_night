// components/user-activity/PoemModal.tsx
"use client";

import { useEffect } from "react";
import { db } from "@/lib/firebase/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/lib/firebase/auth";

interface PoemModalProps {
  poemId: string;
  title: string;
  content: string;
  onClose: () => void;
}

export default function PoemModal({ poemId, title, content, onClose }: PoemModalProps) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const logRead = async () => {
      await addDoc(collection(db, "user_logs"), {
        userId: user.uid,
        type: "read",
        poemId,
        timestamp: serverTimestamp(),
      });
    };
    logRead();
  }, [user, poemId]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl text-blue-900">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <p className="whitespace-pre-wrap leading-relaxed mb-6">{content}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
