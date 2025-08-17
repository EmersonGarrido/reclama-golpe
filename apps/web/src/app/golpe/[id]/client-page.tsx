'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import CommentSection from '@/components/CommentSection'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { isAuthenticated, getToken, getCurrentUser } from '@/lib/auth'
import { ResolutionSection } from '@/components/scam/resolution-section'

const categoryColors: Record<string, string> = {
  PHISHING: 'bg-blue-100 text-blue-800 border-blue-200',
  FAKE_ECOMMERCE: 'bg-purple-100 text-purple-800 border-purple-200',
  PYRAMID_SCHEME: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  TECH_SUPPORT: 'bg-green-100 text-green-800 border-green-200',
  ROMANCE_SCAM: 'bg-pink-100 text-pink-800 border-pink-200',
  JOB_SCAM: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  LOTTERY_SCAM: 'bg-orange-100 text-orange-800 border-orange-200',
  CRYPTOCURRENCY: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  INVESTMENT_FRAUD: 'bg-red-100 text-red-800 border-red-200',
  OTHER: 'bg-gray-100 text-gray-800 border-gray-200',
}

const categoryLabels: Record<string, string> = {
  PHISHING: 'Phishing',
  FAKE_ECOMMERCE: 'E-commerce Falso',
  PYRAMID_SCHEME: 'Pirâmide',
  TECH_SUPPORT: 'Suporte Técnico',
  ROMANCE_SCAM: 'Romance',
  JOB_SCAM: 'Trabalho',
  LOTTERY_SCAM: 'Loteria',
  CRYPTOCURRENCY: 'Criptomoedas',
  INVESTMENT_FRAUD: 'Investimento',
  OTHER: 'Outros',
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-800 border-gray-200',
  VERIFIED: 'bg-green-100 text-green-800 border-green-200',
  UNVERIFIED: 'bg-red-100 text-red-800 border-red-200',
  RESOLVED: 'bg-blue-100 text-blue-800 border-blue-200',
}

const statusLabels: Record<string, string> = {
  PENDING: '⏳ Pendente',
  VERIFIED: '✅ Verificado',
  UNVERIFIED: '❌ Não Verificado',
  RESOLVED: '✔️ Resolvido',
}

interface ScamDetailClientProps {
  scam: any
}

export default function ScamDetailClient({ scam: initialScam }: ScamDetailClientProps) {
  const router = useRouter()
  const [scam, setScam] = useState(initialScam)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(scam._count.likes)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageError, setImageError] = useState<Record<string, boolean>>({})
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [shareMessage, setShareMessage] = useState('')
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportData, setReportData] = useState({
    reason: '',
    description: '',
    email: ''
  })
  const [reportLoading, setReportLoading] = useState(false)

  useEffect(() => {
    setIsLoggedIn(isAuthenticated())
    const user = getCurrentUser()
    setCurrentUser(user)
  }, [])

  const formattedDate = new Date(scam.createdAt).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const handleLike = async () => {
    if (!isLoggedIn) {
      const confirm = window.confirm('Você precisa estar logado para curtir. Deseja fazer login?')
      if (confirm) {
        router.push('/login?returnUrl=' + window.location.pathname)
      }
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/scams/${scam.id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setLiked(data.liked)
        setLikeCount(data.count)
      }
    } catch (error) {
      console.error('Erro ao curtir:', error)
    }
  }

  const handleShare = async () => {
    const shareUrl = window.location.href
    const shareText = `Denúncia: ${scam.title} - Reclama Golpe`
    
    try {
      // Tenta usar a API nativa de compartilhamento
      if (navigator.share && window.isSecureContext) {
        await navigator.share({
          title: 'Reclama Golpe',
          text: shareText,
          url: shareUrl,
        })
      } else {
        // Fallback - copia para clipboard
        await navigator.clipboard.writeText(shareUrl)
        setShareMessage('Link copiado!')
        setTimeout(() => setShareMessage(''), 3000)
      }
    } catch (err) {
      // Se falhar, tenta copiar para clipboard
      try {
        await navigator.clipboard.writeText(shareUrl)
        setShareMessage('Link copiado!')
        setTimeout(() => setShareMessage(''), 3000)
      } catch (clipboardErr) {
        console.error('Erro ao compartilhar:', clipboardErr)
      }
    }
  }

  const handleReport = async () => {
    if (!reportData.reason || !reportData.description) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    setReportLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/scams/${scam.id}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData)
      })

      if (response.ok) {
        const result = await response.json()
        alert(result.message || 'Reporte enviado com sucesso!')
        setShowReportModal(false)
        setReportData({ reason: '', description: '', email: '' })
      } else {
        alert('Erro ao enviar reporte. Tente novamente.')
      }
    } catch (error) {
      console.error('Erro ao reportar:', error)
      alert('Erro ao enviar reporte. Tente novamente.')
    } finally {
      setReportLoading(false)
    }
  }

  // Filter evidence for images only
  const imageEvidence = scam.evidence?.filter((file: string) => 
    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
  ) || []

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <motion.nav 
          className="mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-primary-600 transition-colors">
                Início
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/golpes" className="hover:text-primary-600 transition-colors">
                Golpes
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Detalhes</li>
          </ol>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Card Principal */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Header Section */}
              <div className="bg-gray-50 border-b border-gray-200 p-8">
                <motion.div 
                  className="flex flex-wrap items-center gap-3 mb-4"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      categoryColors[scam.category] || categoryColors.OTHER
                    }`}
                  >
                    {categoryLabels[scam.category] || 'Outros'}
                  </span>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      statusColors[scam.status] || statusColors.PENDING
                    }`}
                  >
                    {statusLabels[scam.status] || 'Pendente'}
                  </span>
                </motion.div>

                <motion.h1 
                  className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900"
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {scam.title}
                </motion.h1>

                <motion.div 
                  className="flex flex-wrap items-center gap-4 text-sm text-gray-600"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {scam.user.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formattedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {scam.views} visualizações
                  </span>
                </motion.div>
              </div>

              <div className="p-8">
                {/* Description */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Descrição do Golpe
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">
                    {scam.description}
                  </p>
                </motion.div>

                {/* Evidence Gallery */}
                {imageEvidence.length > 0 && (
                  <motion.div 
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <h3 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Evidências Visuais
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {imageEvidence.map((image: string, index: number) => (
                        <motion.div
                          key={index}
                          className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setSelectedImage(image)}
                        >
                          {!imageError[image] ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/uploads/${image}`}
                              alt={`Evidência ${index + 1}`}
                              className="w-full h-40 object-cover"
                              onError={() => setImageError(prev => ({ ...prev, [image]: true }))}
                            />
                          ) : (
                            <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                            <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Scammer Details */}
                {(scam.scammerName || scam.scammerWebsite || scam.scammerPhone || scam.scammerEmail) && (
                  <motion.div 
                    className="bg-gradient-to-r from-red-50 to-orange-50 border border-gray-300 rounded-xl p-6 mb-8 shadow-sm"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <h3 className="text-xl font-bold mb-4 text-red-900 flex items-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Informações do Golpista
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {scam.scammerName && (
                        <motion.div 
                          className="bg-white rounded-lg p-3"
                          whileHover={{ scale: 1.02 }}
                        >
                          <dt className="text-sm font-medium text-gray-600 mb-1">Nome/Empresa</dt>
                          <dd className="text-gray-900 font-semibold">{scam.scammerName}</dd>
                        </motion.div>
                      )}
                      {scam.scammerWebsite && (
                        <motion.div 
                          className="bg-white rounded-lg p-3"
                          whileHover={{ scale: 1.02 }}
                        >
                          <dt className="text-sm font-medium text-gray-600 mb-1">Website</dt>
                          <dd className="text-red-600 font-semibold break-all">{scam.scammerWebsite}</dd>
                        </motion.div>
                      )}
                      {scam.scammerPhone && (
                        <motion.div 
                          className="bg-white rounded-lg p-3"
                          whileHover={{ scale: 1.02 }}
                        >
                          <dt className="text-sm font-medium text-gray-600 mb-1">Telefone</dt>
                          <dd className="text-gray-900 font-semibold">{scam.scammerPhone}</dd>
                        </motion.div>
                      )}
                      {scam.scammerEmail && (
                        <motion.div 
                          className="bg-white rounded-lg p-3"
                          whileHover={{ scale: 1.02 }}
                        >
                          <dt className="text-sm font-medium text-gray-600 mb-1">Email</dt>
                          <dd className="text-gray-900 font-semibold break-all">{scam.scammerEmail}</dd>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Actions */}
                <motion.div 
                  className="flex flex-wrap items-center gap-4 border-t pt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <motion.button 
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      liked 
                        ? 'bg-red-100 text-red-600 border-2 border-red-300' 
                        : 'bg-gray-100 text-gray-600 border-2 border-gray-300 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="font-medium">{likeCount} Curtidas</span>
                  </motion.button>

                  <div className="relative">
                    <motion.button 
                      onClick={handleShare}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-600 border-2 border-blue-300 hover:bg-blue-200 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 2.943-9.543 7m9.543-7v1.5m0 5.5v1.5m4.5-1.5h1.5m-13.5 0H3" />
                      </svg>
                      <span className="font-medium">Compartilhar</span>
                    </motion.button>
                    {shareMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap"
                      >
                        {shareMessage}
                      </motion.div>
                    )}
                  </div>

                  <motion.button 
                    onClick={() => setShowReportModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 border-2 border-gray-300 hover:bg-red-100 hover:text-red-600 hover:border-red-300 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Reportar</span>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>

            {/* Resolution Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95 }}
              className="mt-6"
            >
              <ResolutionSection 
                scam={scam}
                isOwner={currentUser?.id === scam.userId}
                onResolutionUpdate={async () => {
                  // Recarregar dados do golpe
                  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/scams/${scam.id}`)
                  if (response.ok) {
                    const updatedScam = await response.json()
                    setScam(updatedScam)
                  }
                }}
              />
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <CommentSection 
                scamId={scam.id} 
                initialComments={scam.comments || []}
                commentCount={scam._count.comments}
              />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Card */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Estatísticas
              </h3>
              <div className="space-y-4">
                <motion.div 
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="text-gray-600 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Visualizações
                  </span>
                  <span className="font-bold text-lg">{scam.views}</span>
                </motion.div>

                <motion.div 
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="text-gray-600 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Curtidas
                  </span>
                  <span className="font-bold text-lg">{likeCount}</span>
                </motion.div>

                <motion.div 
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="text-gray-600 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Comentários
                  </span>
                  <span className="font-bold text-lg">{scam._count.comments}</span>
                </motion.div>

                {scam.amountLost && (
                  <motion.div 
                    className="flex justify-between items-center p-3 bg-red-50 rounded-lg border-2 border-red-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="text-red-700 flex items-center gap-2 font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Prejuízo
                    </span>
                    <span className="font-bold text-xl text-red-600">
                      R$ {scam.amountLost.toLocaleString('pt-BR')}
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Safety Tips */}
            <motion.div 
              className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-bold text-xl mb-4 text-yellow-900 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Dicas de Segurança
              </h3>
              <ul className="space-y-3 text-sm text-yellow-800">
                {[
                  'Sempre verifique a URL e o certificado SSL dos sites',
                  'Desconfie de ofertas muito boas para ser verdade',
                  'Nunca forneça senhas ou dados bancários por email ou telefone',
                  'Pesquise sobre a empresa antes de fazer qualquer pagamento'
                ].map((tip, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <span className="text-yellow-600 mr-2">✓</span>
                    <span>{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Report Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Link
                href="/denunciar"
                className="block w-full bg-gradient-to-r from-red-600 to-red-700 text-white text-center px-6 py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 font-bold shadow-lg"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Denunciar Outro Golpe
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/uploads/${selectedImage}`}
                alt="Evidência ampliada"
                className="w-full h-full object-contain rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReportModal(false)}
          >
            <motion.div
              className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Reportar Denúncia
                </h2>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo do Reporte <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={reportData.reason}
                    onChange={(e) => setReportData({ ...reportData, reason: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Selecione um motivo</option>
                    <option value="informacao_falsa">Informação Falsa</option>
                    <option value="spam">Spam</option>
                    <option value="conteudo_ofensivo">Conteúdo Ofensivo</option>
                    <option value="dados_pessoais">Exposição de Dados Pessoais</option>
                    <option value="duplicado">Denúncia Duplicada</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={reportData.description}
                    onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Explique o motivo do seu reporte..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seu E-mail (opcional)
                  </label>
                  <input
                    type="email"
                    value={reportData.email}
                    onChange={(e) => setReportData({ ...reportData, email: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Para receber atualizações sobre o reporte"
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Atenção:</strong> Reportes falsos ou abusivos podem resultar em penalidades.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReport}
                  disabled={reportLoading || !reportData.reason || !reportData.description}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {reportLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Enviar Reporte
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}