'use client'

import { useState, useEffect } from 'react'
import { getBuildInfo } from '@/lib/build-info'

export default function SystemInfo() {
  const [buildInfo, setBuildInfo] = useState<any>(null)
  const [systemTime, setSystemTime] = useState<string>('')
  const [uptime, setUptime] = useState<string>('')

  useEffect(() => {
    // Get build info
    const info = getBuildInfo()
    setBuildInfo(info)

    // Fetch build info from JSON
    fetch('/build-info.json')
      .then(res => res.json())
      .then(data => {
        setBuildInfo(prev => ({ ...prev, ...data }))
        
        // Calculate uptime
        if (data.timestamp) {
          const buildTime = new Date(data.timestamp)
          const calculateUptime = () => {
            const now = new Date()
            const diff = now.getTime() - buildTime.getTime()
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24))
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            
            let uptimeStr = ''
            if (days > 0) uptimeStr += `${days}d `
            if (hours > 0) uptimeStr += `${hours}h `
            uptimeStr += `${minutes}m`
            
            setUptime(uptimeStr)
          }
          
          calculateUptime()
          const interval = setInterval(calculateUptime, 60000) // Update every minute
          return () => clearInterval(interval)
        }
      })
      .catch(() => {})

    // Update system time
    const updateTime = () => {
      const now = new Date()
      setSystemTime(now.toLocaleString('pt-BR'))
    }
    
    updateTime()
    const interval = setInterval(updateTime, 1000) // Update every second

    return () => clearInterval(interval)
  }, [])

  if (!buildInfo) return null

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
        Informações do Sistema
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Versão</p>
          <p className="font-semibold text-gray-900">{buildInfo.version}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Build</p>
          <p className="font-semibold text-gray-900">{buildInfo.buildNumber}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Ambiente</p>
          <p className="font-semibold text-gray-900">
            {buildInfo.environment === 'production' ? 'Produção' : 'Desenvolvimento'}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Compilado em</p>
          <p className="font-semibold text-gray-900">
            {buildInfo.buildDate} {buildInfo.buildTime}
          </p>
        </div>
        
        {buildInfo.gitBranch && (
          <div>
            <p className="text-sm text-gray-600">Branch</p>
            <p className="font-semibold text-gray-900">{buildInfo.gitBranch}</p>
          </div>
        )}
        
        {buildInfo.gitHash && (
          <div>
            <p className="text-sm text-gray-600">Commit</p>
            <p className="font-mono text-sm text-gray-900">
              {buildInfo.gitHash.substring(0, 7)}
            </p>
          </div>
        )}
        
        {uptime && (
          <div>
            <p className="text-sm text-gray-600">Uptime</p>
            <p className="font-semibold text-gray-900">{uptime}</p>
          </div>
        )}
        
        <div>
          <p className="text-sm text-gray-600">Hora do Sistema</p>
          <p className="font-semibold text-gray-900">{systemTime}</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${buildInfo.environment === 'production' ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
            <span className="text-sm text-gray-600">
              Sistema {buildInfo.environment === 'production' ? 'em produção' : 'em desenvolvimento'}
            </span>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Recarregar
          </button>
        </div>
      </div>
    </div>
  )
}