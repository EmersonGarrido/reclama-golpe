'use client'

import { useState } from 'react'
import { getUser } from '@/lib/auth'

interface MaskedDataProps {
  data: string
  type?: 'email' | 'phone' | 'cpf' | 'text'
  showButton?: boolean
  className?: string
}

export default function MaskedData({ 
  data, 
  type = 'text', 
  showButton = true,
  className = ''
}: MaskedDataProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  const user = getUser()
  
  // Só admins podem revelar dados
  const canReveal = user?.isAdmin

  const maskData = (value: string): string => {
    if (!value) return ''
    
    switch (type) {
      case 'email':
        const [localPart, domain] = value.split('@')
        if (!domain) return '***'
        const maskedLocal = localPart.slice(0, 2) + '*'.repeat(Math.max(0, localPart.length - 2))
        return `${maskedLocal}@${domain}`
      
      case 'phone':
        if (value.length < 8) return '*'.repeat(value.length)
        return value.slice(0, 2) + '*'.repeat(value.length - 6) + value.slice(-4)
      
      case 'cpf':
        if (value.length < 11) return '*'.repeat(value.length)
        return value.slice(0, 3) + '.***.***-' + value.slice(-2)
      
      case 'text':
      default:
        if (value.length <= 3) return '*'.repeat(value.length)
        return value.slice(0, 2) + '*'.repeat(Math.max(0, value.length - 4)) + value.slice(-2)
    }
  }

  const displayValue = isRevealed ? data : maskData(data)

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`${!isRevealed ? 'font-mono tracking-wider' : ''}`}>
        {displayValue}
      </span>
      {showButton && canReveal && !isRevealed && (
        <button
          onClick={() => setIsRevealed(true)}
          className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
          title="Revelar dados"
        >
          👁️ Revelar
        </button>
      )}
      {showButton && isRevealed && (
        <button
          onClick={() => setIsRevealed(false)}
          className="text-xs text-gray-600 hover:text-gray-700 hover:underline"
          title="Ocultar dados"
        >
          🙈 Ocultar
        </button>
      )}
    </div>
  )
}