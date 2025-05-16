'use client'

interface LoadingScreenProps {
  message?: '찾고 있어요' | '찾아가는 중이에요'
}

export default function LoadingScreen({ message = '찾고 있어요' }: LoadingScreenProps) {
  const displayText =
    message === '찾아가는 중이에요'
      ? '별을 찾아가는 중이에요...'
      : '별을 찾고 있어요...'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* 선택: 별똥별 효과 */}
      {/* <CometShower /> */}

      <div className="text-3xl font-semibold tracking-widest text-white animate-glow drop-shadow-lg">
        {displayText}
      </div>
    </div>
  )
}
