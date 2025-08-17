'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface Category {
  id: string
  name: string
  description: string
  icon: string
  tips: string[]
  riskLevel: string
}

const iconComponents: Record<string, React.ReactNode> = {
  '📧': (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  '🛒': (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5m5.5-5v5a1 1 0 01-1 1H6a1 1 0 01-1-1v-5z" />
    </svg>
  ),
  '💬': (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  '💰': (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  '🔒': (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  '❤️': (
    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  ),
  '💻': (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  '📄': (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  '₿': (
    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.94 12.38c-1.41 5.66-7.15 9.11-12.8 7.7S2.03 12.94 3.44 7.28 10.59-1.83 16.24-.42s9.11 7.15 7.7 12.8zM16.56 9.8a2.35 2.35 0 0 0-1.59-2.95l.49-2.46-.96-.24-.48 2.4a25.6 25.6 0 0 0-.77-.17l.48-2.43-.96-.24-.49 2.46c-.21-.05-.42-.09-.63-.13l-1.33-.33-.26 1.02s.72.17.7.18c.39.1.46.35.45.55l-.45 2.25c.03 0 .06.02.1.03l-.1-.02-.62 3.13c-.05.12-.17.29-.44.22.01.01-.7-.18-.7-.18L8.4 14.2l1.25.31c.23.06.46.12.68.18l-.49 2.48.96.24.49-2.46c.26.07.52.14.77.2l-.49 2.45.96.24.49-2.48c2.01.38 3.52.23 4.16-1.6.51-1.48-.03-2.33-1.1-2.89.78-.18 1.37-.69 1.52-1.75zm-2.72 3.82c-.36 1.45-2.8.67-3.59.47l.64-2.56c.79.2 3.33.59 2.95 2.09zm.36-3.84c-.33 1.32-2.37.65-3.03.48l.58-2.32c.66.17 2.8.48 2.45 1.84z"/>
    </svg>
  ),
  '🎣': (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  default: (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )
}

const getRiskLevelColor = (level: string) => {
  switch (level) {
    case 'CRITICAL': return 'bg-red-500'
    case 'HIGH': return 'bg-orange-500'
    case 'MEDIUM': return 'bg-yellow-500'
    default: return 'bg-blue-500'
  }
}

export default function DicasClient() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const emergencyContacts = [
    { 
      name: 'Polícia', 
      number: '190', 
      description: 'Emergências e crimes em andamento',
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    { 
      name: 'Delegacia Eletrônica', 
      number: 'Online', 
      description: 'Registro de boletim de ocorrência',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      name: 'PROCON', 
      number: '151', 
      description: 'Defesa do consumidor',
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      name: 'Banco Central', 
      number: '145', 
      description: 'Denúncias sobre instituições financeiras',
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      )
    },
    { 
      name: 'Anatel', 
      number: '1331', 
      description: 'Problemas com telecomunicações',
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    },
  ]

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/categories`)
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  const CategoryCard = ({ category, index }: { category: Category; index: number }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <motion.div 
            className={`w-16 h-16 rounded-xl ${getRiskLevelColor(category.riskLevel)} flex items-center justify-center shadow-lg`}
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            {iconComponents[category.icon] || iconComponents.default}
          </motion.div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{category.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
          </div>
          <motion.div
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              category.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-800' :
              category.riskLevel === 'HIGH' ? 'bg-orange-100 text-orange-800' :
              category.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            {category.riskLevel === 'CRITICAL' ? '🔴 Crítico' :
             category.riskLevel === 'HIGH' ? '🟠 Alto' :
             category.riskLevel === 'MEDIUM' ? '🟡 Médio' : '🔵 Baixo'}
          </motion.div>
        </div>

        <AnimatePresence>
          {selectedCategory === category.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-100 pt-4 mt-4"
            >
              <ul className="space-y-3">
                {category.tips.map((tip, tipIndex) => (
                  <motion.li 
                    key={tipIndex} 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: tipIndex * 0.1 }}
                  >
                    <motion.div
                      className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0"
                      whileHover={{ scale: 1.2 }}
                    >
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                    <span className="text-gray-700 text-sm leading-relaxed">{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>{selectedCategory === category.id ? 'Ver Menos' : 'Ver Dicas'}</span>
          <motion.svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            animate={{ rotate: selectedCategory === category.id ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.button>
      </div>
    </motion.div>
  )

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h1 
            className="text-5xl font-bold text-gray-900 mb-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            🛡️ Dicas de Segurança
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Proteja-se contra golpes online com estas dicas essenciais da nossa comunidade
          </motion.p>
        </motion.div>

        {/* Alerta Principal */}
        <motion.div 
          className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-8 mb-12 shadow-lg"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-start gap-4">
            <motion.div
              className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
              </svg>
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-red-900 mb-3">
                🥇 Regra de Ouro da Segurança Online
              </h2>
              <p className="text-red-800 text-lg leading-relaxed">
                <strong>Na dúvida, não clique, não pague, não forneça dados.</strong> É melhor 
                perder uma oportunidade do que cair em um golpe. Empresas legítimas sempre 
                oferecem formas seguras de verificar a autenticidade de suas comunicações.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div 
                key={i} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="animate-pulse">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Categories Grid */}
        {!loading && categories.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {categories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && categories.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma dica disponível</h3>
            <p className="text-gray-600 mb-6">Estamos trabalhando para trazer mais conteúdo de segurança</p>
          </motion.div>
        )}

        {/* O Que Fazer Se Você Foi Vítima */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.h2 
            className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center"
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </motion.div>
            O Que Fazer Se Você Foi Vítima de um Golpe
          </motion.h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <h3 className="font-bold text-xl mb-4 text-gray-900">🚨 Ações Imediatas:</h3>
              <ol className="space-y-4">
                {[
                  'Registre um Boletim de Ocorrência (pode ser online)',
                  'Notifique seu banco imediatamente se houve transferência',
                  'Tire prints e guarde todas as provas (conversas, sites, etc)',
                  'Troque todas as suas senhas se dados foram comprometidos',
                  'Monitore seu CPF por possíveis fraudes'
                ].map((action, index) => (
                  <motion.li 
                    key={index} 
                    className="flex gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                  >
                    <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{action}</span>
                  </motion.li>
                ))}
              </ol>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <h3 className="font-bold text-xl mb-4 text-gray-900">📞 Contatos de Emergência:</h3>
              <div className="space-y-3">
                {emergencyContacts.map((contact, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      {contact.icon}
                      <div>
                        <div className="font-semibold text-gray-900">{contact.name}</div>
                        <div className="text-sm text-gray-600">{contact.description}</div>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-red-600">{contact.number}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Recursos Úteis */}
        <motion.div 
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-8 border border-blue-200"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <motion.h2 
            className="text-3xl font-bold text-gray-900 mb-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            🔗 Recursos e Sites Úteis
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { title: 'Consumidor.gov.br', desc: 'Portal oficial para reclamações', url: 'https://www.consumidor.gov.br' },
              { title: 'Reclame Aqui', desc: 'Verifique reputação de empresas', url: 'https://www.reclameaqui.com.br' },
              { title: 'Banco Central', desc: 'Consulte instituições autorizadas', url: 'https://www.bcb.gov.br' }
            ].map((resource, index) => (
              <motion.a 
                key={index}
                href={resource.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-6 rounded-xl hover:shadow-lg transition-all duration-300 block"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="font-bold text-lg mb-2 text-gray-900">{resource.title}</h3>
                <p className="text-gray-600">{resource.desc}</p>
                <div className="mt-3 flex items-center text-blue-600 font-medium">
                  <span>Visitar site</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.p 
            className="text-gray-600 mb-6 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Conhece alguém que foi vítima de golpe? Compartilhe sua experiência!
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/denunciar"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-semibold shadow-lg hover:shadow-xl text-lg"
            >
              <motion.svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </motion.svg>
              Denunciar um Golpe
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}