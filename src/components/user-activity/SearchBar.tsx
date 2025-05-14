"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/firebase.js";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { useAuth } from "@/lib/firebase/auth";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (keyword: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [input, setInput] = useState("");
  const [recentKeywords, setRecentKeywords] = useState<string[]>([]);
  const { user } = useAuth();
  const RECENT_KEY = "recent_search_keywords";

  // 🔄 Load keywords from localStorage or Firestore
  useEffect(() => {
    const loadKeywords = async () => {
      if (user) {
        const docSnap = await getDoc(doc(db, "recent_keywords", user.uid));
        if (docSnap.exists()) {
          setRecentKeywords(docSnap.data().keywords || []);
        }
      } else {
        const stored = localStorage.getItem(RECENT_KEY);
        if (stored) setRecentKeywords(JSON.parse(stored));
      }
    };
    loadKeywords();
  }, [user]);

  const saveKeyword = async (keyword: string) => {
    let updated = [keyword, ...recentKeywords.filter(k => k !== keyword)];
    if (updated.length > 5) updated = updated.slice(0, 5);
    setRecentKeywords(updated);

    if (user) {
      await setDoc(doc(db, "recent_keywords", user.uid), {
        keywords: updated,
        updatedAt: serverTimestamp(),
      });
    } else {
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    }
  };

  const deleteKeyword = async (target: string) => {
    const updated = recentKeywords.filter(k => k !== target);
    setRecentKeywords(updated);

    if (user) {
      await setDoc(doc(db, "recent_keywords", user.uid), {
        keywords: updated,
        updatedAt: serverTimestamp(),
      });
    } else {
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    }
  };

  const handleSearch = async () => {
    const keyword = input.trim();
    if (!keyword) return;

    if (user) {
      await addDoc(collection(db, "user_logs"), {
        userId: user.uid,
        type: "search",
        keyword,
        timestamp: serverTimestamp(),
      });
    }

    await saveKeyword(keyword);
    onSearch(keyword);
    setInput("");
  };

  return (
    <div className="flex flex-col gap-2 bg-white/30 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-md">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="시를 찾아보세요..."
          className="bg-transparent text-white placeholder-white/70 outline-none w-full"
        />
        <button
          onClick={handleSearch}
          aria-label="검색"
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
        >
          <Search className="w-5 h-5 text-white" />
        </button>
      </div>

      {recentKeywords.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {recentKeywords.map((word, idx) => (
            <div
              key={idx}
              className="flex items-center px-3 py-1 text-sm rounded-full bg-white/20 text-white"
            >
              <button
                onClick={() => {
                  setInput(word);
                  onSearch(word);
                }}
              >
                {word}
              </button>
              <button onClick={() => deleteKeyword(word)} className="ml-2">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
