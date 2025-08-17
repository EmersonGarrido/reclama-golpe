import { fetchScamById } from '@/lib/api'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import ScamDetailClient from './client-page'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const scam = await fetchScamById(id)

  if (!scam) {
    return {
      title: 'Golpe não encontrado',
    }
  }

  const title = scam.title
  const description = scam.description.substring(0, 160)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: scam.createdAt,
      authors: [scam.user.name],
      tags: [scam.category],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function ScamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const scam = await fetchScamById(id)

  if (!scam) {
    notFound()
  }

  return <ScamDetailClient scam={scam} />
}