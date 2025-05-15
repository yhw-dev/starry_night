"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/firebase/auth"; // ✅ 추가: 로그인 유저 정보
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase"; // ✅ 이미 있을 수도 있어

export default function PostDetailPage({ params }) {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const resolvedParams = use(params);
  const { user } = useAuth(); // ✅ 로그인 유저 정보
  const [authorName, setAuthorName] = useState(null); // 🔼 useState는 상단에!

  useEffect(() => {
    const fetchAuthorName = async () => {
      if (post?.authorId) {
        try {
          const ref = doc(db, "users", post.authorId);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            setAuthorName(snap.data().displayName || "익명");
          } else {
            setAuthorName("탈퇴한 사용자");
          }
        } catch (e) {
          console.error("작성자 이름 불러오기 실패:", e);
          setAuthorName("알 수 없음");
        }
      }
    };

    fetchAuthorName();
  }, [post?.authorId]); // 🔁 post가 준비된 이후에 실행됨

  useEffect(() => {
    axios
      .get(`/api/posts/${resolvedParams.id}`)
      .then((res) => {
        setPost(res.data);
        setLikes(res.data.likes);
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
      const res = await axios.delete(`/api/posts/${resolvedParams.id}`, {
        data: { authorId: user.uid },
      });
      if (res.status === 200) {
        router.push("/posts");
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (error) {
      alert("오류가 발생했습니다.");
    }
  };

  const handleLike = async () => {
    try {
      const res = await axios.post(`/api/posts/${resolvedParams.id}/like`);
      setLikes(res.data.likes);
    } catch (error) {
      console.error("좋아요 오류:", error);
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  const isAuthor = user && post?.authorId === user.uid; // ✅ 본인 글인지 확인

  if (loading) return <div>로딩 중...</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-16 px-4 text-white">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4 drop-shadow-lg animate-fade-in">
          {post.title}
        </h1>
        <p className="text-sm text-gray-300 mb-6">
          {authorName || "..."}<br/>
        </p>
        <p className="text-sm text-gray-300 mb-6">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 shadow-md max-w-lg mx-auto">
          <p className="text-lg leading-relaxed text-gray-100 whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        <div className="mt-6 flex justify-center items-center gap-4">
          <button
            onClick={handleLike}
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-xl shadow transition"
          >
            ❤️ 좋아요 {likes}
          </button>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <Link href="/posts">
            <Button variant="primary">목록</Button>
          </Link>

          {isAuthor && (
            <>
              <Link href={`/posts/${resolvedParams.id}/edit`}>
                <Button variant="primary">수정</Button>
              </Link>
              <Button onClick={handleDelete} variant="secondary">
                삭제
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
