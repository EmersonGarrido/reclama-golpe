// Build information generator
export interface BuildInfo {
  version: string
  buildNumber: string
  buildDate: string
  buildTime: string
  environment: string
  commitHash?: string
  branch?: string
}

export function getBuildInfo(): BuildInfo {
  // Get version from package.json or environment
  const version = process.env.NEXT_PUBLIC_VERSION || '1.0.0'
  
  // Generate build number based on date and time
  const now = new Date()
  const buildNumber = process.env.NEXT_PUBLIC_BUILD_NUMBER || 
    `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}.${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`
  
  // Build date and time with São Paulo timezone
  const buildDate = process.env.NEXT_PUBLIC_BUILD_DATE || now.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || now.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })
  
  // Environment - Fix production detection
  const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development'
  
  // Git info (if available) - Fix branch name
  const commitHash = process.env.NEXT_PUBLIC_COMMIT_HASH
  const branch = process.env.NEXT_PUBLIC_BRANCH === 'HEAD' ? 'main' : (process.env.NEXT_PUBLIC_BRANCH || 'main')
  
  return {
    version,
    buildNumber,
    buildDate,
    buildTime,
    environment,
    commitHash,
    branch
  }
}

// Format build info for display
export function formatBuildInfo(info: BuildInfo): string {
  return `v${info.version} (Build ${info.buildNumber})`
}

// Get full build details
export function getFullBuildDetails(info: BuildInfo): string {
  let details = `Versão ${info.version}\n`
  details += `Build: ${info.buildNumber}\n`
  details += `Data: ${info.buildDate} às ${info.buildTime}\n`
  details += `Ambiente: ${info.environment}`
  
  if (info.commitHash) {
    details += `\nCommit: ${info.commitHash.substring(0, 7)}`
  }
  
  if (info.branch) {
    details += `\nBranch: ${info.branch}`
  }
  
  return details
}