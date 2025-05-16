"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import SearchResultClient from "./SearchResultClient";
import SearchBar from "@/components/user-activity/SearchBar";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawKeyword = searchParams.get("keyword") || "";
  const [keyword, setKeyword] = useState(rawKeyword);

  // URL의 쿼리 변경 감지 시 keyword 갱신
  useEffect(() => {
    setKeyword(rawKeyword);
  }, [rawKeyword]);

  const handleSearch = (newKeyword: string) => {
    const trimmed = newKeyword.trim();
    if (!trimmed) {
      router.push("/search"); // 🔁 keyword 제거 → 전체 글 목록 보기
    } else {
      router.push(`/search?keyword=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start px-6 py-10 min-h-screen">
      {/* 🔍 검색창 */}
      <div className="w-full max-w-xl mb-10">
        <SearchBar
          onSearch={handleSearch}
          initialKeyword={keyword}
        />
      </div>

      {/* 📜 검색 결과 */}
      <Suspense fallback={<div className="text-white">불러오는 중...</div>}>
        <SearchResultClient />
      </Suspense>
    </div>
  );
}
