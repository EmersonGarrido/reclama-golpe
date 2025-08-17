const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
  user: {
    id: string
    name: string
    email: string
  }
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erro ao fazer login')
  }

  const result = await response.json()
  
  // Salvar token no localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', result.access_token)
    localStorage.setItem('user', JSON.stringify(result.user))
  }

  return result
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erro ao criar conta')
  }

  const result = await response.json()
  
  // Salvar token no localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', result.access_token)
    localStorage.setItem('user', JSON.stringify(result.user))
  }

  return result
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

export function getUser() {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }
  return null
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

export function getCurrentUser() {
  return getUser()
}