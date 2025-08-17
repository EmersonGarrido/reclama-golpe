import { Scam, ScamResponse } from '@/types/scam'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

export async function fetchScams(params?: {
  page?: number
  limit?: number
  category?: string
  status?: string
  search?: string
  sortBy?: string
  order?: string
}): Promise<ScamResponse> {
  const queryParams = new URLSearchParams()
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString())
      }
    })
  }

  try {
    const response = await fetch(`${API_URL}/scams?${queryParams}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText)
      // Return empty data instead of throwing
      return {
        scams: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0
        }
      }
    }

    return response.json()
  } catch (error) {
    console.error('Failed to fetch scams:', error)
    // Return empty data on error
    return {
      scams: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0
      }
    }
  }
}

export async function fetchTrendingScams(limit = 10): Promise<Scam[]> {
  try {
    const response = await fetch(`${API_URL}/scams/trending?limit=${limit}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText)
      return []
    }

    return response.json()
  } catch (error) {
    console.error('Failed to fetch trending scams:', error)
    return []
  }
}

export async function fetchScamById(id: string): Promise<Scam | null> {
  try {
    const response = await fetch(`${API_URL}/scams/${id}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText)
      return null
    }

    return response.json()
  } catch (error) {
    console.error('Failed to fetch scam:', error)
    return null
  }
}