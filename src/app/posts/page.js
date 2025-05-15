"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import SearchBar from "@/components/user-activity/SearchBar";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useAuth } from "@/lib/firebase/auth"; // ✅ 추가

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // ✅ 추가

  const handleSearch = (keyword) => {
    console.log("검색 키워드:", keyword);
  };

  useEffect(() => {
    axios
      .get("/api/posts")
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="flex flex-col items-center py-10">
      <h1 className="text-2xl font-bold mb-4 text-white">게시글 목록</h1>

      <div className="w-full max-w-md mb-6 px-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* ✅ 로그인된 사용자만 시 쓰기 버튼 보이게 하기 */}
      {user && (
        <Link href="/posts/write" className="mb-6">
          <Button variant="primary">시 쓰기</Button>
        </Link>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
        {posts.map((post) => (
          <Link key={post.id} href={`/posts/${post.id}`} className="block">
            <Card className="w-full">
              <h2 className="text-black text-xl font-bold">{post.title}</h2>
              <span className="text-gray-500 text-sm">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
