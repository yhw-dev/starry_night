'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/firebase/auth'

const Header = () => {
    const { user, loginWithGoogle, logout } = useAuth()

    return (
        <header className="flex justify-between items-center p-4">
            <h1>
                <Link href="/">logo</Link>
            </h1>

            <nav>
                <ul className="flex space-x-4">
                    <li>
                        <Link href="/about">About</Link>
                    </li>
                    <li>
                        <Link href="/posts">Posts</Link>
                    </li>
                </ul>
            </nav>

            <div className="space-x-4">
                {user ? (
                    <button onClick={logout} className="p-2 bg-red-500 rounded">
                        로그아웃
                    </button>
                ) : (
                    <>
                        <button onClick={loginWithGoogle} className="p-2 bg-blue-500 rounded">
                            Google로 로그인
                        </button>
                        <Link href="/login">
                            <button className="p-2 bg-green-500 rounded">로그인</button>
                        </Link>
                        <Link href="/signup">
                            <button className="p-2 bg-yellow-500 rounded">회원가입</button>
                        </Link>
                    </>
                )}
            </div>
        </header>
    )
}

export default Header