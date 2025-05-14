'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/firebase/auth'
import { User } from "firebase/auth"
import Button from '../ui/Button'

const Header = () => {
    const { user, logout } = useAuth()
    const typedUser = user as User | null

    return (
        <header className="sticky top-0 z-50 w-full bg-black text-white shadow-md">
            <div className="max-w-7xl mx-auto relative flex items-center justify-between px-6 py-4">
                {/* 로고 */}
                <div className="text-2xl font-bold">
                    <Link href="/">별밤✶</Link>
                </div>

                {/* 네비게이션 */}
                <nav className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex space-x-6 text-lg">
                    <Link href="/about" className="hover:text-gray-300">사이트 소개</Link>
                    <Link href="/posts" className="hover:text-gray-300">시 목록</Link>
                    <Link href="/poems" className="hover:text-gray-300">시 감상</Link>
                </nav>

                {/* 사용자 정보 + 버튼들 */}
                <div className="flex items-center space-x-4">
                    {/* 사용자 이름 */}
                    {typedUser && (
                        <span className="text-sm text-gray-300">
                            {typedUser.displayName ? `${typedUser.displayName}님` : '사용자님'}
                        </span>
                    )}

                    {/* 로그인 / 로그아웃 버튼 */}
                    {user ? (
                        <Button variant="secondary" onClick={logout}>로그아웃</Button>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="primary">로그인</Button>
                            </Link>
                            <Link href="/signup">
                                <Button variant="primary">회원가입</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header