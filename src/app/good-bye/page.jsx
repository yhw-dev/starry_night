'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function GoodbyePage() {
  const message = "잘 가요, 별밤 친구";
  const subMessage = "밤은 언제나 당신을 기다리고 있어요.";

  const [showMain, setShowMain] = useState(false);
  const [showSub, setShowSub] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowMain(true), 200);   // 메인 문장 0.2초 후 등장
    const timer2 = setTimeout(() => setShowSub(true), 1500);   // 서브 문장 1.5초 후 등장

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-4 text-center">
      <h1
        className={`text-4xl font-bold mb-4 whitespace-pre-wrap transition-opacity duration-1000 ${
          showMain ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {message}
      </h1>
      <p
        className={`text-lg mb-6 whitespace-pre-wrap transition-opacity duration-1000 delay-300 ${
          showSub ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {subMessage}
      </p>
      <Link
        href="/"
        className="bg-white text-black px-6 py-2 rounded-xl hover:bg-blue-100 transition"
      >
        처음으로 돌아가기
      </Link>
    </div>
  );
}
