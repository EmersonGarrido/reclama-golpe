'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScamCard from '@/components/ScamCard'
import Link from 'next/link'
import { Scam } from '@/types/scam'

interface HomeClientProps {
  scamsData: any
  trendingScams: Scam[]
}

export default function HomeClient({ scamsData, trendingScams }: HomeClientProps) {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalScams: 0,
    totalUsers: 0,
    totalComments: 0,
    preventedLoss: 0,
  })

  useEffect(() => {
    // Simulate loading and animate stats
    const timer = setTimeout(() => {
      setStats({
        totalScams: 127,
        totalUsers: 23,
        totalComments: 184,
        preventedLoss: 450000,
      })
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const StatCard = ({ icon, value, label, delay, color }: { 
    icon: React.ReactNode; 
    value: number | string; 
    label: string; 
    delay: number;
    color: string;
  }) => (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: "backOut" }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <motion.div 
        className={`w-16 h-16 mx-auto mb-4 ${color} rounded-xl flex items-center justify-center shadow-lg`}
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2
        }}
      >
        {icon}
      </motion.div>
      <motion.div
        className="text-3xl font-bold text-red-600 mb-2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.3, duration: 0.4, ease: "backOut" }}
      >
        {value}
      </motion.div>
      <div className="text-sm text-gray-600 font-medium">{label}</div>
    </motion.div>
  )

  const TrendingCard = ({ scam, index }: { scam: Scam; index: number }) => (
    <motion.div
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className="flex items-start gap-3 mb-4">
        <motion.div
          className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: index * 0.1 + 0.3, duration: 0.5, ease: "backOut" }}
        >
          {index + 1}
        </motion.div>
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
    </motion.div>
  )

  const FeatureCard = ({ icon, title, description, delay, color }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay: number;
    color: string;
  }) => (
    <motion.div
      className="text-center group"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -10 }}
    >
      <motion.div 
        className={`w-20 h-20 mx-auto mb-6 ${color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
        whileHover={{ rotate: 10, scale: 1.1 }}
        transition={{ duration: 0.2 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-20">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-red-100 opacity-20"></div>
          <div className="absolute top-0 left-0 w-40 h-40 bg-red-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-orange-200 rounded-full opacity-20 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div 
            className="text-center max-w-5xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="flex items-center justify-center gap-3 mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.div
                className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
              </motion.div>
              <h1 className="text-6xl font-bold text-gray-900">
                Reclama Golpe
              </h1>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Denuncie e Previna Golpes Online
            </motion.h2>
            
            <motion.p 
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Plataforma colaborativa onde você pode denunciar golpes, alertar outros usuários 
              e se proteger de fraudes na internet. <span className="font-semibold text-red-600">Juntos somos mais fortes!</span>
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/denunciar"
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-semibold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                >
                  <motion.svg 
                    className="w-6 h-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </motion.svg>
                  Denunciar um Golpe
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/golpes"
                  className="bg-white text-gray-700 border-2 border-gray-300 px-8 py-4 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Ver Golpes Recentes
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Features Quick Preview */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <FeatureCard
              icon={
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              }
              title="Denuncie Facilmente"
              description="Interface simples e intuitiva para reportar golpes de forma rápida e segura"
              delay={0.9}
              color="bg-red-500"
            />
            <FeatureCard
              icon={
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              title="Comunidade Ativa"
              description="Milhares de usuários trabalhando juntos para combater fraudes online"
              delay={1.0}
              color="bg-blue-500"
            />
            <FeatureCard
              icon={
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="Proteção Garantida"
              description="Sistema de verificação e moderação para manter a qualidade das denúncias"
              delay={1.1}
              color="bg-green-500"
            />
          </motion.div>

          {/* Stats */}
          <AnimatePresence>
            {!loading && (
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <StatCard
                  icon={
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  }
                  value={`${stats.totalScams}+`}
                  label="Golpes Denunciados"
                  delay={1.2}
                  color="bg-red-500"
                />
                <StatCard
                  icon={
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                  value={`${stats.totalUsers}+`}
                  label="Usuários Ativos"
                  delay={1.3}
                  color="bg-blue-500"
                />
                <StatCard
                  icon={
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  }
                  value={`${stats.totalComments}+`}
                  label="Comentários"
                  delay={1.4}
                  color="bg-green-500"
                />
                <StatCard
                  icon={
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  value={`R$ ${(stats.preventedLoss / 1000).toFixed(0)}k`}
                  label="Prejuízo Evitado"
                  delay={1.5}
                  color="bg-purple-500"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Trending Scams */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex items-center justify-between mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </motion.div>
              <div>
                <h2 className="text-4xl font-bold text-gray-900">Trending</h2>
                <p className="text-gray-600 mt-1">Golpes mais visualizados nos últimos 7 dias</p>
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
            >
              <Link
                href="/trending"
                className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                Ver todos
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {trendingScams.slice(0, 3).map((scam: Scam, index) => (
              <TrendingCard key={scam.id} scam={scam} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Recent Scams */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex items-center justify-between mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
                whileHover={{ rotate: 5, scale: 1.1 }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.div>
              <div>
                <h2 className="text-4xl font-bold text-gray-900">Denúncias Recentes</h2>
                <p className="text-gray-600 mt-1">Últimos golpes reportados pela comunidade</p>
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
            >
              <Link
                href="/golpes"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                Ver todos
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {scamsData.scams.map((scam: Scam, index: number) => (
              <motion.div
                key={scam.id}
                variants={itemVariants}
                transition={{ delay: index * 0.1 }}
              >
                <ScamCard scam={scam} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/golpes"
                className="inline-block bg-gradient-to-r from-gray-800 to-gray-900 text-white px-8 py-4 rounded-xl hover:from-gray-900 hover:to-black transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                Ver Mais Denúncias
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-orange-900/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-900 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-900 rounded-full opacity-10 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </motion.div>
            
            <h2 className="text-5xl font-bold text-white mb-6">
              Ajude a Proteger Outras Pessoas
            </h2>
            <p className="text-gray-300 text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
              Compartilhe sua experiência e evite que mais pessoas caiam em golpes. 
              Cada denúncia pode salvar alguém de um prejuízo. <span className="text-red-400 font-semibold">Seja parte da solução!</span>
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/denunciar"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-10 py-5 rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-semibold text-xl shadow-2xl hover:shadow-red-500/25"
              >
                <motion.svg 
                  className="w-7 h-7" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </motion.svg>
                Fazer uma Denúncia Agora
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}