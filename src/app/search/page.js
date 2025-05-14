"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { Search } from "lucide-react"; //돋보기 기호

export default function SearchResultPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!keyword) return;

    fetch(`/api/search?keyword=${encodeURIComponent(keyword)}`)
      .then((res) => res.json())
      .then(setResults)
      .catch(console.error);
  }, [keyword]);

  return (
    <div className="px-6 py-10 text-white">
      <h1 className="text-2xl font-semibold mb-6">
        <Suspense fallback={<div>로딩 중...</div>}>
         <Search className="w-6 h-6 text-white" /> “{keyword}” 검색 결과
        </Suspense>
      </h1>

      {results.length === 0 ? (
        <p>결과가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((post) => (
            <Link key={post.id} href={`/posts/${post.id}`}>
              <Card className="w-full">
                <h2 className="text-black text-xl font-bold">{post.title}</h2>
                <p className="text-gray-600">{post.content}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
