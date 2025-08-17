import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import HeaderAuth from '@/components/HeaderAuth'
import Footer from '@/components/Footer'
import { BuildInfoConsole } from '@/components/BuildInfo'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Reclama Golpe - Denuncie e Previna Golpes Online',
    template: '%s | Reclama Golpe'
  },
  description: 'Plataforma colaborativa para denunciar golpes e fraudes online. Compartilhe sua experiência e ajude a proteger outras pessoas contra golpistas na internet.',
  keywords: ['golpes online', 'fraudes', 'denúncia', 'segurança', 'phishing', 'scam', 'proteção', 'consumidor'],
  authors: [{ name: 'Reclama Golpe' }],
  creator: 'Reclama Golpe',
  publisher: 'Reclama Golpe',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://reclamagolpe.com.br',
    siteName: 'Reclama Golpe',
    title: 'Reclama Golpe - Denuncie e Previna Golpes Online',
    description: 'Plataforma colaborativa para denunciar golpes e fraudes online. Compartilhe sua experiência e ajude a proteger outras pessoas.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Reclama Golpe - Proteja-se contra golpes online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reclama Golpe - Denuncie e Previna Golpes Online',
    description: 'Plataforma colaborativa para denunciar golpes e fraudes online.',
    images: ['/og-image.png'],
    creator: '@reclamagolpe',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://reclamagolpe.com.br',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <BuildInfoConsole />
        <HeaderAuth />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}