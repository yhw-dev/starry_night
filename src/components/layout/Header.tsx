'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/firebase/auth'
import { User } from 'firebase/auth'
import Button from '../ui/Button'
import styles from './Header.module.css'

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

        {/* 네비게이션 (절대 위치로 화면 중앙에 고정) */}
        <nav className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-6 text-lg">
          {[
            { href: "/about", label: "소개" },
            { href: "/posts", label: "별무리" },
            { href: "/poems", label: "시 감상" }
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="relative px-3 py-1 rounded-md transition-all duration-300"
            >
              <span className={`relative z-10 ${styles.glowText}`}>
                {label}
              </span>
            </Link>
          ))}
        </nav>

        {/* 사용자 정보 및 버튼 */}
        <div className="flex items-center space-x-4">
          {typedUser && (
            <Link href="/mypage">
              <span className="text-sm text-gray-300 hover:underline cursor-pointer">
                {typedUser.displayName ? `${typedUser.displayName}님` : '사용자님'}
              </span>
            </Link>
          )}

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
