'use client'

import { getApiUrl } from '@/config/api'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Stats {
  totalUsers: number
  totalScams: number
  pendingScams: number
  verifiedScams: number
  resolvedScams: number
  totalComments: number
  totalReports: number
  growthRate: {
    users: number
    scams: number
    comments: number
  }
  topCategories: Array<{
    name: string
    count: number
    percentage: number
  }>
  dailyActivity: Array<{
    date: string
    scams: number
    users: number
    comments: number
  }>
  userEngagement: {
    activeUsers: number
    avgScamsPerUser: number
    avgCommentsPerUser: number
  }
}

export default function AdminEstatisticasPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const router = useRouter()

  useEffect(() => {
    checkAdminAndFetchStats()
  }, [timeRange])

  const checkAdminAndFetchStats = async () => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (!token || !user) {
      router.push('/login')
      return
    }

    const userData = JSON.parse(user)
    if (!userData.isAdmin) {
      router.push('/')
      return
    }

    await fetchStats()
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(getApiUrl('admin/stats'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        
        // Simular dados adicionais para visualização
        const enrichedStats: Stats = {
          ...data,
          growthRate: {
            users: 15.3,
            scams: 8.7,
            comments: 22.1
          },
          topCategories: [
            { name: 'E-commerce Falso', count: 45, percentage: 35 },
            { name: 'Phishing', count: 38, percentage: 29 },
            { name: 'Pirâmide', count: 24, percentage: 18 },
            { name: 'Criptomoedas', count: 15, percentage: 12 },
            { name: 'Outros', count: 8, percentage: 6 }
          ],
          dailyActivity: generateDailyActivity(),
          userEngagement: {
            activeUsers: Math.floor(data.totalUsers * 0.65),
            avgScamsPerUser: (data.totalScams / data.totalUsers).toFixed(1),
            avgCommentsPerUser: (data.totalComments / data.totalUsers).toFixed(1)
          }
        }
        
        setStats(enrichedStats)
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateDailyActivity = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365
    const activity = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      activity.push({
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        scams: Math.floor(Math.random() * 10) + 1,
        users: Math.floor(Math.random() * 5) + 1,
        comments: Math.floor(Math.random() * 20) + 5
      })
    }
    
    return activity
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
    return num.toString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando estatísticas...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return <div>Erro ao carregar estatísticas</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Estatísticas do Sistema</h1>
              <p className="text-gray-600 mt-1">
                Análise detalhada do desempenho e engajamento da plataforma
              </p>
            </div>
            <div className="flex gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option>
                <option value="1y">Último ano</option>
              </select>
              <Link
                href="/admin"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Voltar ao Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Cards Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Usuários</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalUsers)}</p>
                <p className="text-sm text-green-600 mt-2">
                  ↑ {stats.growthRate.users}% este mês
                </p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Denúncias</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalScams)}</p>
                <p className="text-sm text-green-600 mt-2">
                  ↑ {stats.growthRate.scams}% este mês
                </p>
              </div>
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Resolução</p>
                <p className="text-3xl font-bold text-gray-900">
                  {((stats.resolvedScams / stats.totalScams) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {stats.resolvedScams} resolvidos
                </p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Engajamento</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalComments)}</p>
                <p className="text-sm text-green-600 mt-2">
                  ↑ {stats.growthRate.comments}% este mês
                </p>
              </div>
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de Atividade */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Atividade Diária</h2>
          <div className="h-64 flex items-end justify-between gap-1">
            {stats.dailyActivity.slice(-30).map((day, index) => {
              const maxValue = Math.max(...stats.dailyActivity.map(d => d.scams + d.comments))
              const height = ((day.scams + day.comments) / maxValue) * 100
              
              return (
                <div
                  key={index}
                  className="flex-1 bg-gradient-to-t from-red-500 to-red-300 rounded-t hover:opacity-80 transition-opacity relative group"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {day.date}<br />
                    {day.scams} denúncias<br />
                    {day.comments} comentários
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>{stats.dailyActivity[0]?.date}</span>
            <span>{stats.dailyActivity[stats.dailyActivity.length - 1]?.date}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Categorias */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Categorias Mais Denunciadas</h2>
            <div className="space-y-4">
              {stats.topCategories.map((category, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    <span className="text-sm text-gray-500">{category.count} ({category.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engajamento de Usuários */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Engajamento de Usuários</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Usuários Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.userEngagement.activeUsers}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Taxa de Atividade</p>
                  <p className="text-2xl font-bold text-green-600">
                    {((stats.userEngagement.activeUsers / stats.totalUsers) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Média de Denúncias</p>
                  <p className="text-xl font-bold text-blue-600">{stats.userEngagement.avgScamsPerUser}</p>
                  <p className="text-xs text-gray-500">por usuário</p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Média de Comentários</p>
                  <p className="text-xl font-bold text-purple-600">{stats.userEngagement.avgCommentsPerUser}</p>
                  <p className="text-xs text-gray-500">por usuário</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status do Sistema */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status do Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Denúncias Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingScams}</p>
              </div>
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Denúncias Verificadas</p>
                <p className="text-2xl font-bold text-green-600">{stats.verifiedScams}</p>
              </div>
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Reports Pendentes</p>
                <p className="text-2xl font-bold text-red-600">{stats.totalReports}</p>
              </div>
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}