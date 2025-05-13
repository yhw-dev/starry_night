// components/ui/Card.tsx
import { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface CardProps {
  children: ReactNode
  className?: string
}

export default function Card({ children, className }: CardProps) {
  return (
    <div className={cn('bg-white rounded-xl shadow-md p-4', className)}>
      {children}
    </div>
  )
}
