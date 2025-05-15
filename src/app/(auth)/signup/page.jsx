"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/firebase"; 
import Button from "@/components/ui/Button";
import Textfield from "@/components/ui/Textfield";

const Signup = () => {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password.length < 6) {
      setError("비밀번호는 최소 6자리 이상이어야 합니다.");
      setLoading(false);
      return;
    }

    try {
      await register(email, password, name); // 로그인 상태 유지 X
      await auth.signOut(); // 강제로 로그아웃

      alert("회원가입이 완료되었습니다. 이메일 인증 후 로그인해주세요.");
      setError("");
      router.push("/login");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("이미 등록된 이메일입니다. 로그인하거나 다른 이메일을 사용해주세요.");
      } else {
        setError("회원가입 실패: 이메일 형식이 올바르지 않거나 문제가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google 로그인 성공:", result.user);
      router.push("/");
    } catch (err) {
      console.error("Google 로그인 실패:", err);
      setError("Google 로그인 실패: 다시 시도해주세요.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md text-black p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6 tracking-wide text-white">
          별밤에 오신 걸 환영해요
        </h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <Textfield
            type="text"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-black placeholder:text-gray-600"
          />
          <Textfield
            type="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-black placeholder:text-gray-600"
          />
          <div className="relative">
            <Textfield
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호 (6자 이상)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-black placeholder:text-gray-600 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600"
            >
              {showPassword ? "숨김" : "보기"}
            </button>
          </div>
          <Button
            type="submit"
            variant="primary"
            className="w-full bg-white text-black hover:bg-gray-100 border border-gray-400"
            disabled={!name || !email || !password || loading}
          >
            {loading ? "가입 중..." : "가입하기"}
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