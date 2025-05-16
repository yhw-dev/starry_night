"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { Search } from "lucide-react";

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  likes?: number;
}

export default function SearchResultClient() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const url =
      keyword.trim() === ""
        ? "/api/posts" // ✅ keyword 없으면 전체 글 API
        : `/api/search?keyword=${encodeURIComponent(keyword)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("글 불러오기 오류:", error);
        setLoading(false);
      });
  }, [keyword]);

  return (
    <div className="px-6 py-10 text-white flex flex-col items-center min-h-[60vh]">
      <div className="w-full max-w-4xl flex flex-col items-center text-center">
        {keyword && (
          <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2 justify-center">
            <Search className="w-6 h-6 text-white" />
            “{keyword}” 검색 결과
          </h1>
        )}

        {loading ? (
          <p className="text-gray-300">불러오는 중...</p>
        ) : results.length === 0 ? (
          <p className="text-gray-400">“{keyword}”에 대한 결과가 없습니다.</p>
        ) : (
          <div className="w-full flex justify-center">
            <div className="flex flex-wrap justify-center gap-6 max-w-4xl">
              {results.map((post) => (
                <Link key={post.id} href={`/posts/${post.id}`}>
                  <Card className="w-72 hover:bg-white/20 bg-white/10 transition text-white">
                    <h2 className="text-white text-xl font-bold">{post.title}</h2>
                    <p className="text-white/80 text-sm mt-1">
                      {post.content.length > 80
                        ? post.content.slice(0, 80) + "..."
                        : post.content}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
