"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import Card from "@/components/ui/Card";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function PostDetailPage({ params }) {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const resolvedParams = use(params);
  const { user } = useAuth();
  const [authorName, setAuthorName] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/posts/${resolvedParams.id}`);
        setPost(res.data);
        setLikes(res.data.likes);
        setLoading(false);

        // ✅ 사용자 좋아요 여부 확인
        if (user) {
          const res2 = await axios.post(`/api/posts/${resolvedParams.id}/like`, {
            userId: user.uid,
          });
          setLiked(res2.data.liked); // ✅ 초기화
          setLikes(res2.data.likes); // 동기화
        }
      } catch (error) {
        console.error("게시글 로드 오류:", error);
        setLoading(false);
        alert("게시글을 불러올 수 없습니다.");
        router.push("/posts");
      }
    };

    fetchPost();
  }, [resolvedParams.id, router, user]);

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
  }, [post?.authorId]);

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
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const optimisticLiked = !liked;
    setLiked(optimisticLiked);
    setLikes((prev) => prev + (optimisticLiked ? 1 : -1));

    try {
      const res = await axios.post(`/api/posts/${resolvedParams.id}/like`, {
        userId: user.uid,
      });
      setLiked(res.data.liked);
      setLikes(res.data.likes);
    } catch (error) {
      console.error("좋아요 오류:", error);
      setLiked((prev) => !prev);
      setLikes((prev) => prev - (optimisticLiked ? 1 : -1));
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  const isAuthor = user && post?.authorId === user.uid;

  if (loading) return <LoadingScreen message="찾아가는 중이에요" />;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-16 px-4 text-white">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4 drop-shadow-lg animate-fade-in">
          {post.title}
        </h1>
        <p className="text-sm text-gray-300 mb-1">
          ✏️ {authorName || "..."}
        </p>
        <p className="text-sm text-gray-300 mb-6">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>

        <Card likes={likes} className="mb-8 max-w-lg mx-auto">
          <p className="text-lg leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </Card>

        <div className="mt-6 flex justify-center items-center gap-4">
          <Button
            onClick={handleLike}
            variant={liked ? "secondary" : "primary"}
            className="py-2 px-4 rounded-xxl shadow"
          >
            {liked ? "🩵 좋아요" : "🤍 좋아요"} {likes}
          </Button>
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
