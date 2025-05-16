"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
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

// 세로선은 div로, 문장은 fragment로 분리
const finalLines = [
  { type: "divider" },
  {
    type: "text",
    content: (
      <>
        당신의 <span className="font-bold">별</span>에는 어떤 이야기가
        담겨있나요?
      </>
    ),
  },
];

export default function Home() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [visibleFinal, setVisibleFinal] = useState(false);
  const canvasRef = useRef(null);
  const meteors = useRef([]);
  const intervalRef = useRef(null);
  const animationRef = useRef(null);

  const { user } = useAuth();
  const router = useRouter();

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
      const speed = 3;
      const startX = Math.random() * width * 1.2 - width * 0.2;
      meteors.current.push({
        x: startX,
        y: Math.random() * height * 0.2,
        vx: speed,
        vy: speed,
        opacity: 0,
      });
    };

    const fadeInSpeed = 0.005;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      meteors.current.forEach((m) => {
        m.x += m.vx;
        m.y += m.vy;

        if (m.opacity < 1) {
          m.opacity += fadeInSpeed;
          if (m.opacity > 1) m.opacity = 1;
        }

        const tailLength = 200;
        const angle = Math.atan2(m.vy, m.vx);
        const tailX = m.x - Math.cos(angle) * tailLength;
        const tailY = m.y - Math.sin(angle) * tailLength;

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

      meteors.current = meteors.current.filter((m) => m.y < height + 100);

      animationRef.current = requestAnimationFrame(animate);
    };

    const startMeteor = () => {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          if (Math.random() < 0.9) createMeteor();
        }, 600);
      }
      if (!animationRef.current) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    const stopMeteor = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      meteors.current = [];
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        startMeteor();
      } else {
        stopMeteor();
      }
    };

    startMeteor();
    document.addEventListener("visibilitychange", handleVisibility);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      stopMeteor();
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div className={styles.page}>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />
      <main
        className={`${styles.main} flex flex-col items-center justify-center mt-[-10rem] relative z-10`}
      >
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

          {finalLines.map((line, index) => {
            if (line.type === "divider") {
              return (
                <div
                  key={`final-${index}`}
                  className="w-px h-20 bg-white mx-auto my-20 transition-opacity duration-1000 ease-in"
                  style={{
                    opacity: visibleFinal ? 1 : 0,
                    height: "8rem", // 선 길이 늘림 (h-32)
                    marginTop: "1.5rem", // 위쪽 간격
                    marginBottom: "1.5rem", // 아래쪽 간격
                  }}
                />
              );
            }

            return (
              <p
                key={`final-${index}`}
                className="text-3xl transition-opacity duration-1000 ease-in"
                style={{ opacity: visibleFinal ? 1 : 0 }}
              >
                {line.content}
              </p>
            );
          })}
        </div>

        <div
          className={`${styles.ctas} mt-8 transition-opacity duration-1000 ease-in`}
          style={{ opacity: visibleFinal ? 1 : 0 }}
        >
          {user ? (
            <Button
              variant="primary"
              onClick={() => router.push("/posts")}
              className="border border-white px-8 py-4 text-xl rounded-xxl"
            >
              나의 시 작성하기
            </Button>
          ) : (
            <>
              <Link href="/signup">
                <Button variant="primary" className="border border-white px-8 py-4 text-xl rounded-xxl">
                  계정 만들기
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" className="px-8 py-4 text-xl rounded-xxl">계정이 있어요</Button>
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
