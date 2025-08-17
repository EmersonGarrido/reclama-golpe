'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  bio?: string
  avatar?: string
  isAdmin: boolean
  createdAt: string
  _count: {
    scams: number
    comments: number
    likes: number
  }
}

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'scams'>('createdAt')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    checkAdminAndFetchUsers()
  }, [])

  const checkAdminAndFetchUsers = async () => {
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

    await fetchUsers()
  }

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3333/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    if (confirm(`Tem certeza que deseja ${currentStatus ? 'remover' : 'conceder'} privilégios de admin?`)) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:3333/admin/users/${userId}/toggle-admin`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          alert(`Privilégios de admin ${currentStatus ? 'removidos' : 'concedidos'} com sucesso!`)
          fetchUsers()
        }
      } catch (error) {
        console.error('Erro ao alterar status admin:', error)
        alert('Erro ao alterar privilégios de admin')
      }
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:3333/admin/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          alert('Usuário excluído com sucesso!')
          fetchUsers()
        }
      } catch (error) {
        console.error('Erro ao excluir usuário:', error)
        alert('Erro ao excluir usuário')
      }
    }
  }

  const handleBulkAction = async (action: 'delete' | 'makeAdmin' | 'removeAdmin') => {
    if (selectedUsers.length === 0) {
      alert('Selecione pelo menos um usuário')
      return
    }

    const actionText = {
      delete: 'excluir',
      makeAdmin: 'promover a admin',
      removeAdmin: 'remover privilégios de admin de'
    }

    if (confirm(`Tem certeza que deseja ${actionText[action]} ${selectedUsers.length} usuário(s)?`)) {
      // Implementar ações em massa
      alert('Ação em massa executada!')
      setSelectedUsers([])
      fetchUsers()
    }
  }

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = filterRole === 'all' || 
                         (filterRole === 'admin' && user.isAdmin) ||
                         (filterRole === 'user' && !user.isAdmin)
      return matchesSearch && matchesRole
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'scams':
          return b._count.scams - a._count.scams
        case 'createdAt':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando usuários...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h1>
              <p className="text-gray-600 mt-1">Total: {users.length} usuários cadastrados</p>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Voltar ao Dashboard
            </Link>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Todos os usuários</option>
              <option value="admin">Apenas admins</option>
              <option value="user">Apenas usuários</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="createdAt">Mais recentes</option>
              <option value="name">Nome A-Z</option>
              <option value="scams">Mais denúncias</option>
            </select>
          </div>
        </div>

        {/* Ações em massa */}
        {selectedUsers.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-yellow-800">
                {selectedUsers.length} usuário(s) selecionado(s)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('makeAdmin')}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Promover a Admin
                </button>
                <button
                  onClick={() => handleBulkAction('removeAdmin')}
                  className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm"
                >
                  Remover Admin
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Excluir
                </button>
                <button
                  onClick={() => setSelectedUsers([])}
                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de usuários */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredUsers.map(u => u.id))
                        } else {
                          setSelectedUsers([])
                        }
                      }}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Função
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estatísticas
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cadastro
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id])
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user.id))
                          }
                        }}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                            <span className="text-gray-600 font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          {user.bio && (
                            <div className="text-xs text-gray-500 truncate max-w-xs">{user.bio}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-4 py-4">
                      {user.isAdmin ? (
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                          Admin
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          Usuário
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-3">
                        <span title="Denúncias">📝 {user._count.scams}</span>
                        <span title="Comentários">💬 {user._count.comments}</span>
                        <span title="Curtidas">👍 {user._count.likes}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
                          className={`px-3 py-1 text-xs font-medium rounded ${
                            user.isAdmin 
                              ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          {user.isAdmin ? 'Remover Admin' : 'Tornar Admin'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum usuário encontrado</p>
            </div>
          )}
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Usuários</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Administradores</p>
                <p className="text-2xl font-bold text-purple-600">
                  {users.filter(u => u.isAdmin).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Usuários Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter(u => u._count.scams > 0 || u._count.comments > 0).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Novos (7 dias)</p>
                <p className="text-2xl font-bold text-orange-600">
                  {users.filter(u => {
                    const sevenDaysAgo = new Date()
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
                    return new Date(u.createdAt) > sevenDaysAgo
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}