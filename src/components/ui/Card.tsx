// components/ui/Card.tsx
import { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface CardProps {
  children: ReactNode
  className?: string
}

export default function Card({ children, className }: CardProps) {
  return (
    <div className={cn('bg-white/10',
        'backdrop-blur-md',
        'rounded-xl',
        'p-4',
        'text-white',
        'shadow-md',
        'transition-colors',
        'duration-300'
        ,className)}>
      {children}

    </div>
  )
}
