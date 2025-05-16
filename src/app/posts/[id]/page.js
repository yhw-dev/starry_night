"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/firebase/auth"; // ✅ 추가: 로그인 유저 정보
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase"; // ✅ 이미 있을 수도 있어
import Card from "@/components/ui/Card";

export default function PostDetailPage({ params }) {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const resolvedParams = use(params);
  const { user } = useAuth(); // ✅ 로그인 유저 정보
  const [authorName, setAuthorName] = useState(null); // 🔼 useState는 상단에!
  const [newComment, setNewComment] = useState(""); // 입력된 댓글 내용
  const [comments, setComments] = useState([]);     // 댓글 목록

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
  if (!user) {
    alert("로그인이 필요합니다.");
    console.warn("❌ 좋아요 실패: 로그인된 유저가 없음");
    return;
  }

  // ✅ Optimistic UI 처리
  const optimisticLiked = !liked;
  setLiked(optimisticLiked);
  setLikes((prev) => prev + (optimisticLiked ? 1 : -1));

  try {
    const res = await axios.post(`/api/posts/${resolvedParams.id}/like`, {
      userId: user.uid,
    });

    // ✅ 서버 응답과 실제 동기화
    setLiked(res.data.liked);
    setLikes(res.data.likes);
  } catch (error) {
    console.error("좋아요 오류:", error);

    // ⛔ 실패 시 롤백
    setLiked((prev) => !prev);
    setLikes((prev) => prev - (optimisticLiked ? 1 : -1));

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
            {authorName || "..."}
            <br />
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
            <button
                onClick={handleLike}
                className={`${
                    liked
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-gray-600 hover:bg-gray-700"
                } text-white font-semibold py-2 px-4 rounded-xl shadow transition`}
            >
              {liked ? "❤️ 좋아요" : "🤍 좋아요"} {likes}
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
          <div className="mt-12 max-w-xl mx-auto w-full">
            <h2 className="text-xl font-semibold mb-4">댓글</h2>

            {/* 댓글 입력창 */}
            <div className="flex gap-2 items-center mb-6">
              <input
                  type="text"
                  className="flex-1 px-4 py-2 rounded-lg text-white bg-white/10 backdrop-blur-sm placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="댓글을 남겨보세요"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                  onClick={() => alert("나중에 구현됩니다")}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow"
              >
                등록
              </button>
            </div>


            {/* 댓글 목록 */}
            <ul className="space-y-4">
              {comments.length === 0 ? (
                  <li className="text-gray-400">아직 댓글이 없습니다.</li>
              ) : (
                  comments.map((comment, idx) => (
                      <li key={idx} className="bg-white/5 backdrop-blur-md rounded-xl p-4 shadow-md border border-white/10 transition hover:scale-[1.01]">
                        <p className="text-sm text-blue-200 font-semibold">{comment.displayName || "익명"}</p>
                        <p className="text-white text-base mt-1 whitespace-pre-line">{comment.content}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {comment.createdAt || "방금 전"}
                        </p>
                      </li>

                  ))
              )}
            </ul>
          </div>
        </div>
      </div>
  );
}

