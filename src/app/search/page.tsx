"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import SearchResultClient from "./SearchResultClient";
import SearchBar from "@/components/user-activity/SearchBar";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawKeyword = searchParams.get("keyword");
  const [keyword, setKeyword] = useState(rawKeyword || "");

  // 검색 파라미터 변경될 때마다 상태도 업데이트
  useEffect(() => {
    setKeyword(rawKeyword || "");
  }, [rawKeyword]);

  // 검색 실행
  const handleSearch = (newKeyword: string) => {
    const trimmed = newKeyword.trim();
    if (trimmed === "") {
      router.push("/search"); // ✅ 비어있을 경우 keyword 파라미터 제거
    } else {
      router.push(`/search?keyword=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start px-6 py-10 min-h-screen">
      <div className="w-full max-w-xl mb-10">
        <SearchBar
          onSearch={handleSearch}
          initialKeyword={keyword}
          onEmpty={() => router.push("/search")} // ✅ 비워지면 초기화
        />
      </div>

      {keyword.trim() !== "" && (
        <Suspense fallback={<div className="text-white">검색 중...</div>}>
          <SearchResultClient />
        </Suspense>
      )}
    </div>
  );
}
