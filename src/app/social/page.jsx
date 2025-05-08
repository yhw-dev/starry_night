"use client"

import React, { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import SocialEditPage from './[id]/edit/page'
import { db } from '@/lib/firebase/firebase'
import { deleteDocument } from '@/lib/firebase/firestore'
import Link from 'next/link'

/**
 * 게시글 목록 페이지
 * - 게시글 목록 조회
 * - 게시글 수정/삭제 기능
 * - 게시글 상세 페이지 링크
 */
const SocialPage = () => {
    // 게시글 목록 상태
    const [posts, setPosts] = useState([])
    // 현재 수정 중인 게시글 ID
    const [editingPostId, setEditingPostId] = useState(null)

    /**
     * Firestore에서 게시글 목록을 가져오는 함수
     * - 제목 기준 오름차순 정렬
     * - 제목과 내용만 가져옴
     */
    const fetchPosts = async () => {
        try {
            const postsQuery = query(
                collection(db, 'posts'), 
                orderBy('title')
            )
            const querySnapshot = await getDocs(postsQuery)
            const postsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                title: doc.data().title,
                content: doc.data().content,
            }))
            setPosts(postsData)
        } catch (error) {
            console.error('게시글 목록 조회 실패:', error)
            alert('게시글 목록을 불러오는데 실패했습니다.')
        }
    }

    // 컴포넌트 마운트 시 게시글 목록 조회
    useEffect(() => {
        fetchPosts()
    }, [])

    /**
     * 게시글 삭제 처리 함수
     * @param {string} id - 삭제할 게시글 ID
     */
    const handleDelete = async (id) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await deleteDocument('posts', id)
                fetchPosts() // 목록 새로고침
            } catch (error) {
                console.error('게시글 삭제 실패:', error)
                alert('게시글 삭제에 실패했습니다.')
            }
        }
    }

    /**
     * 게시글 수정 완료 처리 함수
     * - 수정 모드 종료
     * - 목록 새로고침
     */
    const handleUpdate = () => {
        setEditingPostId(null)
        fetchPosts()
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">게시글 목록</h2>
                <Link 
                    href="/social/write"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    글쓰기
                </Link>
            </div>

            {editingPostId ? (
                // 수정 모드
                <SocialEditPage
                    id={editingPostId}
                    initialTitle={posts.find((post) => post.id === editingPostId)?.title ?? ''}
                    initialContent={posts.find((post) => post.id === editingPostId)?.content ?? ''}
                    onCancel={() => setEditingPostId(null)}
                    onUpdate={handleUpdate}
                />
            ) : (
                // 목록 모드
                <>
                    {posts.length > 0 ? (
                        <ul className="space-y-4">
                            {posts.map((post) => (
                                <li 
                                    key={post.id}
                                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <Link 
                                        href={`/social/${post.id}`}
                                        className="block"
                                    >
                                        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                                        <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 py-8">
                            게시글이 없습니다.
                        </p>
                    )}
                </>
            )}
        </div>
    )
}

export default SocialPage
