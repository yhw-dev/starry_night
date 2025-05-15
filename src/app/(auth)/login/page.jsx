"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/firebase/auth'
import Button from '@/components/ui/Button'
import Textfield from '@/components/ui/Textfield'

const Login = () => {
  const { login, loginWithGoogle, checkVerifiedEmailExists } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showResetLink, setShowResetLink] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setShowResetLink(false)

    try {
      const userCredential = await login(email, password)
      router.push('/')
    } catch (err) {
      const emailExists = await checkVerifiedEmailExists(email)

      if (err.message === 'EMAIL_NOT_VERIFIED') {
        setError('이메일 인증이 완료되지 않았습니다. 메일함을 확인해주세요.')
      } else if (!emailExists) {
        setError('존재하지 않는 이메일입니다.')
      } else {
        setError('로그인 실패: 잘못된 이메일 또는 비밀번호입니다.')
        setShowResetLink(true)
      }

      setEmail('')
      setPassword('')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md text-white p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6 tracking-wider text-white">로그인</h2>

        {error && (
          <>
            <p className="text-red-400 text-sm mb-2 text-center">{error}</p>
            {showResetLink && (
              <p className="text-center text-sm text-blue-400 underline hover:text-blue-300 transition">
                <Link href="/forgot-password">비밀번호를 잊으셨나요?</Link>
              </p>
            )}
          </>
        )}

        <form onSubmit={handleLogin} className="space-y-4 mt-2">
          <Textfield
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-black placeholder:text-gray-600"
          />
          <Textfield
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-black placeholder:text-gray-600"
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full bg-white text-black hover:bg-gray-100 border border-gray-400"
            disabled={loading || !email || !password}
          >
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </form>

        <div className="mt-6">
          <Button onClick={loginWithGoogle} variant="secondary" className="w-full">
            Google로 로그인
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Login
