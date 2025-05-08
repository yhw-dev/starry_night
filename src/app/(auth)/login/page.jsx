"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/firebase/auth'

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
        <div className='container mx-auto'>
            <h2>로그인</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleLogin}>
                <label>
                    이메일:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    비밀번호:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <button type="submit">로그인</button>
            </form>
            <button onClick={loginWithGoogle}>Google로 로그인</button>
        </div>
    )
}

export default Login