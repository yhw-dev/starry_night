"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 페이지 이동을 위한 라우터
import axios from "axios";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function PostsPage() {
  const router = useRouter(); // 라우터 객체
  const [posts, setPosts] = useState([]); // 게시글 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    // axios.get().then().catch()으로 비동기 처리
    axios
      .get("/api/posts") // 브라우저에서 /api/posts로 GET 요청을 보냅니다
      .then((res) => {
        setPosts(res.data); // 데이터를 상태에 저장
        setLoading(false); // 로딩 시 false로 변경
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    // 삭제를 취소하면 함수 종료
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await axios.delete(`/api/posts/${id}`); // 브라우저에서 /api/posts/1로 DELETE 요청을 보냅니다
      // 서버에서 응답이 오면
      if (res.status === 200) {
        setPosts(posts.filter((post) => post.id !== id)); // 삭제된 게시글 제외
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (error) {
      alert("오류가 발생했습니다.");
    }
  };

  // 상세 페이지로 이동하는 함수
  const handlePostClick = (id) => {
    router.push(`/posts/${id}`);
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="flex flex-col items-center py-10">
      <h1 className="text-2xl font-bold mb-4">게시글 목록</h1>
      <Link href="/posts/write" className="mb-6">
        <Button variant="primary">글쓰기</Button>
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
        {posts.map((post) => (
          <Link key={post.id} href={`/posts/${post.id}`} className="block">
            <Card className="w-full">
              <h2 className="text-black text-xl font-bold">{post.title}</h2>
              <p className="text-gray-600">{post.content}</p>
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
