// components/ui/Modal.tsx
import { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={cn('bg-white rounded-lg p-6 w-full max-w-md')}>
        {children}
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-600 hover:underline"
        >
          닫기
        </button>
      </div>
    </div>
  )
}
