'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string
  }
}

interface CommentSectionProps {
  scamId: string
  initialComments?: Comment[]
  commentCount: number
}

export default function CommentSection({ scamId, initialComments = [], commentCount }: CommentSectionProps) {
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      setIsLoggedIn(!!token)
    }
    
    checkAuth()
    
    // Listen for auth changes
    window.addEventListener('storage', checkAuth)
    
    // Fetch comments
    fetchComments()
    
    return () => {
      window.removeEventListener('storage', checkAuth)
    }
  }, [scamId])

  const fetchComments = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/scams/${scamId}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isLoggedIn) {
      router.push(`/login?returnUrl=/golpe/${scamId}`)
      return
    }

    if (!newComment.trim()) return

    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          scamId,
          content: newComment
        })
      })

      if (response.ok) {
        const comment = await response.json()
        setComments([comment, ...comments])
        setNewComment('')
      } else if (response.status === 401) {
        // Token expirado ou inválido
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsLoggedIn(false)
        router.push(`/login?returnUrl=/golpe/${scamId}`)
      } else {
        console.error('Erro ao postar comentário')
      }
    } catch (error) {
      console.error('Failed to post comment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 7) {
      return date.toLocaleDateString('pt-BR')
    } else if (days > 0) {
      return `${days} dia${days > 1 ? 's' : ''} atrás`
    } else if (hours > 0) {
      return `${hours} hora${hours > 1 ? 's' : ''} atrás`
    } else {
      const minutes = Math.floor(diff / (1000 * 60))
      return minutes > 0 ? `${minutes} minuto${minutes > 1 ? 's' : ''} atrás` : 'Agora'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6">
        💬 Comentários ({comments.length || commentCount})
      </h2>
      
      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          rows={4}
          placeholder={isLoggedIn ? "Compartilhe sua experiência ou informações sobre este golpe..." : "Faça login para comentar..."}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!isLoggedIn || isLoading}
        />
        <div className="mt-3 flex justify-end">
          {isLoggedIn ? (
            <button
              type="submit"
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
              disabled={isLoading || !newComment.trim()}
            >
              {isLoading ? 'Enviando...' : 'Comentar'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => router.push(`/login?returnUrl=/golpe/${scamId}`)}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Fazer login para comentar
            </button>
          )}
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="border-b pb-6 last:border-0">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold">
                    {comment.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">{comment.user.name}</span>
                    <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </p>
        )}
      </div>
    </div>
  )
}