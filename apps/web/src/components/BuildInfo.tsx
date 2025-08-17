'use client'

import { useState, useEffect } from 'react'
import { getBuildInfo, formatBuildInfo, getFullBuildDetails } from '@/lib/build-info'

interface BuildInfoProps {
  detailed?: boolean
  className?: string
}

export default function BuildInfo({ detailed = false, className = '' }: BuildInfoProps) {
  const [buildInfo, setBuildInfo] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>('')

  useEffect(() => {
    // Get build info
    const info = getBuildInfo()
    setBuildInfo(info)

    // Update last update time
    const updateTime = () => {
      const now = new Date()
      setLastUpdate(now.toLocaleString('pt-BR'))
    }
    
    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute

    // Fetch additional build info from JSON if available
    fetch('/build-info.json')
      .then(res => res.json())
      .then(data => {
        setBuildInfo(prev => ({ ...prev, ...data }))
      })
      .catch(() => {
        // Use default build info if file doesn't exist
      })

    return () => clearInterval(interval)
  }, [])

  if (!buildInfo) return null

  const handleClick = () => {
    if (detailed) {
      setShowDetails(!showDetails)
    }
  }

  return (
    <div className={`text-xs text-gray-600 ${className}`}>
      <div 
        className={detailed ? 'cursor-pointer hover:text-gray-500' : ''}
        onClick={handleClick}
        title={detailed ? 'Clique para ver detalhes' : undefined}
      >
        <span className="font-medium">Versão {buildInfo.version}</span>
        <span className="mx-1">|</span>
        <span>Build {buildInfo.buildNumber}</span>
        {detailed && (
          <>
            <span className="mx-1">|</span>
            <span>{buildInfo.environment === 'production' ? 'Produção' : 'Desenvolvimento'}</span>
          </>
        )}
      </div>
      
      {showDetails && detailed && (
        <div className="mt-2 p-3 bg-gray-100 rounded-lg text-xs space-y-1">
          <div className="font-semibold mb-2">Informações de Build</div>
          <div>📦 Versão: {buildInfo.version}</div>
          <div>🔨 Build: {buildInfo.buildNumber}</div>
          <div>📅 Compilado: {buildInfo.buildDate} às {buildInfo.buildTime}</div>
          <div>🌍 Ambiente: {buildInfo.environment}</div>
          {buildInfo.commitHash && (
            <div>💻 Commit: {buildInfo.commitHash.substring(0, 7)}</div>
          )}
          {buildInfo.branch && (
            <div>🌿 Branch: {buildInfo.branch}</div>
          )}
          <div className="pt-2 border-t border-gray-200 mt-2">
            <div>🕐 Última atualização: {lastUpdate}</div>
          </div>
        </div>
      )}
    </div>
  )
}

// Component for displaying in console on page load
export function BuildInfoConsole() {
  useEffect(() => {
    const info = getBuildInfo()
    const details = getFullBuildDetails(info)
    
    console.log(
      '%c🛡️ Reclama Golpe',
      'color: #DC2626; font-size: 20px; font-weight: bold;'
    )
    console.log(
      '%c' + details,
      'color: #6B7280; font-size: 12px;'
    )
    console.log(
      '%c⚠️ Este é um console de desenvolvedor. Não cole código aqui!',
      'color: #EF4444; font-size: 14px; font-weight: bold;'
    )
  }, [])

  return null
}