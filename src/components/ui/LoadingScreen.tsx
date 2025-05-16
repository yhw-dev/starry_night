"use client";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* 선택: 별똥별 효과 */}
      {/* <CometShower /> */}

      <div className="text-3xl font-semibold tracking-widest text-white animate-glow drop-shadow-lg">
        별을 찾고 있어요...
      </div>
    </div>
  );
}
