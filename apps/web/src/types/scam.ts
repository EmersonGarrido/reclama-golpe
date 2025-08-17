export interface User {
  id: string
  name: string
  avatar?: string | null
}

export interface Scam {
  id: string
  title: string
  description: string
  category: string
  status: string
  amountLost: number | null
  scammerName?: string | null
  scammerWebsite?: string | null
  scammerPhone?: string | null
  scammerEmail?: string | null
  evidence?: string[]
  views: number
  createdAt: string
  updatedAt: string
  userId: string
  user: User
  _count: {
    comments: number
    likes: number
  }
}

export interface ScamResponse {
  scams: Scam[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}