"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Link from "next/link";
import styles from "./page.module.css";

const lines = [
  <>
    별 하나에 <span className="font-bold">추억</span>과
  </>,
  <>
    별 하나에 <span className="font-bold">사랑</span>과
  </>,
  <>
    별 하나에 <span className="font-bold">쓸쓸함</span>과
  </>,
  <>
    별 하나에 <span className="font-bold">동경</span>과
  </>,
  <>
    별 하나에 <span className="font-bold">시</span>와
  </>,
  <>
    별 하나에 <span className="font-bold">어머니</span>,{" "}
    <span className="font-bold">어머니</span>
  </>,
];

const finalLines = [
  ".",
  ".",
  ".",
  <>
    당신의 <span className="font-bold">별</span>에는 어떤 이야기가 담겨있나요?
  </>,
];

export default function Home() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [visibleFinal, setVisibleFinal] = useState(false);

  useEffect(() => {
    const timers = [];

    lines.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines((v) => v + 1);
        }, i * 500)
      );
    });

    const totalDelay = lines.length * 500 + 200;
    timers.push(
      setTimeout(() => {
        setVisibleFinal(true);
      }, totalDelay)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={styles.page}>
      <main className={`${styles.main} flex flex-col items-center justify-center mt-[-10rem]`}>
        <div className="text-xl leading-relaxed text-center space-y-1">
          {lines.map((line, index) => (
            <p
              key={index}
              className="transition-opacity duration-700 ease-in"
              style={{ opacity: visibleLines > index ? 1 : 0 }}
            >
              {line}
            </p>
          ))}

          {finalLines.map((line, index) => (
            <p
              key={`final-${index}`}
              className={`transition-opacity duration-1000 ease-in ${
                index === finalLines.length - 1 ? "text-3xl" : ""
              }`}
              style={{ opacity: visibleFinal ? 1 : 0 }}
            >
              {line}
            </p>
          ))}
        </div>

        <div
          className={`${styles.ctas} mt-8 transition-opacity duration-1000 ease-in`}
          style={{ opacity: visibleFinal ? 1 : 0 }}
        >
          <Link href="/signup">
            <Button variant="primary" href="/signup" className="border border-white">
              계정 만들기
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" href="/login">
              계정이 있어요
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
