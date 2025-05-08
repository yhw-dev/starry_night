'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/firebase/auth'

const Header = () => {
    const { user, loginWithGoogle, logout } = useAuth()

    return (
        <header className="sticky top-0 z-50 w-full bg-gray-900 text-white shadow-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                {/* 로고 */}
                <div className="text-2xl font-bold">
                    <Link href="/">logo</Link>
                </div>

                {/* 네비게이션 */}
                <nav className="hidden md:flex space-x-6 text-lg">
                    <Link href="/about" className="hover:underline">About</Link>
                    <Link href="/posts" className="hover:underline">Posts</Link>
                </nav>

                {/* 로그인/로그아웃 버튼들 */}
                <div className="flex space-x-2">
                    {user ? (
                        <button onClick={logout} className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded">
                            로그아웃
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={loginWithGoogle}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
                            >
                                Google로 로그인
                            </button>
                            <Link href="/login">
                                <button className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded">
                                    로그인
                                </button>
                            </Link>
                            <Link href="/signup">
                                <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded">
                                    회원가입
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header

// 'use client'

// import Link from 'next/link'
// import { useAuth } from '@/lib/firebase/auth'

// const Header = () => {
//     const { user, loginWithGoogle, logout } = useAuth()

//     return (
//         <header className="w-full flex justify-between items-center p-4 bg-black text-white">
//             <div className="text-2xl font-bold">
//                 <Link href="/">logo</Link>
//             </div>

//             <nav>
//                 <ul className="flex space-x-6 text-lg">
//                     <li>
//                         <Link href="/about">About</Link>
//                     </li>
//                     <li>
//                         <Link href="/posts">Posts</Link>
//                     </li>
//                 </ul>
//             </nav>

//             <div className="flex space-x-2">
//                 {user ? (
//                     <button onClick={logout} className="px-4 py-2 bg-red-500 rounded">
//                         로그아웃
//                     </button>
//                 ) : (
//                     <>
//                         <button onClick={loginWithGoogle} className="px-4 py-2 bg-blue-500 rounded">
//                             Google로 로그인
//                         </button>
//                         <Link href="/login">
//                             <button className="px-4 py-2 bg-green-500 rounded">로그인</button>
//                         </Link>
//                         <Link href="/signup">
//                             <button className="px-4 py-2 bg-yellow-500 rounded">회원가입</button>
//                         </Link>
//                     </>
//                 )}
//             </div>
//         </header>
//     )
// }

// export default Header