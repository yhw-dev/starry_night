"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { Search } from "lucide-react";

interface Post {
  id: number;
  title: string;
  content: string;
}

export default function SearchResultClient() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!keyword) return;

    setLoading(true);

    fetch(`/api/search?keyword=${encodeURIComponent(keyword)}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("검색 오류:", error);
        setLoading(false);
      });
  }, [keyword]);

  return (
    <div className="px-6 py-10 text-white">
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <Search className="w-6 h-6 text-white" />
        “{keyword}” 검색 결과
      </h1>

      {loading ? (
        <p className="text-gray-300">검색 중...</p>
      ) : results.length === 0 ? (
        <p className="text-gray-400">“{keyword}”에 대한 결과가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((post) => (
            <Link key={post.id} href={`/posts/${post.id}`}>
              <Card className="w-full hover:bg-white/90 transition">
                <h2 className="text-black text-xl font-bold">{post.title}</h2>
                <p className="text-gray-700 text-sm mt-1">
                  {post.content.length > 80
                    ? post.content.slice(0, 80) + "..."
                    : post.content}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
