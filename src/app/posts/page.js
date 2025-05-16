"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

import Button from "@/components/ui/Button";
import SearchBar from "@/components/user-activity/SearchBar";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [authorNames, setAuthorNames] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const handleSearch = (keyword) => {
    if (!keyword) return;
    router.push(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  const fetchAuthorNames = async (posts) => {
    const namesMap = {};
    for (const post of posts) {
      if (post.authorId && !namesMap[post.authorId]) {
        try {
          const userRef = doc(db, "users", post.authorId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            namesMap[post.authorId] = userSnap.data().displayName || "익명";
          } else {
            namesMap[post.authorId] = "탈퇴한 사용자";
          }
        } catch (e) {
          console.error("작성자 이름 불러오기 실패:", e);
          namesMap[post.authorId] = "알 수 없음";
        }
      }
    }
    setAuthorNames(namesMap);
  };

  useEffect(() => {
    axios
      .get("/api/posts")
      .then(async (res) => {
        const postsData = res.data;
        setPosts(postsData);
        await fetchAuthorNames(postsData);
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

      {user && (
        <Link href="/posts/write" className="mb-6">
          <Button variant="primary">시 쓰기</Button>
        </Link>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="
              relative
              bg-white/10
              backdrop-blur-md
              rounded-xl
              p-4
              text-white
              shadow-md
              transition-colors
              duration-300
              hover:bg-white
              hover:text-black
              hover:animate-glowFade
            "
          >
            <Link href={`/posts/${post.id}`}>
              <h2 className="text-inherit text-xl font-bold">{post.title}</h2>
              <p className="text-sm text-inherit mb-1">
                {authorNames[post.authorId] || "..."}
              </p>
              <span className="text-inherit text-sm">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </Link>
            {typeof post.likes === "number" && (
              <div className="absolute bottom-2 right-4 flex items-center gap-1 text-pink-300 text-sm">
                <HeartSolid className="w-5 h-5 fill-red-500" />
                {post.likes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
