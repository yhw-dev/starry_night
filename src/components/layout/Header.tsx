'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/firebase/auth'
import { User } from 'firebase/auth'
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
          {[
            { href: "/about", label: "사이트 소개" },
            { href: "/posts", label: "시 목록" },
            { href: "/poems", label: "시 감상" }
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="relative px-3 py-1 rounded-md transition-all duration-700
                         before:absolute before:inset-0 before:rounded-md
                         before:bg-white/10 before:opacity-0
                         hover:before:opacity-100 hover:before:animate-pulse
                         hover:text-white z-10 overflow-hidden"
            >
              <span className="relative z-10">{label}</span>
            </Link>
          ))}
        </nav>

        {/* 사용자 정보 및 버튼 */}
        <div className="flex items-center space-x-4">
          {/* 사용자 이름 → 마이페이지로 이동 */}
          {typedUser && (
            <Link href="/mypage">
              <span className="text-sm text-gray-300 hover:underline cursor-pointer">
                {typedUser.displayName ? `${typedUser.displayName}님` : '사용자님'}
              </span>
            </Link>
          )}

          {/* 로그인 / 로그아웃 / 회원가입 버튼 */}
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
