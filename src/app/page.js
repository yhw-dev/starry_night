"use client";

import { useEffect, useRef, useState } from "react";
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
  const canvasRef = useRef(null);
  const meteors = useRef([]);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const createMeteor = () => {
      const speed = 5 + Math.random() * 2;
      meteors.current.push({
        x: Math.random() * width * 0.5,
        y: Math.random() * height * 0.5,
        vx: speed,
        vy: speed,
        opacity: 1,
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      meteors.current.forEach((m) => {
        m.x += m.vx;
        m.y += m.vy;
        m.opacity -= 0.008;

        const tailX = m.x - m.vx * 10;
        const tailY = m.y - m.vy * 10;
        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255,255,255,${m.opacity})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      });

      meteors.current = meteors.current.filter((m) => m.opacity > 0);
      requestAnimationFrame(animate);
    };

    animate();

    const interval = setInterval(() => {
      if (Math.random() < 0.9) createMeteor();
    }, 500 + Math.random() * 1000);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={styles.page}>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />
      <main className={`${styles.main} flex flex-col items-center justify-center mt-[-10rem] relative z-10`}>
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
