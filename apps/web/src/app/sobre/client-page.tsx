'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface Stats {
  scamsCount: number
  usersCount: number
  moneyPrevented: number
  commentsCount: number
}

export default function SobreClient() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time and fetch stats
    const timer = setTimeout(() => {
      setStats({
        scamsCount: 127,
        usersCount: 23,
        moneyPrevented: 450000,
        commentsCount: 89
      })
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
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

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  }

  const features = [
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      title: 'Denuncie',
      description: 'Compartilhe detalhes sobre o golpe que você identificou ou sofreu',
      color: 'bg-red-500'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Pesquise',
      description: 'Verifique se uma oferta ou empresa já foi denunciada',
      color: 'bg-blue-500'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Colabore',
      description: 'Comente e compartilhe informações para ajudar a comunidade',
      color: 'bg-green-500'
    }
  ]

  const benefits = [
    'Golpes online causam prejuízos de bilhões de reais por ano no Brasil',
    'A informação é a melhor defesa contra fraudadores',
    'Juntos podemos criar uma internet mais segura para todos',
    'Cada denúncia pode salvar dezenas de pessoas de prejuízos'
  ]

  const StatCard = ({ value, label, icon, delay }: { value: number | string; label: string; icon: React.ReactNode; delay: number }) => (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: "backOut" }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <motion.div
        className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center"
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
        {typeof value === 'number' && value > 1000 ? 
          `${(value / 1000).toFixed(0)}k` : 
          value}
      </motion.div>
      <div className="text-sm text-gray-600 font-medium">{label}</div>
    </motion.div>
  )

  const LoadingSkeleton = () => (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-12 bg-gray-200 rounded-lg w-96 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto animate-pulse"></div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-8">
          {[...Array(4)].map((_, i) => (
            <motion.div 
              key={i}
              className="bg-white rounded-xl shadow-sm p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-6xl font-bold text-gray-900 mb-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            🛡️ Sobre o Reclama Golpe
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Uma plataforma colaborativa criada para proteger a comunidade brasileira contra golpes e fraudes online
          </motion.p>
        </motion.div>

        <motion.div 
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Mission Section */}
          <motion.section 
            className="bg-white rounded-xl shadow-lg p-8 border border-gray-200"
            variants={sectionVariants}
          >
            <motion.div 
              className="flex items-center gap-4 mb-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
                whileHover={{ rotate: 5, scale: 1.1 }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900">Nossa Missão</h2>
            </motion.div>
            <motion.p 
              className="text-gray-700 leading-relaxed text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              O Reclama Golpe nasceu com a missão de criar uma comunidade forte e unida contra golpes e fraudes online. 
              Nossa plataforma permite que vítimas compartilhem suas experiências, alertando outros usuários e prevenindo 
              que mais pessoas caiam nos mesmos esquemas fraudulentos.
            </motion.p>
          </motion.section>

          {/* How it Works */}
          <motion.section 
            className="bg-white rounded-xl shadow-lg p-8 border border-gray-200"
            variants={sectionVariants}
          >
            <motion.div 
              className="flex items-center gap-4 mb-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center"
                whileHover={{ rotate: 5, scale: 1.1 }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900">Como Funciona</h2>
            </motion.div>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={containerVariants}
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="text-center group"
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                >
                  <motion.div 
                    className={`w-20 h-20 mx-auto mb-6 ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Why Important */}
          <motion.section 
            className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-lg p-8 border-2 border-yellow-200"
            variants={sectionVariants}
          >
            <motion.div 
              className="flex items-center gap-4 mb-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center"
                whileHover={{ rotate: 5, scale: 1.1 }}
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900">Por Que é Importante</h2>
            </motion.div>
            <motion.ul 
              className="space-y-4"
              variants={containerVariants}
            >
              {benefits.map((benefit, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-start gap-4"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1 flex-shrink-0"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <span className="text-gray-700 text-lg leading-relaxed">{benefit}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.section>

          {/* Community Stats */}
          <motion.section 
            className="bg-white rounded-xl shadow-lg p-8 border border-gray-200"
            variants={sectionVariants}
          >
            <motion.div 
              className="flex items-center gap-4 mb-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center"
                whileHover={{ rotate: 5, scale: 1.1 }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900">Nossa Comunidade</h2>
            </motion.div>
            
            <AnimatePresence>
              {stats && (
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-4 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <StatCard 
                    value={`${stats.scamsCount}+`}
                    label="Golpes Denunciados"
                    delay={0.1}
                    icon={
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    }
                  />
                  <StatCard 
                    value={`${stats.usersCount}+`}
                    label="Usuários Ativos"
                    delay={0.2}
                    icon={
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    }
                  />
                  <StatCard 
                    value={`R$ ${stats.moneyPrevented / 1000}k`}
                    label="Prejuízo Evitado"
                    delay={0.3}
                    icon={
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                  />
                  <StatCard 
                    value="100%"
                    label="Gratuito"
                    delay={0.4}
                    icon={
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          {/* Commitment */}
          <motion.section 
            className="bg-white rounded-xl shadow-lg p-8 border border-gray-200"
            variants={sectionVariants}
          >
            <motion.div 
              className="flex items-center gap-4 mb-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center"
                whileHover={{ rotate: 5, scale: 1.1 }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900">Compromisso com a Verdade</h2>
            </motion.div>
            <motion.div 
              className="space-y-4 text-gray-700 leading-relaxed text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p>
                Levamos a sério a responsabilidade de manter uma plataforma confiável. Todas as denúncias passam 
                por um processo de verificação e moderação. Empresas mencionadas têm direito de resposta e podem 
                contestar denúncias falsas.
              </p>
              <p>
                Nosso objetivo não é difamar, mas sim proteger consumidores e criar um ambiente de transparência 
                onde golpistas não possam operar impunemente.
              </p>
            </motion.div>
          </motion.section>

          {/* Developer Section */}
          <motion.section 
            className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-lg p-8 border-2 border-purple-200"
            variants={sectionVariants}
          >
            <motion.div 
              className="flex items-center gap-4 mb-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center"
                whileHover={{ rotate: 5, scale: 1.1 }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900">Sobre o Desenvolvedor</h2>
            </motion.div>
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-gray-700 leading-relaxed text-lg">
                <p className="mb-4">
                  Este projeto foi desenvolvido por <span className="font-bold text-purple-700">Emerson Garrido</span>, 
                  com o objetivo de criar uma ferramenta gratuita e acessível para proteger a comunidade brasileira 
                  contra golpes e fraudes online.
                </p>
                <p className="mb-6">
                  O Reclama Golpe é um <span className="font-semibold">projeto sem fins lucrativos</span> e de 
                  <span className="font-semibold"> código aberto</span>, disponível para toda a comunidade contribuir 
                  e melhorar continuamente.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <motion.a
                  href="https://www.instagram.com/oemersongarrido"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12c0-3.403 2.759-6.162 6.162-6.162s6.162 2.759 6.162 6.162-2.759 6.162-6.162 6.162-6.162-2.759-6.162-6.162zm1.622 0c0 2.507 2.034 4.541 4.54 4.541s4.541-2.034 4.541-4.541-2.034-4.541-4.541-4.541-4.54 2.034-4.54 4.541zm10.901-4.337c0 .798-.644 1.442-1.442 1.442-.797 0-1.442-.644-1.442-1.442 0-.798.645-1.442 1.442-1.442.798 0 1.442.644 1.442 1.442z"/>
                  </svg>
                  <span>Seguir no Instagram</span>
                </motion.a>
                
                <motion.a
                  href="https://github.com/EmersonGarrido/reclama-golpe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-gray-800 text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-all font-medium shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>Ver no GitHub</span>
                </motion.a>
              </div>
              
              <div className="mt-6 p-4 bg-white/60 rounded-lg text-center">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Nota:</span> Este é um projeto open source e sem fins lucrativos, 
                  criado para ajudar a comunidade brasileira a se proteger contra golpes online.
                </p>
              </div>
            </motion.div>
          </motion.section>

          {/* CTA */}
          <motion.div 
            className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-8 text-center"
            variants={sectionVariants}
            whileHover={{ scale: 1.02 }}
          >
            <motion.h3 
              className="text-3xl font-bold text-red-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              🚀 Faça Parte da Mudança
            </motion.h3>
            <motion.p 
              className="text-red-800 mb-6 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Sua denúncia pode ser a diferença entre alguém cair em um golpe ou se proteger a tempo.
            </motion.p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/denunciar"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-semibold shadow-lg hover:shadow-xl text-lg"
              >
                <motion.svg 
                  className="w-6 h-6" 
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
                Denunciar um Golpe
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}