'use client'

import { cva } from 'class-variance-authority'
import { cn } from '@/utils/cn'
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

const buttonStyles = cva(
<<<<<<< HEAD
  'px-6 py-2 text-base font-medium rounded-full transition duration-300 ease-in-out',
=======
  'px-6 py-2 text-base font-medium rounded-full transition duration-300 ease-in-out border',
>>>>>>> d1e6fcd115b614f2e0276e1b38b89953e3410441
  {
    variants: {
      variant: {
        primary: `
<<<<<<< HEAD
          bg-black text-white border border-white
          hover:shadow-glow
        `,
        secondary: `
          bg-transparent text-white border border-white/50
          hover:bg-white/10 hover:shadow-glow
        `,
=======
          bg-transparent text-white border-white
          hover:bg-white/10 hover:shadow-glow
        `,
        secondary: `
          bg-white text-black border-white
          hover:shadow-glow hover:brightness-105
        `,
>>>>>>> d1e6fcd115b614f2e0276e1b38b89953e3410441
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