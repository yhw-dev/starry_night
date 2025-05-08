'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // 페이지 이동을 위한 라우터
import axios from 'axios';

export default function PostsPage() {
  const router = useRouter(); // 라우터 객체
  const [posts, setPosts] = useState([]); // 게시글 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    // axios.get().then().catch()으로 비동기 처리
    axios
      .get('/api/posts') // 브라우저에서 /api/posts로 GET 요청을 보냅니다
      .then((res) => {
        setPosts(res.data); // 데이터를 상태에 저장
        setLoading(false); // 로딩 시 false로 변경
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    // 삭제를 취소하면 함수 종료
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const res = await axios.delete(`/api/posts/${id}`); // 브라우저에서 /api/posts/1로 DELETE 요청을 보냅니다
      // 서버에서 응답이 오면
      if (res.status === 200) {
        setPosts(posts.filter((post) => post.id !== id)); // 삭제된 게시글 제외
      } else {
        alert('삭제에 실패했습니다.'); 
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    }
  };

  // 상세 페이지로 이동하는 함수
  const handlePostClick = (id) => {
    router.push(`/posts/${id}`);
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div>
      <h1>게시글 목록</h1>
      <Link href="/posts/write">글쓰기</Link>

      <div>
        {posts.map((post) => (
          <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="cursor-pointer block"  // block 추가하여 전체 영역 클릭 가능하게
            >
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}