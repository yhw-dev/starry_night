"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"
import Button from "@/components/ui/Button"
import LoadingScreen from "@/components/ui/LoadingScreen"
import { useAuth } from "@/lib/firebase/auth"
import { db } from "@/lib/firebase/firebase"
import { doc, getDoc } from "firebase/firestore"

export default function MyPostsPage() {
  const [posts, setPosts] = useState([])
  const [likedPoems, setLikedPoems] = useState([])
  const [loading, setLoading] = useState(true)
  const [authorNames, setAuthorNames] = useState({})
  const { user } = useAuth()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    })
  }

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const [allRes, likedRes] = await Promise.all([
          axios.get("/api/posts"),
          axios.get(`/api/posts?likedBy=${user.uid}`),
        ])

        const postsData = allRes.data
        const likedData = likedRes.data

        setPosts(postsData)
        setLikedPoems(likedData)
        setLoading(false)

        const nameMap = {}
        for (const post of postsData) {
          const uid = post.authorId
          if (!uid || nameMap[uid]) continue
          try {
            const snap = await getDoc(doc(db, "users", uid))
            nameMap[uid] = snap.exists()
              ? snap.data().displayName || "익명"
              : "탈퇴한 사용자"
          } catch (err) {
            console.error("작성자 이름 로드 실패:", err)
            nameMap[uid] = "알 수 없음"
          }
        }
        setAuthorNames(nameMap)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (loading) return <LoadingScreen />
  if (!user) return <div className="text-white mt-10 text-center">로그인이 필요합니다.</div>

  const myPosts = posts.filter((post) => post.authorId === user.uid)

  return (
    <div className="flex flex-col items-center py-10">
      <h1 className="text-2xl font-bold mb-4 text-white"> 나의 시</h1>

      {/* 내가 쓴 시 - 테이블 형식 */}
      {myPosts.length === 0 ? (
        <div className="text-gray-400">작성한 시가 없습니다. 첫 시를 써보세요!</div>
      ) : (
        <div className="w-full max-w-6xl px-4 overflow-x-auto">
          <table className="w-full text-sm text-left text-white border border-white/20">
            <thead className="bg-white/10 text-gray-300">
              <tr>
                <th className="px-6 py-3">시 제목</th>
                <th className="px-6 py-3">작성 날짜</th>
                <th className="px-6 py-3">좋아요</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {myPosts.map((post) => (
                <tr key={post.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4 font-medium text-blue-300 hover:underline">
                    <Link href={`/posts/${post.id}`}>{post.title}</Link>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-pink-400">❤️ {post.likes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

 <h2 className="text-2xl font-bold mt-16 mb-4 text-white"> 내가 좋아요한 시</h2>
 {likedPoems.length === 0 ? (
   <div className="text-gray-400">좋아요한 시가 없습니다.</div>
 ) : (
   <div className="w-full max-w-6xl px-4 overflow-x-auto">
     <table className="w-full text-sm text-left text-white border border-white/20">
       <thead className="bg-white/10 text-gray-300">
         <tr>
           <th className="px-6 py-3">시 제목</th>
           <th className="px-6 py-3">작가</th>
           <th className="px-6 py-3">작성 날짜</th>
           <th className="px-6 py-3">좋아요</th>
         </tr>
       </thead>
       <tbody className="divide-y divide-white/10">
         {likedPoems.map((post) => (
           <tr key={post.id} className="hover:bg-white/5 transition">
             <td className="px-6 py-4 font-medium text-blue-300 hover:underline">
               <Link href={`/posts/${post.id}`}>{post.title}</Link>
             </td>
             <td className="px-6 py-4 text-gray-400">
               {authorNames[post.authorId] || "알 수 없음"}
             </td>
             <td className="px-6 py-4 text-gray-400">
               {formatDate(post.createdAt)}
             </td>
             <td className="px-6 py-4 text-pink-400">❤️ {post.likes}</td>
           </tr>
         ))}
       </tbody>
     </table>
   </div>
 )}



      <Link href="/posts/write" className="mt-10">
        <Button variant="primary">✒️ 시 쓰기</Button>
      </Link>
    </div>
  )
}
