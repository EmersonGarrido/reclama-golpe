'use client'

import { useRouter } from 'next/navigation'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message: string
  redirectTo?: string
  buttonText?: string
}

export default function SuccessModal({ 
  isOpen, 
  onClose, 
  title = 'Sucesso!',
  message,
  redirectTo,
  buttonText = 'Continuar'
}: SuccessModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  const handleContinue = () => {
    onClose()
    if (redirectTo) {
      router.push(redirectTo)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {title}
          </h3>
          
          <p className="text-sm text-gray-500 mb-6">
            {message}
          </p>

          <button
            onClick={handleContinue}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  )
}