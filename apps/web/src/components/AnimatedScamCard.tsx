'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Scam } from '@/types/scam'

interface AnimatedScamCardProps {
  scam: Scam
  index?: number
}

const categoryColors: Record<string, string> = {
  PHISHING: 'bg-blue-100 text-blue-800',
  FAKE_ECOMMERCE: 'bg-purple-100 text-purple-800',
  PYRAMID_SCHEME: 'bg-yellow-100 text-yellow-800',
  TECH_SUPPORT: 'bg-green-100 text-green-800',
  ROMANCE_SCAM: 'bg-pink-100 text-pink-800',
  JOB_SCAM: 'bg-indigo-100 text-indigo-800',
  LOTTERY_SCAM: 'bg-orange-100 text-orange-800',
  CRYPTOCURRENCY: 'bg-cyan-100 text-cyan-800',
  INVESTMENT_FRAUD: 'bg-red-100 text-red-800',
  OTHER: 'bg-gray-100 text-gray-800',
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

export default function AnimatedScamCard({ scam, index = 0 }: AnimatedScamCardProps) {
  const formattedDate = new Date(scam.createdAt).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Link href={`/golpe/${scam.id}`} className="block h-full">
        <motion.div 
          className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 p-6 h-full flex flex-col border border-gray-100"
          whileHover={{ y: -4 }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: index * 0.1 + 0.2 }}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                categoryColors[scam.category] || categoryColors.OTHER
              }`}
            >
              {categoryLabels[scam.category] || 'Outros'}
            </motion.span>
            <span className="text-sm text-gray-500">{formattedDate}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {scam.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-3 flex-grow mb-4">
            {scam.description}
          </p>

          {/* Scammer Info */}
          {scam.scammerWebsite && (
            <motion.div 
              className="text-xs text-red-600 mb-3 flex items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="truncate">{scam.scammerWebsite}</span>
            </motion.div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <motion.span 
                className="flex items-center gap-1"
                whileHover={{ scale: 1.1 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {scam.views}
              </motion.span>
              <motion.span 
                className="flex items-center gap-1"
                whileHover={{ scale: 1.1 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {scam._count.comments}
              </motion.span>
              <motion.span 
                className="flex items-center gap-1"
                whileHover={{ scale: 1.1 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {scam._count.likes}
              </motion.span>
            </div>
            <span>Por {scam.user.name}</span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}