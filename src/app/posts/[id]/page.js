"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Button from "@/components/ui/Button";

export default function PostDetailPage({ params }) {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const resolvedParams = use(params); // params 객체를 풀어서 사용

  useEffect(() => {
    axios
      .get(`/api/posts/${resolvedParams.id}`)
      .then((res) => {
        setPost(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
        alert("게시글을 불러올 수 없습니다.");
        router.push("/posts");
      });
  }, [resolvedParams.id, router]);

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await axios.delete(`/api/posts/${resolvedParams.id}`);
      if (res.status === 200) {
        router.push("/posts");
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (error) {
      alert("오류가 발생했습니다.");
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-16 px-4 text-white">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4 drop-shadow-lg animate-fade-in">
          {post.title}
        </h1>
        <p className="text-sm text-gray-300 mb-6">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 shadow-md max-w-lg mx-auto">
          <p className="text-lg leading-relaxed text-gray-100 whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Link
            href="/posts"
          >
            <Button variant="primary">목록</Button>
          </Link>
          <Link
            href={`/posts/${resolvedParams.id}/edit`}
          >
            <Button variant="primary">수정</Button>
          </Link>
          <Button onClick={handleDelete} variant="secondary">삭제</Button>
        </div>
      </div>
    </div>
  );
}