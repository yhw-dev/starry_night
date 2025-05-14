import { Suspense } from "react";
import SearchResultClient from "./SearchResultClient";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="px-6 py-10 text-white">검색 중...</div>}>
      <SearchResultClient />
    </Suspense>
  );
}
