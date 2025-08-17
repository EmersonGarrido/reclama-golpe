'use client'

import { useState, useEffect } from 'react'
import ScamCard from '@/components/ScamCard'
import Link from 'next/link'
import { Scam } from '@/types/scam'

interface HomeClientProps {
  scamsData: any
  trendingScams: Scam[]
}

export default function HomeClient({ scamsData, trendingScams }: HomeClientProps) {

  const TrendingCard = ({ scam, index }: { scam: Scam; index: number }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          {index + 1}
        </div>
        <Link href={`/golpe/${scam.id}`} className="flex-1">
          <h3 className="font-bold text-gray-900 hover:text-red-600 transition-colors line-clamp-2 mb-2">
            {scam.title}
          </h3>
        </Link>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4 text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {scam.views}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {scam._count.likes}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {scam._count.comments}
          </span>
        </div>
        {scam.amountLost && scam.amountLost > 0 && (
          <span className="text-red-600 font-bold text-sm bg-red-50 px-2 py-1 rounded-full">
            R$ {scam.amountLost.toLocaleString('pt-BR')}
          </span>
        )}
      </div>
    </div>
  )

  const FeatureCard = ({ icon, title, description, color }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
  }) => (
    <div className="text-center group">
      <div className={`w-20 h-20 mx-auto mb-6 ${color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )

  return (
    <div>
      {/* Hero Section - Simplificado */}
      <section className="relative bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-6xl font-bold text-gray-900">
                Reclama Golpe
              </h1>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Denuncie e Previna Golpes Online
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Plataforma colaborativa onde você pode denunciar golpes, alertar outros usuários 
              e se proteger de fraudes na internet. <span className="font-semibold text-red-600">Juntos somos mais fortes!</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/denunciar"
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-colors font-semibold text-lg flex items-center justify-center gap-3 shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Denunciar um Golpe
              </Link>
              
              <Link
                href="/golpes"
                className="bg-white text-gray-700 border-2 border-gray-300 px-8 py-4 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-colors font-semibold text-lg flex items-center justify-center gap-3 shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Ver Golpes Recentes
              </Link>
            </div>
          </div>

          {/* Features Quick Preview - Sem animação */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="bg-blue-50 p-4 rounded-xl inline-block mb-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Denuncie</h3>
              <p className="text-sm text-gray-600">Compartilhe sua experiência e alerte outros</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-50 p-4 rounded-xl inline-block mb-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Verifique</h3>
              <p className="text-sm text-gray-600">Consulte antes de cair em golpes</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-50 p-4 rounded-xl inline-block mb-3">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Colabore</h3>
              <p className="text-sm text-gray-600">Juntos somos mais fortes contra fraudes</p>
            </div>
          </div>
        </div>
      </section>


      {/* Trending Section */}
      {trendingScams && trendingScams.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                🔥 Golpes em Alta
              </h2>
              <Link href="/golpes" className="text-red-600 hover:text-red-700 font-semibold">
                Ver todos →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingScams.slice(0, 6).map((scam, index) => (
                <TrendingCard key={scam.id} scam={scam} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Scams Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Denúncias Recentes
            </h2>
            <Link href="/golpes" className="text-red-600 hover:text-red-700 font-semibold">
              Ver todas →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scamsData?.scams?.slice(0, 6).map((scam: any) => (
              <ScamCard key={scam.id} scam={scam} />
            ))}
          </div>

          {(!scamsData?.scams || scamsData.scams.length === 0) && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma denúncia encontrada</h3>
              <p className="text-gray-500 mb-4">Seja o primeiro a denunciar um golpe!</p>
              <Link
                href="/denunciar"
                className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Criar Denúncia
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
            Como Funciona?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Nossa plataforma foi criada para ser simples e eficaz. Veja como é fácil contribuir para uma internet mais segura:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <FeatureCard
              icon={
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
              title="1. Identifique"
              description="Reconheça um golpe ou fraude online que você vivenciou ou descobriu"
              color="bg-gradient-to-r from-red-500 to-orange-500"
            />
            
            <FeatureCard
              icon={
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              }
              title="2. Denuncie"
              description="Crie uma denúncia detalhada com todas as informações relevantes"
              color="bg-gradient-to-r from-blue-500 to-cyan-500"
            />
            
            <FeatureCard
              icon={
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 2.943-9.543 7m9.543-7v12m0-12a8.985 8.985 0 00-5.304 1.713M12 3a8.985 8.985 0 015.304 1.713" />
                </svg>
              }
              title="3. Compartilhe"
              description="Sua denúncia ajuda outros a não caírem no mesmo golpe"
              color="bg-gradient-to-r from-green-500 to-emerald-500"
            />
            
            <FeatureCard
              icon={
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="4. Proteja-se"
              description="Consulte denúncias antes de confiar em ofertas suspeitas"
              color="bg-gradient-to-r from-purple-500 to-pink-500"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ajude a Construir uma Internet Mais Segura
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Cada denúncia importa. Sua contribuição pode evitar que outras pessoas sejam vítimas de golpes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/denunciar"
              className="bg-white text-red-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors font-semibold text-lg shadow-lg"
            >
              Fazer uma Denúncia
            </Link>
            <Link
              href="/golpes"
              className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-xl hover:bg-white/10 transition-colors font-semibold text-lg"
            >
              Consultar Golpes
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}