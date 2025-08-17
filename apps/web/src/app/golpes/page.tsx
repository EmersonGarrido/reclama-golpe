'use client'

import { useState, useEffect } from 'react'
import AnimatedScamCard from '@/components/AnimatedScamCard'
import { Scam } from '@/types/scam'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function GolpesPage() {
  const [scams, setScams] = useState<Scam[]>([])
  const [categories, setCategories] = useState([{ value: '', label: 'Todas' }])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchCategories()
    fetchScams()
  }, [category, page])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/categories`)
      const data = await response.json()
      
      // Add "Todas" option at the beginning
      const categoriesWithAll = [
        { value: '', label: 'Todas' },
        ...data.map((cat: any) => ({ value: cat.slug, label: cat.name }))
      ]
      setCategories(categoriesWithAll)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      // Keep default "Todas" if fetch fails
    }
  }

  const fetchScams = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(category && { category }),
        ...(search && { search }),
      })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/scams?${params}`)
      const data = await response.json()
      
      setScams(data.scams || [])
      setTotalPages(data.pagination?.totalPages || 1)
    } catch (error) {
      console.error('Failed to fetch scams:', error)
      setScams([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchScams()
  }

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Todos os Golpes Denunciados
          </h1>
          <p className="text-lg text-gray-600">
            Navegue por todas as denúncias feitas pela comunidade
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="md:col-span-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Buscar por título, descrição ou golpista..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors"
                >
                  Buscar
                </button>
              </div>
            </form>

            {/* Category Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
                setPage(1)
              }}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <motion.div 
                key={i} 
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="animate-pulse">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  </div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : scams.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scams.map((scam, index) => (
                <AnimatedScamCard key={scam.id} scam={scam} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div 
                className="flex justify-center mt-8 gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
                  Página {page} de {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Próxima
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div 
            className="bg-white rounded-lg p-12 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 mb-4 text-lg">Nenhum golpe encontrado</p>
              <p className="text-gray-400 mb-6">Seja o primeiro a alertar a comunidade sobre golpes</p>
              <Link
                href="/denunciar"
                className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Denunciar Golpe
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}