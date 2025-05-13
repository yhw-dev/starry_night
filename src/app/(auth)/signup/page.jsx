"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase/firebase';
import Button from '@/components/ui/Button';
import Textfield from '@/components/ui/Textfield';

const Signup = () => {
  const { register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      router.push('/');
    } catch (err) {
      setError('회원가입 실패: 이메일 형식이 올바르지 않거나 비밀번호가 너무 짧습니다.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google 로그인 성공:', result.user);
      router.push('/');
    } catch (err) {
      console.error('Google 로그인 실패:', err);
      setError('Google 로그인 실패: 다시 시도해주세요.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md text-white p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6 tracking-wide">회원가입</h2>
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
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
            가입하기
          </Button>
        </form>
        <div className="mt-6">
          <Button onClick={handleGoogleLogin} variant="secondary" className="w-full">
            Google로 가입하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
