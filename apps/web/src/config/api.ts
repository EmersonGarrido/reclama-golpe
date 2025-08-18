// Configuração da API
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

// Helper para fazer fetch com a URL correta
export function getApiUrl(path: string) {
  // Remove barra inicial se houver
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_URL}/${cleanPath}`;
}