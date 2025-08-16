import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Reclama Golpe - Denuncie e Previna Golpes Online',
  description: 'Plataforma colaborativa para denunciar golpes, fraudes e esquemas fraudulentos. Ajude a comunidade a se proteger compartilhando suas experiências.',
  keywords: 'golpes, fraudes, denúncia, segurança, internet, phishing, pirâmide',
  openGraph: {
    title: 'Reclama Golpe',
    description: 'Denuncie e previna golpes online',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}