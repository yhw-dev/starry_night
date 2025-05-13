'use client';

import React, { useEffect, useState, useRef } from 'react';

const AboutPage = () => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const observerRefs = useRef([]);

  // 상단 문단 - 순차 딜레이 방식
  useEffect(() => {
    const timers = [];
    for (let i = 0; i < 5; i++) {
      timers.push(
        setTimeout(() => {
          setVisibleCount(prev => prev + 1);
        }, i * 500)
      );
    }
    return () => timers.forEach(clearTimeout);
  }, []);

  // 하단 문단 - IntersectionObserver 방식
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, // 화면의 절반 이상 보이면
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const idx = Number(entry.target.getAttribute('data-index'));
        if (entry.isIntersecting) {
          setRevealedIndices(prev => new Set(prev).add(idx));
        }
      });
    }, options);

    observerRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const paragraphs = [
    // 상단 문단 5개
    `이곳은 시를 통해 감정을 나누는 밤하늘입니다.
     말로는 전하지 못했던 감정들을, 글로 담아 별로 띄워보세요.`,
    `누구나 하루에 하나의 시를 남길 수 있습니다.
     당신의 마음은 랜덤한 별이 되어 하늘에 떠오르고,
     다른 사람들은 그 별을 클릭해 시를 감상할 수 있습니다.`,
    `좋아요가 많은 시는 더욱 밝게 빛나고,
     비슷한 감정의 시들은 별자리처럼 이어집니다.`,
    `인공지능 조수는 시 쓰기부터 감정 분석까지 함께하며,
     당신의 문학적 감성을 더 풍부하게 만들어줍니다.`,
    `이제, 당신의 감정을 기록해보세요.
     그리고 누군가의 밤하늘에 따뜻한 별이 되어주세요.`,
    
    // 하단 문단들
    `시는 마음이 흐르는 또 다른 방식입니다.
     우리에게 필요한 것은 거창한 문학이 아니라, 솔직한 한 줄입니다.`,
    `별 하나에 감정을 담고,
     별 하나에 서로를 담습니다.`
  ];

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-start px-6 py-16 mt-20 space-y-12">
      <h1 className="text-5xl font-bold text-center">
        당신의 마음을 별로 남겨주세요
      </h1>

      <div className="max-w-xl text-xl leading-relaxed space-y-16 text-center">
        {paragraphs.map((text, idx) => {
          const isVisible =
            idx < 5 ? visibleCount > idx : revealedIndices.has(idx);
          const isUpper = idx < 5;
          const delayClass = isUpper
            ? 'transition-opacity duration-1000'
            : 'transition-opacity duration-[2000ms]';
          return (
            <p
              key={idx}
              ref={(el) => (observerRefs.current[idx] = el)}
              data-index={idx}
              className={`${delayClass} ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            >
              {text.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default AboutPage;
