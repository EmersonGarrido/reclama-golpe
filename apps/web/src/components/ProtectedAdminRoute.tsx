'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated, getUser } from '@/lib/auth'

interface ProtectedAdminRouteProps {
  children: React.ReactNode
}

export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const router = useRouter()

  useEffect(() => {
    // Verificar autenticação
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }

    // Verificar se é admin
    const user = getUser()
    if (!user?.isAdmin) {
      router.push('/painel') // Redireciona para painel normal se não for admin
      return
    }
  }, [router])

  // Dupla verificação antes de renderizar
  const user = getUser()
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h1>
          <p className="text-gray-600">Você não tem permissão para acessar esta área.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}