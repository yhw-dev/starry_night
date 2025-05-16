'use client'

import { cva } from 'class-variance-authority'
import { cn } from '@/utils/cn'
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

const buttonStyles = cva(
  'px-6 py-2 text-base font-medium rounded-full transition duration-300 ease-in-out border',
  {
    variants: {
      variant: {
        primary: `
          bg-transparent text-white border-white
          hover:bg-white/10 hover:shadow-glow
        `,
        secondary: `
          bg-white text-black border-white
          hover:shadow-glow hover:brightness-105
        `,
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
)

export default function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button {...props} className={cn(buttonStyles({ variant }), className)} />
  )
}