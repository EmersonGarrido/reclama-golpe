'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isAuthenticated, getUser } from '@/lib/auth'
import ScamDetailModal from '@/components/admin/ScamDetailModal'

interface Scam {
  id: string
  title: string
  description: string
  category: string
  status: string
  views: number
  createdAt: string
  isResolved: boolean
  user: {
    id: string
    name: string
    email: string
  }
  _count: {
    comments: number
    likes: number
    reports: number
  }
}

export default function AdminScamsPage() {
  const router = useRouter()
  const [scams, setScams] = useState<Scam[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'resolved'>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedScams, setSelectedScams] = useState<string[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedScamId, setSelectedScamId] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login?returnUrl=/admin/denuncias')
      return
    }

    const userData = getUser()
    if (!userData?.isAdmin) {
      router.push('/painel')
      return
    }

    fetchScams()
  }, [router, page, filter])

  const fetchScams = async () => {
    try {
      const token = localStorage.getItem('token')
      
      let statusFilter = ''
      if (filter === 'pending') statusFilter = '&status=PENDING'
      else if (filter === 'verified') statusFilter = '&status=VERIFIED'
      else if (filter === 'resolved') statusFilter = '&isResolved=true'
      
      const response = await fetch(
        `http://localhost:3333/scams?page=${page}&limit=20${statusFilter}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setScams(data.scams || [])
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Erro ao buscar denúncias:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (scamId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3333/scams/${scamId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setScams(scams.map(s => 
          s.id === scamId ? { ...s, status: newStatus } : s
        ))
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const handleDelete = async (scamId: string) => {
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

  const openModal = (scamId: string) => {
    setSelectedScamId(scamId)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedScamId(null)
  }

  const handleBulkAction = async (action: 'verify' | 'delete') => {
    if (selectedScams.length === 0) {
      alert('Selecione pelo menos uma denúncia')
      return
    }

    if (action === 'delete' && !confirm(`Excluir ${selectedScams.length} denúncias?`)) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      
      for (const scamId of selectedScams) {
        if (action === 'verify') {
          await handleStatusChange(scamId, 'VERIFIED')
        } else {
          await handleDelete(scamId)
        }
      }
      
      setSelectedScams([])
      fetchScams()
    } catch (error) {
      console.error('Erro na ação em massa:', error)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
      'PENDING': { text: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
      'VERIFIED': { text: 'Verificado', className: 'bg-green-100 text-green-800' },
      'UNVERIFIED': { text: 'Não Verificado', className: 'bg-red-100 text-red-800' },
      'INVESTIGATING': { text: 'Investigando', className: 'bg-blue-100 text-blue-800' }
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
          <p className="mt-4 text-gray-600">Carregando denúncias...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Admin */}
      <div className="bg-red-900 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/admin" className="hover:text-red-200">Admin</Link>
            <span>/</span>
            <span>Gerenciar Denúncias</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gerenciar Denúncias</h1>
              <p className="text-gray-600 mt-1">Revisar e moderar denúncias de golpes</p>
            </div>
            <Link
              href="/admin"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Voltar
            </Link>
          </div>
        </div>

        {/* Aviso de denúncias pendentes */}
        {filter === 'pending' && scams.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <p className="text-yellow-800 font-medium">
                  {scams.length} denúncias aguardando revisão
                </p>
                <p className="text-yellow-700 text-sm mt-1">
                  Clique em "Visualizar" para revisar os detalhes e aprovar/rejeitar
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filtros e Ações em Massa */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
                  filter === 'pending'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pendentes
                {filter !== 'pending' && scams.filter(s => s.status === 'PENDING').length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full px-2 py-0.5">
                    {scams.filter(s => s.status === 'PENDING').length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setFilter('verified')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'verified'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Verificadas
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
            
            {selectedScams.length > 0 && (
              <div className="flex gap-2">
                <span className="text-sm text-gray-600 mr-2">
                  {selectedScams.length} selecionadas
                </span>
                <button
                  onClick={() => handleBulkAction('verify')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Verificar
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Excluir
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabela de Denúncias */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedScams(scams.map(s => s.id))
                      } else {
                        setSelectedScams([])
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Denúncia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Métricas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {scams.map((scam) => (
                <tr 
                  key={scam.id} 
                  className={`hover:bg-gray-50 transition-colors ${
                    scam.status === 'PENDING' ? 'bg-yellow-50' : ''
                  }`}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedScams.includes(scam.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedScams([...selectedScams, scam.id])
                        } else {
                          setSelectedScams(selectedScams.filter(id => id !== scam.id))
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-sm">
                      <button
                        onClick={() => openModal(scam.id)}
                        className="text-gray-900 font-medium hover:text-red-600 text-left"
                      >
                        {scam.title}
                      </button>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {scam.description}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-gray-900">{scam.user.name}</div>
                      <div className="text-gray-500">{scam.user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      {getStatusBadge(scam.status)}
                      {scam.isResolved && (
                        <span className="text-xs text-green-600 font-medium">
                          ✓ Resolvido
                        </span>
                      )}
                      {scam._count.reports > 0 && (
                        <span className="text-xs text-red-600 font-medium">
                          ⚠ {scam._count.reports} reports
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="space-y-1">
                      <div>{scam.views} views</div>
                      <div>{scam._count.comments} comentários</div>
                      <div>{scam._count.likes} curtidas</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(scam.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(scam.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Visualizar
                      </button>
                      <select
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                        value={scam.status}
                        onChange={(e) => handleStatusChange(scam.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="PENDING">Pendente</option>
                        <option value="VERIFIED">Verificado</option>
                        <option value="UNVERIFIED">Não Verificado</option>
                        <option value="INVESTIGATING">Investigando</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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

        {/* Modal de Detalhes */}
        {selectedScamId && (
          <ScamDetailModal
            scamId={selectedScamId}
            isOpen={modalOpen}
            onClose={closeModal}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  )
}