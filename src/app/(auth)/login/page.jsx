"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/firebase/auth'
import Button from '@/components/ui/Button'
import Textfield from '@/components/ui/Textfield'

const Login = () => {
  const { login, loginWithGoogle } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      await login(email, password)
      router.push('/')
    } catch (err) {
      setError('로그인 실패: 잘못된 이메일 또는 비밀번호입니다.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md text-white p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6 tracking-wider"> 로그인</h2>
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <Textfield
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Textfield
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="primary" className="w-full">
            로그인
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
