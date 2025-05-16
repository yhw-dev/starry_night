"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import SearchBar from "@/components/user-activity/SearchBar";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorNames, setAuthorNames] = useState({});
  const { user } = useAuth();

  const handleSearch = (keyword) => {
    if (!keyword) return;
    router.push(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  useEffect(() => {
    axios
      .get("/api/posts")
      .then(async (res) => {
        const postsData = res.data;
        setPosts(postsData);
        setLoading(false);

        // 작성자 이름 가져오기
        const nameMap = {};
        for (const post of postsData) {
          const uid = post.authorId;
          if (!uid || nameMap[uid]) continue;

          try {
            const snap = await getDoc(doc(db, "users", uid));
            if (snap.exists()) {
              nameMap[uid] = snap.data().displayName || "익명";
            } else {
              nameMap[uid] = "탈퇴한 사용자";
            }
          } catch (err) {
            console.error("작성자 이름 로드 실패:", err);
            nameMap[uid] = "알 수 없음";
          }
        }
        setAuthorNames(nameMap);
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

              <div className="flex justify-between items-center mt-1">
                <span className="text-gray-500 text-sm">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
                <span className="text-pink-600 text-sm font-semibold">
                  ❤️ {post.likes}
                </span>
              </div>

              <div className="text-gray-600 text-sm mt-1">
                ✏️ {authorNames[post.authorId] || "불러오는 중..."}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
