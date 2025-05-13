'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function EditForm({ postId }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

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
      }
    };

    fetchPost();
  }, [postId, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/api/posts/${postId}`, { title, content });
      router.push('/posts');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('수정에 실패했습니다.');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">글 수정</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block font-medium">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="space-y-2">
          <label className="block font-medium">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full p-2 border rounded h-32"
          />
        </div>
        <div className="flex gap-2">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
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

// "use client"

// import React, { use, useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import axios from 'axios'

// const EditPage = ({params}) => {

//   const router = useRouter()
//   const resolvedParams = use(params)
//   const [title, setTitle] = useState('')
//   const [content, setContent] = useState('')

//   useEffect(() => {
//     // 게시글 불러오기
//     axios
//       .get(`/api/posts/${resolvedParams.id}`)
//       .then((res) => {
//         // res = { data: { title: '제목', content: '내용' } }
//         setTitle(res.data.title)
//         setContent(res.data.content)
//       })
//       .catch((error) => {
//         console.error(error)
//         router.push('/posts')
//       })
//   }, [resolvedParams.id, router])

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     try {
//       const res = await axios.put(`/api/posts/${resolvedParams.id}`, {title, content})

//       if (res.status === 201) {
//         alert('글수정 완료')
//         router.push('/posts')
//       } else {
//         alert('글수정 실패')
//       }

//     } catch (error) {
//       console.error(error)
//       alert('오류 발생')
//     }
//   }

//   return (
//     <div className='container mx-auto'>
//       <h2 className='sr-only'>포스트 글쓰기</h2>
//       <form onSubmit={handleSubmit} className='flex flex-col gap-5 h-screen'>
//         {/* 제목 */}
//         <div>
//           <label htmlFor="tit" className='sr-only'>제목</label>
//           <input 
//           type="text" 
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           name="tit" id="tit" 
//           placeholder='제목을 입력하세요.'           
//           className='text-5xl font-black py-5 border-b-4 border-gray-400 w-full' />
//         </div>

//         {/* 본문 */}
//         <div className='flex-1'>
//           <label htmlFor="cont" className='sr-only'>내용</label>
//           <textarea 
//           name="cont" id="cont" 
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           placeholder='당신의 이야기를 적어보세요.' 
//           className='w-full h-full text-2xl'></textarea>
//         </div>

//         {/* 확인, 취소 */}
//         <div className='border-t-2 border-gray-300 flex justify-end'>
//           <button className='p-7 bg-gray-400'>취소</button>
//           <button type='submit' className='p-7 bg-purple-400'>등록</button>
//         </div>
//       </form>
//     </div>
//   )
// }

// export default EditPage