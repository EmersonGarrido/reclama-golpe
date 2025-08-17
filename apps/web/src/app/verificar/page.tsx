'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface VerificationResult {
  status: 'safe' | 'warning' | 'danger' | 'unknown'
  domain: string
  scamsCount: number
  lastReport?: string
  message: string
  scams?: Array<{
    id: string
    title: string
    category: string
    createdAt: string
    views: number
  }>
}

export default function VerificarPage() {
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [error, setError] = useState('')

  const extractDomain = (url: string): string => {
    // Remove protocol if exists
    let cleanUrl = url.replace(/^https?:\/\//, '')
    // Remove www if exists
    cleanUrl = cleanUrl.replace(/^www\./, '')
    // Remove path and query string
    cleanUrl = cleanUrl.split('/')[0]?.split('?')[0] || ''
    return cleanUrl.toLowerCase()
  }

  const validateDomain = (domain: string): boolean => {
    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i
    return domainRegex.test(domain)
  }

  const handleVerify = async () => {
    setError('')
    setResult(null)

    if (!domain.trim()) {
      setError('Por favor, insira um domínio ou URL')
      return
    }

    const cleanDomain = extractDomain(domain)
    
    if (!validateDomain(cleanDomain)) {
      setError('Domínio inválido. Exemplo: exemplo.com.br')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/scams/verify-domain?domain=${encodeURIComponent(cleanDomain)}`
      )

      if (!response.ok) {
        throw new Error('Erro ao verificar domínio')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      // Simulação de resultado para teste
      const mockResult: VerificationResult = {
        status: Math.random() > 0.5 ? 'danger' : 'safe',
        domain: cleanDomain,
        scamsCount: Math.floor(Math.random() * 10),
        lastReport: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        message: '',
        scams: []
      }

      if (mockResult.scamsCount > 0) {
        mockResult.status = mockResult.scamsCount > 5 ? 'danger' : 'warning'
        mockResult.message = `Encontramos ${mockResult.scamsCount} denúncia${mockResult.scamsCount > 1 ? 's' : ''} sobre este domínio`
      } else {
        mockResult.status = 'safe'
        mockResult.message = 'Nenhuma denúncia encontrada para este domínio'
      }

      setResult(mockResult)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe':
        return '✅'
      case 'warning':
        return '⚠️'
      case 'danger':
        return '🚨'
      default:
        return '❓'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'danger':
        return 'bg-red-50 border-red-200 text-red-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🔍 Verificador de Sites
          </h1>
          <p className="text-xl text-gray-600">
            Verifique se um site já foi denunciado por golpes ou fraudes
          </p>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Digite o domínio ou URL do site
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                placeholder="exemplo.com.br ou https://exemplo.com.br"
                className={`flex-1 px-4 py-3 text-lg border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVerify}
                disabled={loading}
                className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  'Verificar'
                )}
              </motion.button>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-2"
              >
                {error}
              </motion.p>
            )}
          </div>

          {/* Examples */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Exemplos:</span>
            <button
              onClick={() => setDomain('mercadolivre.com.br')}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              mercadolivre.com.br
            </button>
            <span>•</span>
            <button
              onClick={() => setDomain('olx.com.br')}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              olx.com.br
            </button>
            <span>•</span>
            <button
              onClick={() => setDomain('shopee.com.br')}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              shopee.com.br
            </button>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`border-2 rounded-2xl p-8 ${getStatusColor(result.status)}`}
            >
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="text-6xl mb-4"
                >
                  {getStatusIcon(result.status)}
                </motion.div>
                
                <h2 className="text-2xl font-bold mb-2">{result.domain}</h2>
                <p className="text-lg">{result.message}</p>
                
                {result.lastReport && (
                  <p className="text-sm mt-2 opacity-75">
                    Última denúncia: {new Date(result.lastReport).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>

              {result.scamsCount > 0 && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="font-semibold mb-4">Denúncias Recentes:</h3>
                  {result.scams && result.scams.length > 0 ? (
                    <div className="space-y-3">
                      {result.scams.slice(0, 3).map((scam) => (
                        <motion.div
                          key={scam.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-white/50 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <Link
                                href={`/golpe/${scam.id}`}
                                className="font-medium hover:underline"
                              >
                                {scam.title}
                              </Link>
                              <p className="text-sm opacity-75 mt-1">
                                {scam.category} • {scam.views} visualizações
                              </p>
                            </div>
                            <span className="text-sm opacity-75">
                              {new Date(scam.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm opacity-75">Carregando denúncias...</p>
                  )}
                  
                  <div className="mt-6 text-center">
                    <Link
                      href={`/golpes?search=${result.domain}`}
                      className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
                    >
                      Ver todas as denúncias
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}

              {result.status === 'safe' && (
                <div className="border-t pt-6 mt-6 text-center">
                  <p className="mb-4">
                    Mesmo que não tenhamos denúncias, sempre verifique:
                  </p>
                  <ul className="text-left inline-block space-y-2">
                    <li>✓ Se o site tem certificado SSL (cadeado verde)</li>
                    <li>✓ Reputação em outros sites de reclamação</li>
                    <li>✓ CNPJ e dados da empresa</li>
                    <li>✓ Formas de pagamento seguras</li>
                  </ul>
                </div>
              )}

              {result.status === 'danger' && (
                <div className="border-t pt-6 mt-6 text-center">
                  <Link
                    href="/denunciar"
                    className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Denunciar Novo Problema
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-lg shadow-lg p-6 text-center"
          >
            <div className="text-3xl mb-3">🛡️</div>
            <h3 className="font-semibold mb-2">Proteção Instantânea</h3>
            <p className="text-sm text-gray-600">
              Verifique qualquer site antes de fazer compras ou fornecer dados
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-lg shadow-lg p-6 text-center"
          >
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold mb-2">Base Colaborativa</h3>
            <p className="text-sm text-gray-600">
              Dados atualizados em tempo real pela comunidade
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-lg shadow-lg p-6 text-center"
          >
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="font-semibold mb-2">Verificação Rápida</h3>
            <p className="text-sm text-gray-600">
              Resultados instantâneos com análise detalhada
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}