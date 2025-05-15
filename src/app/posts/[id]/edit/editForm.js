'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/lib/firebase/auth';

export default function EditForm({ postId }) {
  const router = useRouter();
  const { user } = useAuth();
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
        authorId: user.uid,
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

  if (loading) {
    return <div className="text-white text-center p-6">불러오는 중...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center to-black px-4">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">글 수정</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white text-sm font-medium mb-2">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/40"
              placeholder="제목을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={8}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/40"
              placeholder="내용을 입력하세요"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              수정
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
