// components/user-activity/SearchBar.tsx
"use client";

import { useState } from "react";
import { db } from "@/lib/firebase/firebase.js";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/lib/firebase/auth";
import { Search } from "lucide-react"; //돋보기 기호

interface SearchBarProps {
  onSearch: (keyword: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [input, setInput] = useState("");
  const { user } = useAuth();

  const handleSearch = async () => {
    if (!input.trim() || !user) return;

    await addDoc(collection(db, "user_logs"), {
      userId: user.uid,
      type: "search",
      keyword: input.trim(),
      timestamp: serverTimestamp(),
    });

    onSearch(input.trim());
    setInput("");
  };

  return (
    <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="시를 찾아보세요..."
        className="bg-transparent text-white placeholder-white/70 outline-none w-full"
      />
      <button
        onClick={handleSearch}
        aria-label="검색"
        className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition"
      >
        <Search className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
