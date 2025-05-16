"use client";

import React, { useEffect, useState, useRef } from "react";

const AboutPage = () => {
  const [titleVisible, setTitleVisible] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [readyForScrollReveal, setReadyForScrollReveal] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [hideScrollHint, setHideScrollHint] = useState(false);
  const observerRefs = useRef([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTitleVisible(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timers = [];
    for (let i = 0; i < 3; i++) {
      timers.push(
        setTimeout(() => {
          setVisibleCount((prev) => prev + 1);
          if (i === 2) {
            setTimeout(() => {
              setReadyForScrollReveal(true);
              setShowScrollHint(true);
            }, 500);
          }
        }, 1000 + i * 500)
      );
    }
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.getAttribute("data-index"));
          if (entry.isIntersecting && readyForScrollReveal && idx >= 3) {
            setRevealedIndices((prev) => new Set(prev).add(idx));
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      }
    );

    observerRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [readyForScrollReveal]);

  useEffect(() => {
    const handleScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
      if (atBottom) {
        setHideScrollHint(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const paragraphs = [
    `이곳은 시를 통해 감정을 나누는 밤하늘입니다.
     말로는 전하지 못했던 감정들을, 글로 담아 별로 띄워보세요.`,
    `누구나 시를 작성하고, 다른 사람이 쓴 시를 감상할 수 있습니다.
     작성된 시들은 목록으로 정리되어, 자유롭게 둘러볼 수 있습니다.`,
    `당신의 마음을 밤하늘에 띄워보세요`,
    `마음에 드는 시에는 좋아요를 표시할 수 있으며,
     좋아요 수를 기준으로 인기 시를 정렬해서 볼 수도 있습니다.`,
    `시 감상 탭에서는 다양한 시들을 키워드로 검색하거나,
     관심 있는 주제의 시를 찾아 감상할 수 있습니다.`,
    `어서, 당신의 감정을 기록해보세요.
     그리고 누군가의 밤하늘에 따뜻한 별이 되어주세요.`,
    `별 하나에 감정을 담고,
     별 하나에 서로를 담습니다.`,
  ];

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-start px-6 py-16 mt-12 relative pb-0">
      {/* 제목 */}
      <h1
        className={`text-5xl font-bold text-center transition-opacity duration-1000 ${
          titleVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        당신의 마음을 별자리에 남겨주세요
      </h1>

      {/* 본문 문단들 */}
      <div className="max-w-xl text-xl leading-relaxed text-center w-full mt-28">
        {paragraphs.map((text, idx) => {
          const isVisible =
            idx < 3 ? visibleCount > idx : revealedIndices.has(idx);

          const delayClass =
            idx < 3
              ? "transition-opacity duration-1000"
              : "transition-opacity duration-[2000ms]";

          const spacingClass = "mb-16";

          const isLast = idx === paragraphs.length - 1;
          const emphasisClass = isLast ? "font-bold text-2xl" : "";

          return (
            <p
              key={idx}
              ref={(el) => (observerRefs.current[idx] = el)}
              data-index={idx}
              className={`${delayClass} ${
                isVisible ? "opacity-100" : "opacity-0"
              } ${spacingClass} ${emphasisClass}`}
            >
              {text.split("\n").map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>
          );
        })}
      </div>

      {/* 오른쪽 아래 scroll hint */}
      {showScrollHint && !hideScrollHint && (
        <div
          className={`fixed bottom-8 right-8 text-white text-sm transition-opacity duration-1000 ${
            showScrollHint ? "opacity-100" : "opacity-0"
          } flex flex-col items-center text-center gap-1`}
        >
          <div>아래로 내려주세요</div>
          <div className="animate-bounce text-lg">↓</div>
        </div>
      )}
    </div>
  );
};

export default AboutPage;
