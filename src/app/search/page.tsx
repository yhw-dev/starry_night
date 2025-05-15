"use client";

import { useRouter } from "next/navigation";
import { Suspense } from "react";
import SearchResultClient from "./SearchResultClient";
import SearchBar from "@/components/user-activity/SearchBar";

export default function SearchPage() {
  const router = useRouter();

  const handleSearch = (keyword: string) => {
    if (!keyword) return;
    console.log("✅ 검색 URL 이동:", keyword);
    router.push(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="px-6 py-10 text-white">
      <div className="w-full max-w-md mb-6 px-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      <Suspense fallback={<div className="text-white">검색 중...</div>}>
        <SearchResultClient />
      </Suspense>
    </div>
  );
}
