"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/firebase/auth";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  setDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import Card from "@/components/ui/Card";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export default function PostDetailPage({ params }) {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const resolvedParams = use(params);
  const { user } = useAuth();
  const [authorName, setAuthorName] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

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
          setAuthorName("알 수 없음");
        }
      }
    };

    fetchAuthorName();
  }, [post?.authorId]);

  useEffect(() => {
    axios
        .get(`/api/posts/${resolvedParams.id}`)
        .then((res) => {
          setPost(res.data);
          setLikes(res.data.likes);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          router.push("/posts");
        });
  }, [resolvedParams.id, router]);

  useEffect(() => {
    if (!resolvedParams.id) return;

    const fetchComments = async () => {
      try {
        const commentRef = collection(db, "posts", resolvedParams.id, "comments");
        const snap = await getDocs(query(commentRef, orderBy("createdAt", "asc")));
        const fetched = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setComments(fetched);
      } catch (e) {}
    };

    fetchComments();
  }, [resolvedParams.id]);

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
    } catch {
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
    } catch {
      setLiked((prev) => !prev);
      setLikes((prev) => prev - (optimisticLiked ? 1 : -1));
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!newComment.trim()) return;

    try {
      const commentRef = collection(db, "posts", resolvedParams.id, "comments");

      await addDoc(commentRef, {
        content: newComment.trim(),
        userId: user.uid,
        displayName: user.displayName || "익명",
        createdAt: serverTimestamp(),
      });

      setNewComment("");

      const snap = await getDocs(query(commentRef, orderBy("createdAt", "asc")));
      const fetched = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setComments(fetched);
    } catch {
      alert("댓글 작성 중 오류가 발생했습니다.");
    }
  };

  const handleReport = async (commentId) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const reportRef = doc(db, "posts", resolvedParams.id, "comments", commentId, "reports", user.uid);

    const alreadyReported = await getDoc(reportRef);
    if (alreadyReported.exists()) {
      alert("이미 신고한 댓글입니다.");
      return;
    }

    try {
      await setDoc(reportRef, {
        reason: "부적절한 내용",
        createdAt: serverTimestamp(),
      });
      alert("신고가 접수되었습니다.");
    } catch {
      alert("신고 중 오류가 발생했습니다.");
    }
  };

  const isAuthor = user && post?.authorId === user.uid;

  if (loading) return <div>로딩 중...</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
      <div className="flex flex-col items-center justify-center min-h-screen py-16 px-4 text-white">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold mb-4 drop-shadow-lg animate-fade-in">
            {post.title}
          </h1>
          <p className="text-sm text-gray-300 mb-6">{authorName || "..."}</p>
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
                    liked ? "bg-red-600 hover:bg-red-700" : "bg-gray-600 hover:bg-gray-700"
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

          <div className="mt-12 max-w-xl mx-auto w-full text-left">
            <h2 className="text-xl font-semibold mb-4">댓글</h2>

            <div className="flex gap-2 items-center mb-6">
              <input
                  type="text"
                  className="flex-1 px-4 py-2 rounded-lg text-white bg-white/10 backdrop-blur-sm placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="댓글을 남겨보세요"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                  onClick={handleAddComment}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow"
              >
                등록
              </button>
            </div>

            <ul className="space-y-4">
              {comments.length === 0 ? (
                  <li className="text-gray-400">아직 댓글이 없습니다.</li>
              ) : (
                  comments.map((comment, idx) => (
                      <li
                          key={idx}
                          className="bg-white/5 backdrop-blur-md rounded-xl p-4 shadow-md border border-white/10 transition hover:scale-[1.01]"
                      >
                        <p className="text-sm text-blue-200 font-semibold">
                          {comment.displayName || "익명"}
                        </p>
                        <p className="text-white text-base mt-1 whitespace-pre-line">
                          {comment.content}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {comment.createdAt?.seconds
                              ? formatDistanceToNow(new Date(comment.createdAt.seconds * 1000), {
                                addSuffix: true,
                                locale: ko,
                              })
                              : "방금 전"}
                        </p>
                        <button
                            onClick={() => handleReport(comment.id)}
                            className="text-xs text-red-400 hover:underline mt-2"
                        >
                          신고
                        </button>
                      </li>
                  ))
              )}
            </ul>
          </div>
        </div>
      </div>
  );
}



