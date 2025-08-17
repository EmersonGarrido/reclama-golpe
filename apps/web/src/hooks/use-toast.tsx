import { useState, useEffect } from 'react'

interface ToastOptions {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastOptions[]>([])

  const toast = (options: ToastOptions) => {
    // Por enquanto, vamos usar alert como fallback
    // Em uma implementação completa, você usaria um sistema de toast real
    if (options.variant === 'destructive') {
      alert(`❌ ${options.title}\n${options.description || ''}`)
    } else {
      alert(`✅ ${options.title}\n${options.description || ''}`)
    }
  }

  return { toast }
}