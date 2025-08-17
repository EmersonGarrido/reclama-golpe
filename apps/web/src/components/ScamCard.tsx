import Link from 'next/link'
import { Scam } from '@/types/scam'

interface ScamCardProps {
  scam: Scam
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

const statusColors: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-800',
  VERIFIED: 'bg-green-100 text-green-800',
  UNVERIFIED: 'bg-red-100 text-red-800',
  RESOLVED: 'bg-blue-100 text-blue-800',
}

const statusLabels: Record<string, string> = {
  PENDING: 'Pendente',
  VERIFIED: 'Verificado',
  UNVERIFIED: 'Não Verificado',
  RESOLVED: 'Resolvido',
}

export default function ScamCard({ scam }: ScamCardProps) {
  const formattedDate = new Date(scam.createdAt).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                categoryColors[scam.category] || categoryColors.OTHER
              }`}
            >
              {categoryLabels[scam.category] || 'Outros'}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                statusColors[scam.status] || statusColors.PENDING
              }`}
            >
              {statusLabels[scam.status] || 'Pendente'}
            </span>
          </div>
          {scam.amountLost && (
            <div className="bg-red-50 px-3 py-1 rounded-full">
              <span className="text-red-600 font-bold text-sm">
                R$ {scam.amountLost.toLocaleString('pt-BR')}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <Link href={`/golpe/${scam.id}`}>
          <h3 className="font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors mb-3 line-clamp-2 min-h-[3.5rem]">
            {scam.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-3 min-h-[4.5rem] leading-relaxed">
          {scam.description}
        </p>
      </div>

      {/* Footer - Always at bottom */}
      <div className="mt-auto p-6 pt-4 border-t border-gray-100">
        {/* Stats */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm font-medium">{scam._count.likes}</span>
            </span>
            <span className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm font-medium">{scam._count.comments}</span>
            </span>
            <span className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-sm font-medium">{scam.views}</span>
            </span>
          </div>
        </div>
        
        {/* User and Date */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-medium">{scam.user.name}</span>
          </div>
          <span className="font-medium">{formattedDate}</span>
        </div>
      </div>
    </div>
  )
}