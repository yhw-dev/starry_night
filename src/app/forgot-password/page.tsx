"use client"

import { useState } from "react"
import { useAuth } from "@/lib/firebase/auth"
import Textfield from "@/components/ui/Textfield"
import Button from "@/components/ui/Button"

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    setError("")
    setLoading(true)

    try {
      await resetPassword(email)
      setMessage("비밀번호 재설정 메일이 전송되었습니다. 메일함을 확인해주세요.")
      setEmail("")
    } catch (err) {
      setError("이메일 전송 실패: 가입된 이메일인지 확인해주세요.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md text-white p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6 tracking-wider text-white">비밀번호 찾기</h2>
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        {message && <p className="text-green-300 text-sm mb-4 text-center">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textfield
            type="email"
            placeholder="가입한 이메일 주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-black placeholder:text-gray-600"
          />
          <Button
            type="submit"
            className="w-full bg-white text-black hover:bg-gray-100 border border-gray-400"
            disabled={!email || loading}
          >
            {loading ? "메일 전송 중..." : "비밀번호 재설정 메일 보내기"}
          </Button>
        </form>
      </div>
    </div>
  )
}
