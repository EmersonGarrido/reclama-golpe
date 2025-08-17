'use client'

import { useState } from 'react'
import { AlertTriangle, CheckCircle, ExternalLink, Link2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

interface ResolutionSectionProps {
  scam: {
    id: string
    isResolved?: boolean
    resolvedAt?: string
    resolutionNote?: string
    resolutionLinks?: string[]
    resolvedBy?: string
  }
  isOwner?: boolean
  onResolutionUpdate?: () => void
}

export function ResolutionSection({ scam, isOwner, onResolutionUpdate }: ResolutionSectionProps) {
  const [isResolving, setIsResolving] = useState(false)
  const [showResolveForm, setShowResolveForm] = useState(false)
  const [resolutionNote, setResolutionNote] = useState('')
  const [resolutionLinks, setResolutionLinks] = useState<string[]>([''])
  const { toast } = useToast()

  const handleAddLink = () => {
    setResolutionLinks([...resolutionLinks, ''])
  }

  const handleRemoveLink = (index: number) => {
    setResolutionLinks(resolutionLinks.filter((_, i) => i !== index))
  }

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...resolutionLinks]
    newLinks[index] = value
    setResolutionLinks(newLinks)
  }

  const handleSubmitResolution = async () => {
    if (!resolutionNote.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, adicione uma nota sobre a resolução',
        variant: 'destructive',
      })
      return
    }

    setIsResolving(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scams/${scam.id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resolutionNote,
          resolutionLinks: resolutionLinks.filter(link => link.trim()),
        }),
      })

      if (!response.ok) throw new Error('Erro ao marcar como resolvido')

      toast({
        title: 'Sucesso!',
        description: 'Golpe marcado como resolvido',
      })

      setShowResolveForm(false)
      if (onResolutionUpdate) {
        onResolutionUpdate()
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível marcar como resolvido',
        variant: 'destructive',
      })
    } finally {
      setIsResolving(false)
    }
  }

  // Se o golpe está resolvido, SEMPRE mostra para TODOS os usuários
  if (scam.isResolved) {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-900">✅ Golpe Resolvido!</CardTitle>
          </div>
          {scam.resolvedAt && (
            <CardDescription>
              Resolvido em {format(new Date(scam.resolvedAt), "dd/MM/yyyy")}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {scam.resolutionNote && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700">Detalhes da Resolução:</h4>
              <p className="text-gray-600">{scam.resolutionNote}</p>
            </div>
          )}

          {scam.resolutionLinks && scam.resolutionLinks.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700">Links de Matérias e Evidências:</h4>
              <div className="space-y-2">
                {scam.resolutionLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="truncate">{link}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 p-3 bg-green-100 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              🎉 Este golpe foi resolvido! O site pode ter sido tirado do ar, os responsáveis presos ou a situação solucionada.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Se NÃO está resolvido e NÃO é o dono, não mostra nada
  if (!isOwner) {
    return null
  }

  // Se NÃO está resolvido e É o dono, mostra o botão para marcar como resolvido

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          Resolução do Golpe
        </CardTitle>
        <CardDescription>
          O golpe foi resolvido ou o site foi tirado do ar? Informe a comunidade!
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!showResolveForm ? (
          <Button 
            onClick={() => setShowResolveForm(true)}
            className="w-full sm:w-auto"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Marcar como Resolvido
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Descreva como o golpe foi resolvido *
              </label>
              <Textarea
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Ex: O site foi tirado do ar pela polícia, o golpista foi preso, consegui reaver o dinheiro..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Links de matérias, prints ou evidências (opcional)
              </label>
              {resolutionLinks.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={link}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                    placeholder="https://exemplo.com/materia-sobre-golpe"
                    className="flex-1"
                  />
                  {resolutionLinks.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveLink(index)}
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddLink}
              >
                <Link2 className="h-4 w-4 mr-2" />
                Adicionar Link
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSubmitResolution}
                disabled={isResolving}
              >
                {isResolving ? 'Salvando...' : 'Confirmar Resolução'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowResolveForm(false)
                  setResolutionNote('')
                  setResolutionLinks([''])
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}