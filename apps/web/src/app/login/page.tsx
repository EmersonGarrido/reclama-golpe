'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { login, register } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    setLoading(true)
    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password,
        })
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })
      }
      
      // Redirecionar para a página anterior ou home
      const returnUrl = new URLSearchParams(window.location.search).get('returnUrl')
      router.push(returnUrl || '/')
    } catch (err: any) {
      setError(err.message || `Erro ao ${isLogin ? 'fazer login' : 'criar conta'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Entrar na sua conta' : 'Criar nova conta'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isLogin 
              ? 'Faça login para denunciar golpes e interagir com a comunidade'
              : 'Junte-se à comunidade e ajude a combater golpes online'
            }
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo
                </label>
                <input
                  type="text"
                  name="name"
                  required={!isLogin}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar senha
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required={!isLogin}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Lembrar de mim</span>
                </label>
                <Link
                  href="/recuperar-senha"
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Esqueceu a senha?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar conta')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600">
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            </span>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-red-600 hover:text-red-700 font-semibold"
            >
              {isLogin ? 'Cadastre-se' : 'Faça login'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Ao continuar, você concorda com nossos{' '}
              <Link href="/termos" className="text-red-600 hover:text-red-700">
                Termos de Uso
              </Link>{' '}
              e{' '}
              <Link href="/privacidade" className="text-red-600 hover:text-red-700">
                Política de Privacidade
              </Link>
            </p>
          </div>
        </div>

        {/* Contas de teste */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Contas de teste:</strong><br />
            Admin: user1@example.com / senha123<br />
            User: user2@example.com / senha123
          </p>
        </div>
      </div>
    </div>
  )
}