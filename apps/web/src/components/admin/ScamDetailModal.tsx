'use client'

import { getApiUrl } from '@/config/api'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ScamDetail {
  id: string
  title: string
  description: string
  category: string
  status: string
  views: number
  createdAt: string
  dateOccurred?: string
  isResolved: boolean
  resolutionNote?: string
  resolutionLinks?: string[]
  scammerName?: string
  scammerWebsite?: string
  scammerPhone?: string
  scammerEmail?: string
  amountLost?: number
  evidence?: string[]
  user: {
    id: string
    name: string
    email: string
    avatar?: string
    createdAt: string
  }
  _count: {
    comments: number
    likes: number
    reports: number
  }
  comments?: any[]
  reports?: any[]
}

interface ScamDetailModalProps {
  scamId: string
  isOpen: boolean
  onClose: () => void
  onStatusChange: (scamId: string, status: string) => void
  onDelete: (scamId: string) => void
}

export default function ScamDetailModal({ 
  scamId, 
  isOpen, 
  onClose, 
  onStatusChange,
  onDelete 
}: ScamDetailModalProps) {
  const [scam, setScam] = useState<ScamDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'reports'>('details')

  useEffect(() => {
    if (isOpen && scamId) {
      fetchScamDetails()
    }
  }, [isOpen, scamId])

  const fetchScamDetails = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(getApiUrl(`scams/${scamId}`), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setScam(data)
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (newStatus: string) => {
    if (scam) {
      setScam({ ...scam, status: newStatus })
      onStatusChange(scamId, newStatus)
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
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
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusInfo.className}`}>
        {statusInfo.text}
      </span>
    )
  }

  const getCategoryBadge = (category: string) => {
    const categoryMap: Record<string, string> = {
      'PHISHING': 'Phishing',
      'FAKE_ECOMMERCE': 'E-commerce Falso',
      'PYRAMID_SCHEME': 'Pirâmide',
      'ROMANCE_SCAM': 'Golpe do Amor',
      'JOB_SCAM': 'Golpe do Emprego',
      'INVESTMENT_FRAUD': 'Fraude de Investimento',
      'LOTTERY_SCAM': 'Golpe da Loteria',
      'TECH_SUPPORT': 'Suporte Falso',
      'CRYPTOCURRENCY': 'Criptomoedas',
      'OTHER': 'Outros'
    }
    
    return (
      <span className="px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800">
        {categoryMap[category] || category}
      </span>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>

        <div className="relative inline-block w-full max-w-4xl overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando detalhes...</p>
            </div>
          ) : scam ? (
            <>
              {/* Header */}
              <div className="bg-red-900 text-white p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{scam.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-red-200">
                      <span>ID: {scam.id.slice(0, 8)}</span>
                      <span>•</span>
                      <span>{formatDate(scam.createdAt)}</span>
                      <span>•</span>
                      <span>{scam.views} visualizações</span>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-white hover:text-red-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-50 border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusBadge(scam.status)}
                    {getCategoryBadge(scam.category)}
                    {scam.isResolved && (
                      <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                        ✓ Resolvido
                      </span>
                    )}
                    {scam._count.reports > 0 && (
                      <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">
                        ⚠ {scam._count.reports} reports
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {scam.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => {
                            handleStatusChange('VERIFIED')
                            alert('Denúncia aprovada e publicada!')
                          }}
                          className="px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                        >
                          ✓ Aprovar
                        </button>
                        <button
                          onClick={() => {
                            handleStatusChange('UNVERIFIED')
                            alert('Denúncia rejeitada!')
                          }}
                          className="px-4 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium"
                        >
                          ✗ Rejeitar
                        </button>
                      </>
                    )}
                    <select
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                      value={scam.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                    >
                      <option value="PENDING">Pendente</option>
                      <option value="VERIFIED">Verificado</option>
                      <option value="UNVERIFIED">Não Verificado</option>
                      <option value="INVESTIGATING">Investigando</option>
                    </select>
                    <button
                      onClick={() => {
                        if (confirm('Tem certeza que deseja excluir esta denúncia?')) {
                          onDelete(scamId)
                          onClose()
                        }
                      }}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 ${
                      activeTab === 'details'
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Detalhes
                  </button>
                  <button
                    onClick={() => setActiveTab('comments')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 ${
                      activeTab === 'comments'
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Comentários ({scam._count.comments})
                  </button>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 ${
                      activeTab === 'reports'
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Reports ({scam._count.reports})
                  </button>
                </nav>
              </div>

              {/* Content */}
              <div className="p-6 max-h-96 overflow-y-auto">
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    {/* Descrição */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Descrição</h3>
                      <p className="text-gray-900 whitespace-pre-wrap">{scam.description}</p>
                    </div>

                    {/* Informações do Denunciante */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Denunciante</h3>
                      <div className="flex items-center gap-4">
                        {scam.user.avatar ? (
                          <Image
                            src={scam.user.avatar}
                            alt={scam.user.name}
                            width={48}
                            height={48}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-semibold">
                              {scam.user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{scam.user.name}</p>
                          <p className="text-sm text-gray-600">{scam.user.email}</p>
                          <p className="text-xs text-gray-500">
                            Membro desde {formatDate(scam.user.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Informações do Golpista */}
                    {(scam.scammerName || scam.scammerWebsite || scam.scammerPhone || scam.scammerEmail) && (
                      <div className="bg-red-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Informações do Golpista</h3>
                        <dl className="grid grid-cols-2 gap-3 text-sm">
                          {scam.scammerName && (
                            <>
                              <dt className="text-gray-600">Nome/Empresa:</dt>
                              <dd className="text-gray-900 font-medium">{scam.scammerName}</dd>
                            </>
                          )}
                          {scam.scammerWebsite && (
                            <>
                              <dt className="text-gray-600">Website:</dt>
                              <dd className="text-red-600 font-medium">{scam.scammerWebsite}</dd>
                            </>
                          )}
                          {scam.scammerPhone && (
                            <>
                              <dt className="text-gray-600">Telefone:</dt>
                              <dd className="text-gray-900">{scam.scammerPhone}</dd>
                            </>
                          )}
                          {scam.scammerEmail && (
                            <>
                              <dt className="text-gray-600">E-mail:</dt>
                              <dd className="text-gray-900">{scam.scammerEmail}</dd>
                            </>
                          )}
                        </dl>
                      </div>
                    )}

                    {/* Detalhes Adicionais */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {scam.amountLost && (
                        <div>
                          <span className="text-gray-600">Valor perdido:</span>
                          <span className="ml-2 font-medium text-red-600">
                            {formatCurrency(scam.amountLost)}
                          </span>
                        </div>
                      )}
                      {scam.dateOccurred && (
                        <div>
                          <span className="text-gray-600">Data do golpe:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {formatDate(scam.dateOccurred)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Evidências */}
                    {scam.evidence && scam.evidence.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Evidências</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {scam.evidence.map((file, index) => {
                            const isImage = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(file)
                            const isPDF = /\.pdf$/i.test(file)
                            
                            return (
                              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                {isImage ? (
                                  <div className="relative group">
                                    <img
                                      src={file.startsWith('http') ? file : getApiUrl(`uploads/${file}`)}
                                      alt={`Evidência ${index + 1}`}
                                      className="w-full h-48 object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.onerror = null
                                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f3f4f6"/%3E%3Ctext x="50" y="50" font-family="Arial" font-size="12" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle"%3EImagem não disponível%3C/text%3E%3C/svg%3E'
                                      }}
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                                      <a
                                        href={file.startsWith('http') ? file : getApiUrl(`uploads/${file}`)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                      >
                                        Ver em tamanho real
                                      </a>
                                    </div>
                                    <div className="p-2 bg-gray-50">
                                      <p className="text-xs text-gray-600 truncate">📷 {file.split('/').pop()}</p>
                                    </div>
                                  </div>
                                ) : isPDF ? (
                                  <div className="p-4 bg-gray-50 text-center">
                                    <svg className="w-16 h-16 mx-auto mb-2 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10,19L8,14H10L11,17L12,14H14L12,19H10Z"/>
                                    </svg>
                                    <a
                                      href={file.startsWith('http') ? file : getApiUrl(`uploads/${file}`)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
                                    >
                                      {file.split('/').pop()}
                                    </a>
                                    <p className="text-xs text-gray-500 mt-1">Documento PDF</p>
                                  </div>
                                ) : (
                                  <div className="p-4 bg-gray-50 text-center">
                                    <svg className="w-16 h-16 mx-auto mb-2 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z"/>
                                    </svg>
                                    <a
                                      href={file.startsWith('http') ? file : getApiUrl(`uploads/${file}`)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
                                    >
                                      {file.split('/').pop()}
                                    </a>
                                    <p className="text-xs text-gray-500 mt-1">Arquivo anexado</p>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Resolução */}
                    {scam.isResolved && scam.resolutionNote && (
                      <div className="bg-green-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-green-800 mb-2">Resolução</h3>
                        <p className="text-green-700">{scam.resolutionNote}</p>
                        {scam.resolutionLinks && scam.resolutionLinks.length > 0 && (
                          <div className="mt-2">
                            {scam.resolutionLinks.map((link, index) => (
                              <a
                                key={index}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-700 text-sm underline block"
                              >
                                🔗 {link}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'comments' && (
                  <div className="space-y-4">
                    {scam.comments && scam.comments.length > 0 ? (
                      scam.comments.map((comment: any) => (
                        <div key={comment.id} className="border-b pb-4 last:border-0">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xs font-semibold text-gray-600">
                                {comment.user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{comment.user.name}</span>
                                <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                              </div>
                              <p className="text-gray-700 text-sm">{comment.content}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">Nenhum comentário ainda</p>
                    )}
                  </div>
                )}

                {activeTab === 'reports' && (
                  <div className="space-y-4">
                    {scam.reports && scam.reports.length > 0 ? (
                      scam.reports.map((report: any) => (
                        <div key={report.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <span className="font-medium text-sm">{report.user.name}</span>
                              <span className="text-xs text-gray-500 ml-2">{formatDate(report.createdAt)}</span>
                            </div>
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                              {report.reason}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm">{report.details}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">Nenhum report registrado</p>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-between">
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>👍 {scam._count.likes} curtidas</span>
                  <span>💬 {scam._count.comments} comentários</span>
                  <span>⚠️ {scam._count.reports} reports</span>
                </div>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Fechar
                </button>
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-500">Erro ao carregar detalhes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}