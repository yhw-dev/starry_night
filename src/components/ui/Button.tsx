'use client'

import { cva } from 'class-variance-authority'
import { cn } from '@/utils/cn' // 클래스 병합 도우미 함수

import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

const buttonStyles = cva(
  'px-5 py-2 text-base font-medium rounded-full transition duration-200 flex items-center justify-center',
  {
    variants: {
      variant: {
        primary: 'bg-foreground text-background hover:bg-gray-300 rounded-2xl',
        secondary:
          'bg-transparent border border-gray-400 text-white hover:border-white rounded-2xl',
      },
      defaultVariants: {
        variant: 'primary',
      },
    },
  }
)

export default function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button {...props} className={cn(buttonStyles({ variant }), className)} />
  )
}
