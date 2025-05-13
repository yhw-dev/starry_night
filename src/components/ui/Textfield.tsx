// components/ui/Textfield.tsx
import { InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface TextfieldProps extends InputHTMLAttributes<HTMLInputElement> {}

export default function Textfield({ className, ...props }) {
  return (
    <input
      className={`w-full p-3 rounded-md bg-white/80 text-black placeholder-gray-600
        focus:outline-none focus:ring-2 focus:ring-indigo-300 ${className}`}
      {...props}
    />
  )
}
