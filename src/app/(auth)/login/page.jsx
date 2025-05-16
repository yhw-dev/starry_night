'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/firebase/auth';
import Button from '@/components/ui/Button';
import Textfield from '@/components/ui/Textfield';

const Login = () => {
  const {
    login,
    loginWithGoogle,
    resetPassword,
  } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reauthTarget = searchParams.get("reauthTarget"); // 🔹 추가: 탈퇴용 재로그인 여부 확인

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showResetLink, setShowResetLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failCount, setFailCount] = useState(0);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setShowResetLink(false);

    try {
      const userCredential = await login(email, password);

      // 🔹 로그인 후 탈퇴 재요청인지 확인
      if (reauthTarget === "delete") {
        router.push("/delete-account?reauth=true");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error('로그인 에러:', err.code, err.message);

      if (err.message === 'EMAIL_NOT_VERIFIED') {
        setError('이메일 인증이 완료되지 않았습니다. 메일함을 확인해주세요.');
        setShowResetLink(true);
        setLoading(false);
        return;
      }

      setFailCount((prev) => prev + 1);
      setError('이메일 또는 비밀번호가 틀렸습니다.');
      if (failCount + 1 >= 2) {
        setShowResetLink(true);
      }

      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword(email);
      alert('비밀번호 재설정 메일이 전송되었습니다. 메일함을 확인해주세요.');
    } catch (err) {
      alert('비밀번호 재설정 실패: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md text-white p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6 tracking-wider text-white">
          로그인
        </h2>

        {/* 🔹 안내 메시지 (선택) */}
        {reauthTarget === "delete" && (
          <p className="text-center text-sm text-blue-300 mb-4">
            보안을 위해 다시 로그인해주세요. 로그인 후 바로 탈퇴가 진행됩니다.
          </p>
        )}

        {error && (
          <>
            <p className="text-red-400 text-sm mb-2 text-center">{error}</p>
            {showResetLink && (
              <div className="text-center">
                <button
                  onClick={handleResetPassword}
                  className="text-sm text-blue-400 underline hover:text-blue-300 transition"
                >
                  비밀번호를 재설정하시겠습니까?
                </button>
              </div>
            )}
          </>
        )}

        <form onSubmit={handleLogin} className="space-y-4 mt-2">
          <Textfield
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
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
  );
};

export default Login;
