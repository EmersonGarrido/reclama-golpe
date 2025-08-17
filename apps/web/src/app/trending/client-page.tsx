'use client'

import { motion } from 'framer-motion'
import ScamCard from '@/components/ScamCard'
import Link from 'next/link'

interface TrendingClientProps {
  scams: any[]
}

const AnimatedScamCard = ({ scam, index }: { scam: any; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      duration: 0.5, 
      delay: index * 0.1,
      ease: "easeOut"
    }}
    whileHover={{ 
      y: -5,
      transition: { duration: 0.2 }
    }}
  >
    <ScamCard scam={scam} />
  </motion.div>
)

const StatCard = ({ icon, label, delay, color }: { icon: React.ReactNode; label: string; delay: number; color: string }) => (
  <motion.div
    className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ 
      duration: 0.6, 
      delay,
      ease: "easeOut"
    }}
    whileHover={{ 
      scale: 1.05,
      transition: { duration: 0.2 }
    }}
  >
    <motion.div 
      className={`w-12 h-12 mx-auto mb-3 rounded-full ${color} flex items-center justify-center`}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: delay + 0.3, duration: 0.4, ease: "backOut" }}
    >
      {icon}
    </motion.div>
    <motion.div 
      className="text-sm text-gray-600 text-center font-medium"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay + 0.5 }}
    >
      {label}
    </motion.div>
  </motion.div>
)

export default function TrendingClient({ scams }: TrendingClientProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-5xl font-bold text-gray-900 mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4, ease: "backOut" }}
            >
              🔥
            </motion.span>{' '}
            Golpes em Alta
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Os golpes mais visualizados e denunciados nos últimos 7 dias
          </motion.p>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <StatCard 
            icon={
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
              </svg>
            }
            label="Alto Risco" 
            delay={0.1} 
            color="bg-red-500"
          />
          <StatCard 
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            label="Em Crescimento" 
            delay={0.2} 
            color="bg-orange-500"
          />
          <StatCard 
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
            label="Mais Visualizados" 
            delay={0.3} 
            color="bg-blue-500"
          />
          <StatCard 
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
            label="Mais Comentados" 
            delay={0.4} 
            color="bg-green-500"
          />
        </motion.div>

        {/* Trending List */}
        {scams.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.h2 
              className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <motion.div
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.8, duration: 0.5, ease: "backOut" }}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </motion.div>
              Rankings dos Golpes
            </motion.h2>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {scams.map((scam, index) => (
                <div key={scam.id} className="relative">
                  {/* Ranking Badge */}
                  {index < 3 && (
                    <motion.div
                      className={`absolute -top-2 -left-2 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        'bg-orange-400'
                      }`}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        delay: 0.8 + index * 0.1, 
                        duration: 0.6,
                        ease: "backOut"
                      }}
                    >
                      {index + 1}
                    </motion.div>
                  )}
                  <AnimatedScamCard scam={scam} index={index} />
                </div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            className="bg-white rounded-xl p-12 text-center shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, duration: 0.4, ease: "backOut" }}
              className="text-6xl mb-4"
            >
              📈
            </motion.div>
            <motion.p 
              className="text-gray-500 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Nenhum golpe em alta no momento
            </motion.p>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
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
              Denunciar Novo Golpe
            </Link>
          </motion.div>
          
          <motion.p 
            className="mt-4 text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            Ajude a proteger outras pessoas compartilhando sua experiência
          </motion.p>
        </motion.div>

        {/* Additional Info Section */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <motion.h3 
            className="text-2xl font-bold text-gray-900 mb-4 text-center flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
          >
            <motion.div
              className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1.8, duration: 0.5, ease: "backOut" }}
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.58a9.42 9.42 0 100 18.84 9.42 9.42 0 000-18.84zM12 17a1 1 0 01-1-1v-4a1 1 0 012 0v4a1 1 0 01-1 1zm0-8a1 1 0 01-1-1V7a1 1 0 012 0v1a1 1 0 01-1 1z"/>
              </svg>
            </motion.div>
            Como Identificar Golpes em Alta
          </motion.h3>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { 
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                color: "bg-purple-500",
                title: "Volume de Denúncias", 
                desc: "Muitas pessoas relatando o mesmo golpe" 
              },
              { 
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ),
                color: "bg-indigo-500",
                title: "Visualizações", 
                desc: "Alto número de acessos e interesse público" 
              },
              { 
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                color: "bg-pink-500",
                title: "Período Recente", 
                desc: "Atividade suspeita nos últimos 7 dias" 
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className={`w-16 h-16 mx-auto mb-4 rounded-full ${item.color} flex items-center justify-center shadow-lg`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.8 + index * 0.1, duration: 0.5, ease: "backOut" }}
                >
                  {item.icon}
                </motion.div>
                <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}