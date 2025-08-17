'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon?: string
  color?: string
  _count?: {
    scams: number
  }
}

const DEFAULT_CATEGORIES = [
  {
    slug: 'PHISHING',
    name: 'Phishing',
    description: 'Tentativas de roubar informações pessoais através de sites ou emails falsos',
    icon: '🎣',
    color: 'bg-blue-500'
  },
  {
    slug: 'FAKE_ECOMMERCE',
    name: 'E-commerce Falso',
    description: 'Lojas online fraudulentas que não entregam produtos',
    icon: '🛒',
    color: 'bg-red-500'
  },
  {
    slug: 'PYRAMID_SCHEME',
    name: 'Pirâmide Financeira',
    description: 'Esquemas que prometem lucros rápidos através de recrutamento',
    icon: '📊',
    color: 'bg-yellow-500'
  },
  {
    slug: 'ROMANCE_SCAM',
    name: 'Golpe do Amor',
    description: 'Golpistas que fingem interesse romântico para extorquir dinheiro',
    icon: '💔',
    color: 'bg-pink-500'
  },
  {
    slug: 'JOB_SCAM',
    name: 'Golpe do Emprego',
    description: 'Ofertas falsas de emprego para roubar dados ou dinheiro',
    icon: '💼',
    color: 'bg-green-500'
  },
  {
    slug: 'INVESTMENT_FRAUD',
    name: 'Fraude de Investimento',
    description: 'Promessas de retornos irreais em investimentos falsos',
    icon: '💰',
    color: 'bg-purple-500'
  },
  {
    slug: 'LOTTERY_SCAM',
    name: 'Golpe da Loteria',
    description: 'Notificações falsas de prêmios para extorquir taxas',
    icon: '🎰',
    color: 'bg-orange-500'
  },
  {
    slug: 'TECH_SUPPORT',
    name: 'Suporte Técnico Falso',
    description: 'Golpistas se passando por suporte técnico de empresas',
    icon: '💻',
    color: 'bg-indigo-500'
  },
  {
    slug: 'CRYPTOCURRENCY',
    name: 'Golpe de Criptomoedas',
    description: 'Fraudes envolvendo Bitcoin e outras criptomoedas',
    icon: '₿',
    color: 'bg-gray-700'
  },
  {
    slug: 'OTHER',
    name: 'Outros',
    description: 'Outros tipos de golpes não categorizados',
    icon: '⚠️',
    color: 'bg-gray-500'
  }
]

export default function AdminCategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    color: ''
  })
  const router = useRouter()

  useEffect(() => {
    checkAdminAndFetchCategories()
  }, [])

  const checkAdminAndFetchCategories = async () => {
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

    await fetchCategories()
  }

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3333/admin/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        // Enriquecer categorias com dados padrão
        const enrichedCategories = data.map((cat: any) => {
          const defaultCat = DEFAULT_CATEGORIES.find(d => d.slug === cat.slug)
          return {
            ...cat,
            icon: defaultCat?.icon || '📁',
            color: defaultCat?.color || 'bg-gray-500',
            description: cat.description || defaultCat?.description || ''
          }
        })
        setCategories(enrichedCategories)
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategoryStats = async (categorySlug: string) => {
    try {
      const response = await fetch(`http://localhost:3333/scams?category=${categorySlug}`)
      if (response.ok) {
        const data = await response.json()
        return data.total || 0
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    }
    return 0
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon || '',
      color: category.color || ''
    })
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!editingCategory) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3333/admin/categories/${editingCategory.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert('Categoria atualizada com sucesso!')
        setIsModalOpen(false)
        setEditingCategory(null)
        fetchCategories()
      }
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error)
      alert('Erro ao atualizar categoria')
    }
  }

  const handleAddCategory = () => {
    setEditingCategory(null)
    setFormData({
      name: '',
      description: '',
      icon: '📁',
      color: 'bg-gray-500'
    })
    setIsModalOpen(true)
  }

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('token')
      const slug = formData.name.toUpperCase().replace(/\s+/g, '_')
      
      const response = await fetch('http://localhost:3333/admin/categories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          slug
        })
      })

      if (response.ok) {
        alert('Categoria criada com sucesso!')
        setIsModalOpen(false)
        fetchCategories()
      }
    } catch (error) {
      console.error('Erro ao criar categoria:', error)
      alert('Erro ao criar categoria')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando categorias...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gerenciar Categorias</h1>
              <p className="text-gray-600 mt-1">
                Configure as categorias de golpes disponíveis na plataforma
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nova Categoria
              </button>
              <Link
                href="/admin"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Voltar ao Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Grid de Categorias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const defaultCat = DEFAULT_CATEGORIES.find(d => d.slug === category.slug)
            const icon = defaultCat?.icon || category.icon || '📁'
            const color = defaultCat?.color || category.color || 'bg-gray-500'
            const description = category.description || defaultCat?.description || 'Sem descrição'
            
            return (
              <div key={category.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-2xl text-white`}>
                      {icon}
                    </div>
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Slug: <code className="bg-gray-100 px-1 rounded">{category.slug}</code>
                    </span>
                    <span className="text-gray-500">
                      {category._count?.scams || 0} denúncias
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Estatísticas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Categorias</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categoria Mais Usada</p>
                <p className="text-xl font-bold text-gray-900">
                  {categories.sort((a, b) => (b._count?.scams || 0) - (a._count?.scams || 0))[0]?.name || '-'}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Denúncias</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.reduce((total, cat) => total + (cat._count?.scams || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edição/Criação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity" onClick={() => setIsModalOpen(false)}>
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <div className="relative inline-block w-full max-w-lg overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
              <div className="bg-white px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                </h3>
              </div>

              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="Ex: Golpe de WhatsApp"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    rows={3}
                    placeholder="Descreva brevemente esta categoria..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ícone (Emoji)
                    </label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-center text-2xl"
                      placeholder="📁"
                      maxLength={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor
                    </label>
                    <select
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option value="bg-gray-500">Cinza</option>
                      <option value="bg-red-500">Vermelho</option>
                      <option value="bg-blue-500">Azul</option>
                      <option value="bg-green-500">Verde</option>
                      <option value="bg-yellow-500">Amarelo</option>
                      <option value="bg-purple-500">Roxo</option>
                      <option value="bg-pink-500">Rosa</option>
                      <option value="bg-orange-500">Laranja</option>
                      <option value="bg-indigo-500">Índigo</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-3 flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={editingCategory ? handleSave : handleCreate}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  {editingCategory ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}