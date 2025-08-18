'use client'

import { useRouter } from 'next/navigation'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  returnUrl?: string
}

export default function LoginModal({ isOpen, onClose, returnUrl = '/painel' }: LoginModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  const handleLogin = () => {
    router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`)
  }

  const handleRegister = () => {
    router.push(`/cadastro?returnUrl=${encodeURIComponent(returnUrl)}`)
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
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Login Necessário
          </h3>
          
          <p className="text-sm text-gray-500 mb-6">
            Para realizar esta ação, você precisa estar conectado à sua conta.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleLogin}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Fazer Login
            </button>
            
            <button
              onClick={handleRegister}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Criar Conta
            </button>
            
            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              Continuar sem login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}