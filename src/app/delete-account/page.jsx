'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { auth } from "@/lib/firebase/firebase"
import { useAuth } from "@/lib/firebase/auth"
import { deleteUser } from "firebase/auth"
import { useEffect } from "react"

export default function DeleteAccountPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isReauth = searchParams.get("reauth") === "true"

  // 탈퇴 실행 함수
  const performDelete = async () => {
    try {
      const res = await fetch("/api/delete-account", { method: "DELETE" })
      if (!res.ok) throw new Error("서버 오류")

      await deleteUser(auth.currentUser)
      await logout()
      router.push("/good-bye")
    } catch (err) {
      console.error("탈퇴 실패:", err)
      if (err.code === "auth/requires-recent-login") {
        await logout()
        router.push("/login?reauthTarget=delete")
      } else {
        alert("탈퇴 중 오류가 발생했습니다.")
      }
    }
  }

  // 재로그인 후 돌아왔을 경우 → 자동 탈퇴
  useEffect(() => {
    if (user && isReauth) {
      performDelete()
    }
  }, [user, isReauth])

  const handleClick = async () => {
    const confirm = window.confirm("정말로 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.")
    if (!confirm || !user) return
    await performDelete()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">정말로 별밤을 떠나시겠어요?</h1>
      <button
        onClick={handleClick}
        className="text-sm text-blue-400 hover:underline"
      >
        회원 탈퇴하기
      </button>
    </div>
  )
}
