'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isAuthenticated, getUser } from '@/lib/auth'

interface Report {
  id: string
  reason: string
  details: string
  status: string
  createdAt: string
  scam: {
    id: string
    title: string
    status: string
  }
  user: {
    id: string
    name: string
    email: string
  }
}

export default function AdminReportsPage() {
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed' | 'resolved'>('pending')
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login?returnUrl=/admin/reports')
      return
    }

    const userData = getUser()
    if (!userData?.isAdmin) {
      router.push('/painel')
      return
    }

    fetchReports()
  }, [router, filter])

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3333/admin/reports', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        let filteredReports = data
        
        if (filter !== 'all') {
          filteredReports = data.filter((r: Report) => 
            r.status.toLowerCase() === filter
          )
        }
        
        setReports(filteredReports)
      }
    } catch (error) {
      console.error('Erro ao buscar reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReportAction = async (reportId: string, action: 'resolve' | 'dismiss' | 'block-scam') => {
    try {
      const token = localStorage.getItem('token')
      const report = reports.find(r => r.id === reportId)
      
      if (!report) return

      // Atualizar status do report
      const response = await fetch(`http://localhost:3333/reports/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: action === 'resolve' ? 'RESOLVED' : 'DISMISSED'
        })
      })

      if (response.ok) {
        // Se bloquear a denúncia, atualizar seu status
        if (action === 'block-scam') {
          await fetch(`http://localhost:3333/scams/${report.scam.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              status: 'UNVERIFIED'
            })
          })
        }
        
        fetchReports()
        setModalOpen(false)
      }
    } catch (error) {
      console.error('Erro ao processar report:', error)
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

  const getReasonBadge = (reason: string) => {
    const reasonMap: Record<string, { text: string; className: string }> = {
      'FALSE_INFORMATION': { text: 'Informação Falsa', className: 'bg-yellow-100 text-yellow-800' },
      'SPAM': { text: 'Spam', className: 'bg-orange-100 text-orange-800' },
      'INAPPROPRIATE_CONTENT': { text: 'Conteúdo Inapropriado', className: 'bg-red-100 text-red-800' },
      'DUPLICATE': { text: 'Duplicado', className: 'bg-blue-100 text-blue-800' },
      'OTHER': { text: 'Outro', className: 'bg-gray-100 text-gray-800' }
    }
    
    const reasonInfo = reasonMap[reason] || { text: reason, className: 'bg-gray-100 text-gray-800' }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${reasonInfo.className}`}>
        {reasonInfo.text}
      </span>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
      'PENDING': { text: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
      'REVIEWED': { text: 'Revisado', className: 'bg-blue-100 text-blue-800' },
      'RESOLVED': { text: 'Resolvido', className: 'bg-green-100 text-green-800' },
      'DISMISSED': { text: 'Descartado', className: 'bg-gray-100 text-gray-800' }
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
          <p className="mt-4 text-gray-600">Carregando reports...</p>
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
            <span>Gerenciar Reports</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gerenciar Reports</h1>
              <p className="text-gray-600 mt-1">Revisar denúncias reportadas pelos usuários</p>
            </div>
            <Link
              href="/admin"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Voltar
            </Link>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reports.length}
                </p>
              </div>
              <div className="bg-gray-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {reports.filter(r => r.status === 'PENDING').length}
                </p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Resolvidos</p>
                <p className="text-2xl font-bold text-green-600">
                  {reports.filter(r => r.status === 'RESOLVED').length}
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Descartados</p>
                <p className="text-2xl font-bold text-gray-600">
                  {reports.filter(r => r.status === 'DISMISSED').length}
                </p>
              </div>
              <div className="bg-gray-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
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
              Todos ({reports.length})
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
              onClick={() => setFilter('reviewed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'reviewed'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Revisados
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'resolved'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Resolvidos
            </button>
          </div>
        </div>

        {/* Lista de Reports */}
        {reports.length > 0 ? (
          <div className="space-y-4">
            {reports.map((report) => (
              <div 
                key={report.id} 
                className={`bg-white rounded-lg shadow-sm p-6 ${
                  report.status === 'PENDING' ? 'border-l-4 border-yellow-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Cabeçalho do Report */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getReasonBadge(report.reason)}
                          {getStatusBadge(report.status)}
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          Report sobre: "{report.scam.title}"
                        </h3>
                        
                        <p className="text-gray-700 mb-3">
                          {report.details}
                        </p>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Reportado por: {report.user.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>{report.user.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{formatDate(report.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    {report.status === 'PENDING' && (
                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                        <Link
                          href={`/golpe/${report.scam.id}`}
                          target="_blank"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Ver Denúncia
                        </Link>
                        <button
                          onClick={() => handleReportAction(report.id, 'block-scam')}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                        >
                          Bloquear Denúncia
                        </button>
                        <button
                          onClick={() => handleReportAction(report.id, 'dismiss')}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                        >
                          Descartar Report
                        </button>
                        <button
                          onClick={() => handleReportAction(report.id, 'resolve')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                        >
                          Marcar como Resolvido
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
            <p className="text-gray-500">
              {filter === 'pending' 
                ? 'Nenhum report pendente'
                : 'Nenhum report encontrado'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}