"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth';
import { signInWithPopup } from 'firebase/auth';

const Signup = () => {
    const { register } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // 이메일 회원가입 처리
    const handleRegister = async (event) => {
        event.preventDefault();
        try {
            await register(email, password);
            router.push('/');
        } catch (err) {
            setError('회원가입 실패: 이메일 형식이 올바르지 않거나 비밀번호가 너무 짧습니다.');
        }
    };

    // Google 로그인 처리
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log('Google 로그인 성공:', result.user); // 로그인 성공 시 사용자 정보
            router.push('/'); // 로그인 성공 시 메인 페이지로 이동
        } catch (err) {
            console.error('Google 로그인 실패:', err);
            setError('Google 로그인 실패: 다시 시도해주세요.');
        }
    };

    return (
        <div className='container mx-auto'>
            <h2>회원가입</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleRegister}>
                <label>
                    이메일:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label>
                    비밀번호:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">회원가입</button>
            </form>
            <hr />
            <button onClick={handleGoogleLogin}>Google로 로그인</button> {/* Google 로그인 버튼 */}
        </div>
    );
};

export default Signup;