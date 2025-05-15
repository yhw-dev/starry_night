'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/lib/firebase/auth';

export default function EditForm({ postId }) {
  const router = useRouter();
  const { user } = useAuth(); // ✅ 로그인 정보
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`/api/posts/${postId}`);
        setTitle(data.title);
        setContent(data.content);
      } catch (error) {
        console.error('Error fetching post:', error);
        alert('게시글을 불러올 수 없습니다.');
        router.push('/posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      await axios.put(`/api/posts/${postId}`, {
        title,
        content,
        authorId: user.uid, // ✅ 서버에서 수정 권한 확인용
      });

      router.push(`/posts/${postId}`);
    } catch (error) {
      console.error('Error updating post:', error);

      if (error?.response?.status === 403) {
        alert('이 글을 수정할 권한이 없습니다.');
      } else {
        alert('수정에 실패했습니다.');
      }
    }
  };

  if (loading) return <div className="p-4 text-white">로딩 중...</div>;

  return (
    <div className="p-4 max-w-xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">글 수정</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block font-medium">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded text-black"
          />
        </div>
        <div className="space-y-2">
          <label className="block font-medium">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full p-2 border rounded h-32 text-black"
          />
        </div>
        <div className="flex gap-2">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-black"
          >
            취소
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            수정
          </button>
        </div>
      </form>
    </div>
  );
}