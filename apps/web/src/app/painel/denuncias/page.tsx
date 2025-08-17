'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isAuthenticated, getUser } from '@/lib/auth'

interface Scam {
  id: string
  title: string
  description: string
  category: string
  status: string
  views: number
  createdAt: string
  isResolved: boolean
  _count: {
    comments: number
    likes: number
  }
}

export default function MyScamsPage() {
  const router = useRouter()
  const [scams, setScams] = useState<Scam[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'resolved' | 'pending'>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login?returnUrl=/painel/denuncias')
      return
    }

    fetchUserScams()
  }, [router, page, filter])

  const fetchUserScams = async () => {
    try {
      const user = getUser()
      if (!user) return

      const token = localStorage.getItem('token')
      const response = await fetch(
        `http://localhost:3333/users/${user.id}/scams?page=${page}&limit=10`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        let filteredScams = data.scams || []
        
        if (filter === 'resolved') {
          filteredScams = filteredScams.filter((s: Scam) => s.isResolved)
        } else if (filter === 'pending') {
          filteredScams = filteredScams.filter((s: Scam) => !s.isResolved)
        }
        
        setScams(filteredScams)
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Erro ao buscar denúncias:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (scamId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta denúncia?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3333/scams/${scamId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setScams(scams.filter(s => s.id !== scamId))
      }
    } catch (error) {
      console.error('Erro ao excluir denúncia:', error)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
      'PENDING': { text: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
      'VERIFIED': { text: 'Verificado', className: 'bg-green-100 text-green-800' },
      'UNVERIFIED': { text: 'Não Verificado', className: 'bg-red-100 text-red-800' },
      'INVESTIGATING': { text: 'Em Investigação', className: 'bg-blue-100 text-blue-800' }
    }
    
    const statusInfo = statusMap[status] || { text: status, className: 'bg-gray-100 text-gray-800' }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.className}`}>
        {statusInfo.text}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Minhas Denúncias</h1>
              <p className="text-gray-600 mt-1">Gerencie todas as suas denúncias de golpes</p>
            </div>
            <Link
              href="/denunciar"
              className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Nova Denúncia
            </Link>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas ({scams.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pendentes
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'resolved'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Resolvidas
            </button>
          </div>
        </div>

        {/* Lista de Denúncias */}
        {scams.length > 0 ? (
          <div className="space-y-4">
            {scams.map((scam) => (
              <div key={scam.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <Link
                          href={`/golpe/${scam.id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-red-600"
                        >
                          {scam.title}
                        </Link>
                        <p className="text-gray-600 mt-1 line-clamp-2">{scam.description}</p>
                        
                        <div className="flex items-center gap-4 mt-3">
                          {getStatusBadge(scam.status)}
                          {scam.isResolved && (
                            <span className="text-green-600 font-medium text-sm">
                              ✓ Caso Resolvido
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(scam.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {scam.views} visualizações
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {scam._count.comments} comentários
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {scam._count.likes} curtidas
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex gap-2">
                    <Link
                      href={`/golpe/${scam.id}`}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Visualizar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDelete(scam.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 mb-4">
              {filter === 'resolved' 
                ? 'Você não tem denúncias resolvidas'
                : filter === 'pending'
                ? 'Você não tem denúncias pendentes'
                : 'Você ainda não fez nenhuma denúncia'
              }
            </p>
            <Link
              href="/denunciar"
              className="inline-block bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Fazer Primeira Denúncia
            </Link>
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="px-4 py-2 text-gray-700">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  )
}