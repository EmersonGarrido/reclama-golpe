'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Settings {
  general: {
    siteName: string
    siteDescription: string
    contactEmail: string
    maintenanceMode: boolean
  }
  moderation: {
    autoApprove: boolean
    requireEmailVerification: boolean
    minCommentLength: number
    maxReportsBeforeHide: number
    profanityFilter: boolean
  }
  notifications: {
    emailOnNewScam: boolean
    emailOnNewReport: boolean
    emailOnNewUser: boolean
    dailyDigest: boolean
    weeklyReport: boolean
  }
  security: {
    enableCaptcha: boolean
    maxLoginAttempts: number
    sessionTimeout: number
    enforceStrongPasswords: boolean
    enable2FA: boolean
  }
  limits: {
    maxFileSize: number
    maxUploadsPerScam: number
    maxScamsPerDay: number
    maxCommentsPerDay: number
  }
}

export default function AdminConfiguracoesPage() {
  const [settings, setSettings] = useState<Settings>({
    general: {
      siteName: 'Reclama Golpe',
      siteDescription: 'Plataforma colaborativa de denúncia e conscientização sobre golpes online',
      contactEmail: 'contato@reclamagolpe.com.br',
      maintenanceMode: false
    },
    moderation: {
      autoApprove: false,
      requireEmailVerification: true,
      minCommentLength: 10,
      maxReportsBeforeHide: 5,
      profanityFilter: true
    },
    notifications: {
      emailOnNewScam: true,
      emailOnNewReport: true,
      emailOnNewUser: false,
      dailyDigest: true,
      weeklyReport: true
    },
    security: {
      enableCaptcha: true,
      maxLoginAttempts: 5,
      sessionTimeout: 30,
      enforceStrongPasswords: true,
      enable2FA: false
    },
    limits: {
      maxFileSize: 5,
      maxUploadsPerScam: 5,
      maxScamsPerDay: 10,
      maxCommentsPerDay: 50
    }
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'moderation' | 'notifications' | 'security' | 'limits'>('general')
  const router = useRouter()

  useEffect(() => {
    checkAdminAndLoadSettings()
  }, [])

  const checkAdminAndLoadSettings = async () => {
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

    // Carregar configurações do localStorage ou API
    const savedSettings = localStorage.getItem('adminSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
    
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    
    try {
      // Salvar no localStorage (ou enviar para API)
      localStorage.setItem('adminSettings', JSON.stringify(settings))
      
      // Simular salvamento na API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('Configurações salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      alert('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
      localStorage.removeItem('adminSettings')
      window.location.reload()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h1>
              <p className="text-gray-600 mt-1">
                Gerencie as configurações gerais da plataforma
              </p>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Voltar ao Dashboard
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${
                    activeTab === 'general' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Geral
                </button>
                
                <button
                  onClick={() => setActiveTab('moderation')}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${
                    activeTab === 'moderation' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Moderação
                </button>
                
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${
                    activeTab === 'notifications' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Notificações
                </button>
                
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${
                    activeTab === 'security' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Segurança
                </button>
                
                <button
                  onClick={() => setActiveTab('limits')}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${
                    activeTab === 'limits' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Limites
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Configurações Gerais</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Site
                    </label>
                    <input
                      type="text"
                      value={settings.general.siteName}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, siteName: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição do Site
                    </label>
                    <textarea
                      value={settings.general.siteDescription}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, siteDescription: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email de Contato
                    </label>
                    <input
                      type="email"
                      value={settings.general.contactEmail}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, contactEmail: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Modo de Manutenção</p>
                      <p className="text-sm text-gray-600">Bloqueia acesso ao site para não-admins</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.general.maintenanceMode}
                        onChange={(e) => setSettings({
                          ...settings,
                          general: { ...settings.general, maintenanceMode: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'moderation' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Moderação</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Aprovar Automaticamente</p>
                        <p className="text-sm text-gray-600">Publicar denúncias sem moderação prévia</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.moderation.autoApprove}
                          onChange={(e) => setSettings({
                            ...settings,
                            moderation: { ...settings.moderation, autoApprove: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Verificação de Email</p>
                        <p className="text-sm text-gray-600">Exigir confirmação de email para cadastro</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.moderation.requireEmailVerification}
                          onChange={(e) => setSettings({
                            ...settings,
                            moderation: { ...settings.moderation, requireEmailVerification: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Filtro de Palavrões</p>
                        <p className="text-sm text-gray-600">Bloquear conteúdo ofensivo automaticamente</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.moderation.profanityFilter}
                          onChange={(e) => setSettings({
                            ...settings,
                            moderation: { ...settings.moderation, profanityFilter: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tamanho Mínimo de Comentário
                      </label>
                      <input
                        type="number"
                        value={settings.moderation.minCommentLength}
                        onChange={(e) => setSettings({
                          ...settings,
                          moderation: { ...settings.moderation, minCommentLength: parseInt(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reports para Ocultar
                      </label>
                      <input
                        type="number"
                        value={settings.moderation.maxReportsBeforeHide}
                        onChange={(e) => setSettings({
                          ...settings,
                          moderation: { ...settings.moderation, maxReportsBeforeHide: parseInt(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Notificações</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Nova Denúncia</p>
                        <p className="text-sm text-gray-600">Receber email quando houver nova denúncia</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.emailOnNewScam}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, emailOnNewScam: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Novo Report</p>
                        <p className="text-sm text-gray-600">Notificar quando houver denúncia de conteúdo</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.emailOnNewReport}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, emailOnNewReport: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Resumo Diário</p>
                        <p className="text-sm text-gray-600">Receber resumo das atividades do dia</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.dailyDigest}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, dailyDigest: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Relatório Semanal</p>
                        <p className="text-sm text-gray-600">Receber estatísticas semanais</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.weeklyReport}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, weeklyReport: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Segurança</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">CAPTCHA</p>
                        <p className="text-sm text-gray-600">Proteção contra bots em formulários</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.enableCaptcha}
                          onChange={(e) => setSettings({
                            ...settings,
                            security: { ...settings.security, enableCaptcha: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Senhas Fortes</p>
                        <p className="text-sm text-gray-600">Exigir senhas com requisitos mínimos</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.enforceStrongPasswords}
                          onChange={(e) => setSettings({
                            ...settings,
                            security: { ...settings.security, enforceStrongPasswords: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Autenticação 2FA</p>
                        <p className="text-sm text-gray-600">Ativar autenticação de dois fatores</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.enable2FA}
                          onChange={(e) => setSettings({
                            ...settings,
                            security: { ...settings.security, enable2FA: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tentativas de Login
                      </label>
                      <input
                        type="number"
                        value={settings.security.maxLoginAttempts}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: { ...settings.security, maxLoginAttempts: parseInt(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timeout de Sessão (min)
                      </label>
                      <input
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'limits' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Limites do Sistema</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tamanho Máximo de Arquivo (MB)
                      </label>
                      <input
                        type="number"
                        value={settings.limits.maxFileSize}
                        onChange={(e) => setSettings({
                          ...settings,
                          limits: { ...settings.limits, maxFileSize: parseInt(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Uploads por Denúncia
                      </label>
                      <input
                        type="number"
                        value={settings.limits.maxUploadsPerScam}
                        onChange={(e) => setSettings({
                          ...settings,
                          limits: { ...settings.limits, maxUploadsPerScam: parseInt(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Denúncias por Dia
                      </label>
                      <input
                        type="number"
                        value={settings.limits.maxScamsPerDay}
                        onChange={(e) => setSettings({
                          ...settings,
                          limits: { ...settings.limits, maxScamsPerDay: parseInt(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comentários por Dia
                      </label>
                      <input
                        type="number"
                        value={settings.limits.maxCommentsPerDay}
                        onChange={(e) => setSettings({
                          ...settings,
                          limits: { ...settings.limits, maxCommentsPerDay: parseInt(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Nota:</strong> Estes limites ajudam a prevenir spam e abuso da plataforma. 
                      Ajuste com cuidado para não prejudicar usuários legítimos.
                    </p>
                  </div>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Restaurar Padrões
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Salvar Configurações
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}