'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { isAuthenticated, getToken } from '@/lib/auth'

// Schema de validação dividido por steps
const stepSchemas = {
  step1: yup.object({
    title: yup.string()
      .required('Título é obrigatório')
      .min(10, 'Título deve ter pelo menos 10 caracteres')
      .max(200, 'Título deve ter no máximo 200 caracteres'),
    category: yup.string()
      .required('Categoria é obrigatória'),
    description: yup.string()
      .required('Descrição é obrigatória')
      .min(50, 'Descrição deve ter pelo menos 50 caracteres')
      .max(5000, 'Descrição deve ter no máximo 5000 caracteres'),
  }),
  step2: yup.object({
    scammerName: yup.string()
      .max(100, 'Nome deve ter no máximo 100 caracteres'),
    scammerWebsite: yup.string()
      .url('URL inválida')
      .max(255, 'URL deve ter no máximo 255 caracteres'),
    scammerPhone: yup.string()
      .max(20, 'Telefone deve ter no máximo 20 caracteres'),
    scammerEmail: yup.string()
      .email('E-mail inválido')
      .max(100, 'E-mail deve ter no máximo 100 caracteres'),
    amountLost: yup.number()
      .min(0, 'Valor deve ser positivo')
      .nullable()
      .transform((value) => (isNaN(value) ? null : value)),
    dateOccurred: yup.date()
      .max(new Date(), 'Data não pode ser futura')
      .nullable(),
  }),
  step3: yup.object({
    anonymous: yup.boolean(),
  })
}

// Schema completo
const fullSchema = yup.object().shape({
  ...stepSchemas.step1.fields,
  ...stepSchemas.step2.fields,
  ...stepSchemas.step3.fields,
})

type FormData = yup.InferType<typeof fullSchema>

// Função helper para formatar telefone
const formatPhone = (value: string) => {
  const cleaned = value.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return value
}

// Função helper para formatar valor
const formatCurrency = (value: string) => {
  const cleaned = value.replace(/\D/g, '')
  const amount = parseInt(cleaned) / 100
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount)
}

// Componente de progresso
const ProgressBar = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {[1, 2, 3, 4].map((step) => (
          <motion.div
            key={step}
            className="flex items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: step * 0.1 }}
          >
            <motion.div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold
                ${step <= currentStep 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-200 text-gray-500'}
              `}
              animate={{
                scale: step === currentStep ? 1.1 : 1,
                transition: { type: 'spring', stiffness: 300 }
              }}
            >
              {step < currentStep ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step
              )}
            </motion.div>
            {step < totalSteps && (
              <div 
                className={`h-0.5 w-full sm:w-20 ${
                  step < currentStep ? 'bg-red-600' : 'bg-gray-200'
                }`}
              />
            )}
          </motion.div>
        ))}
      </div>
      <div className="flex justify-between text-xs sm:text-sm text-gray-600">
        <span className={currentStep >= 1 ? 'text-red-600 font-semibold' : ''}>Informações</span>
        <span className={currentStep >= 2 ? 'text-red-600 font-semibold' : ''}>Golpista</span>
        <span className={currentStep >= 3 ? 'text-red-600 font-semibold' : ''}>Evidências</span>
        <span className={currentStep >= 4 ? 'text-red-600 font-semibold' : ''}>Revisão</span>
      </div>
    </div>
  )
}

export default function DenunciarPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [documents, setDocuments] = useState<File[]>([])
  const [phoneValue, setPhoneValue] = useState('')
  const [amountValue, setAmountValue] = useState('')
  const [categories, setCategories] = useState<any[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<FormData>({
    resolver: yupResolver(fullSchema),
    mode: 'onChange',
    defaultValues: {
      anonymous: false,
    },
  })

  const formData = watch()

  // Buscar categorias do banco
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Erro ao buscar categorias:', err))
  }, [])

  useEffect(() => {
    setIsLoggedIn(isAuthenticated())
  }, [])

  // Dropzone para imagens
  const onDropImages = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    )
    
    if (imageFiles.length !== acceptedFiles.length) {
      alert('Alguns arquivos foram rejeitados. Apenas imagens até 5MB são aceitas.')
    }
    
    setImages(prev => [...prev, ...imageFiles].slice(0, 5))
  }, [])

  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDragActive
  } = useDropzone({
    onDrop: onDropImages,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 5,
  })

  // Dropzone para documentos
  const onDropDocuments = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => 
      file.size <= 10 * 1024 * 1024
    )
    
    if (validFiles.length !== acceptedFiles.length) {
      alert('Alguns arquivos foram rejeitados. Máximo 10MB por arquivo.')
    }
    
    setDocuments(prev => [...prev, ...validFiles].slice(0, 3))
  }, [])

  const {
    getRootProps: getDocRootProps,
    getInputProps: getDocInputProps,
    isDragActive: isDocDragActive
  } = useDropzone({
    onDrop: onDropDocuments,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 3,
  })

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setPhoneValue(formatted)
    setValue('scammerPhone', e.target.value.replace(/\D/g, ''))
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    if (value) {
      const formatted = formatCurrency(value)
      setAmountValue(formatted)
      setValue('amountLost', parseInt(value) / 100)
    } else {
      setAmountValue('')
      setValue('amountLost', null)
    }
  }

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = []
    
    if (currentStep === 1) {
      fieldsToValidate = ['title', 'category', 'description']
    } else if (currentStep === 2) {
      fieldsToValidate = ['scammerName', 'scammerWebsite', 'scammerPhone', 'scammerEmail', 'amountLost', 'dateOccurred']
    }
    
    const isValid = await trigger(fieldsToValidate)
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const onSubmit = async (data: FormData) => {
    if (!isLoggedIn && !data.anonymous) {
      const confirm = window.confirm(
        'Você precisa estar logado para denunciar. Deseja fazer login agora?'
      )
      if (confirm) {
        router.push('/login?returnUrl=/denunciar')
      }
      return
    }

    setLoading(true)
    try {
      // Preparar dados para envio
      const submitData: any = {
        title: data.title,
        description: data.description,
        category: data.category, // Já está no formato correto do enum
      }

      // Adicionar campos opcionais
      if (data.scammerName) submitData.scammerName = data.scammerName
      if (data.scammerWebsite) submitData.scammerWebsite = data.scammerWebsite
      if (data.scammerPhone) submitData.scammerPhone = data.scammerPhone
      if (data.scammerEmail) submitData.scammerEmail = data.scammerEmail
      if (data.amountLost) submitData.amountLost = Number(data.amountLost)
      if (data.dateOccurred) submitData.dateOccurred = data.dateOccurred

      // Por enquanto, enviar sem arquivos (adicionar upload de arquivos depois)
      const evidence: string[] = []
      if (images.length > 0) evidence.push('images_uploaded.jpg')
      if (documents.length > 0) evidence.push('documents_uploaded.pdf')
      if (evidence.length > 0) submitData.evidence = evidence

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(isLoggedIn && { 'Authorization': `Bearer ${getToken()}` })
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/scams`, {
        method: 'POST',
        headers,
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar denúncia')
      }

      const result = await response.json()
      
      // Mostrar mensagem de moderação
      alert(result.message || 'Denúncia enviada com sucesso! Ela será revisada pela nossa equipe de moderação antes de ser publicada.')
      router.push('/painel/denuncias')
    } catch (error) {
      console.error('Erro ao enviar denúncia:', error)
      alert('Erro ao enviar denúncia. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index))
  }

  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -50 }
  }

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Denunciar um Golpe</h1>
          <p className="text-gray-600 mb-8">
            Compartilhe sua experiência e ajude a proteger outras pessoas
          </p>
        </motion.div>

        <ProgressBar currentStep={currentStep} totalSteps={4} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {/* Step 1: Informações Básicas */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={pageTransition}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <span className="text-red-600">📝</span>
                  Informações Básicas
                </h2>
                
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título da Denúncia <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('title')}
                      className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.title ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Ex: Site falso vendendo iPhones com 90% de desconto"
                    />
                    {errors.title && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.title.message}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria do Golpe <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('category')}
                      className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.category ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.category.message}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição Detalhada <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register('description')}
                      rows={6}
                      className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.description ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Descreva em detalhes como o golpe aconteceu, incluindo todos os passos e informações relevantes..."
                    />
                    {errors.description && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.description.message}
                      </motion.p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                      {formData.description?.length || 0}/5000 caracteres
                    </p>
                  </motion.div>
                </div>

                <motion.div 
                  className="flex justify-end mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
                  >
                    Próximo →
                  </button>
                </motion.div>
              </motion.div>
            )}

            {/* Step 2: Informações do Golpista */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={pageTransition}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <span className="text-red-600">🔍</span>
                  Informações do Golpista
                </h2>
                <p className="text-gray-600 mb-6">Preencha apenas os campos que você possui informação</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome/Empresa
                    </label>
                    <input
                      type="text"
                      {...register('scammerName')}
                      className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.scammerName ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Nome do golpista ou empresa"
                    />
                    {errors.scammerName && (
                      <p className="text-red-500 text-sm mt-1">{errors.scammerName.message}</p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      {...register('scammerWebsite')}
                      className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.scammerWebsite ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="https://site-golpista.com"
                    />
                    {errors.scammerWebsite && (
                      <p className="text-red-500 text-sm mt-1">{errors.scammerWebsite.message}</p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={phoneValue}
                      onChange={handlePhoneChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.scammerPhone ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="(11) 99999-9999"
                    />
                    {errors.scammerPhone && (
                      <p className="text-red-500 text-sm mt-1">{errors.scammerPhone.message}</p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      {...register('scammerEmail')}
                      className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.scammerEmail ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="golpista@email.com"
                    />
                    {errors.scammerEmail && (
                      <p className="text-red-500 text-sm mt-1">{errors.scammerEmail.message}</p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor do Prejuízo
                    </label>
                    <input
                      type="text"
                      value={amountValue}
                      onChange={handleAmountChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.amountLost ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="R$ 0,00"
                    />
                    {errors.amountLost && (
                      <p className="text-red-500 text-sm mt-1">{errors.amountLost.message}</p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data do Ocorrido
                    </label>
                    <input
                      type="date"
                      {...register('dateOccurred')}
                      max={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.dateOccurred ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.dateOccurred && (
                      <p className="text-red-500 text-sm mt-1">{errors.dateOccurred.message}</p>
                    )}
                  </motion.div>
                </div>

                <motion.div 
                  className="flex justify-between mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-semibold"
                  >
                    ← Anterior
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
                  >
                    Próximo →
                  </button>
                </motion.div>
              </motion.div>
            )}

            {/* Step 3: Evidências */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={pageTransition}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <span className="text-red-600">📸</span>
                  Evidências e Documentos
                </h2>
                
                <div className="space-y-8">
                  {/* Upload de Imagens */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h3 className="text-lg font-medium mb-4">Evidências Visuais</h3>
                    <div
                      {...getImageRootProps()}
                      className={`border-3 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                        isImageDragActive 
                          ? 'border-red-500 bg-red-50 scale-105' 
                          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <input {...getImageInputProps()} />
                      <motion.div
                        animate={{ 
                          y: isImageDragActive ? -10 : 0,
                          scale: isImageDragActive ? 1.1 : 1
                        }}
                      >
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </motion.div>
                      <p className="text-gray-600 font-medium">
                        {isImageDragActive
                          ? 'Solte as imagens aqui...'
                          : 'Arraste imagens ou clique para selecionar'}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        PNG, JPG, GIF até 5MB (máximo 5 imagens)
                      </p>
                    </div>

                    {images.length > 0 && (
                      <motion.div 
                        className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {images.map((file, index) => (
                          <motion.div 
                            key={index} 
                            className="relative group"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg shadow-md"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Upload de Documentos */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-lg font-medium mb-4">Documentos Comprobatórios</h3>
                    <div
                      {...getDocRootProps()}
                      className={`border-3 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                        isDocDragActive 
                          ? 'border-red-500 bg-red-50 scale-105' 
                          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <input {...getDocInputProps()} />
                      <motion.div
                        animate={{ 
                          y: isDocDragActive ? -10 : 0,
                          scale: isDocDragActive ? 1.1 : 1
                        }}
                      >
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </motion.div>
                      <p className="text-gray-600 font-medium">
                        {isDocDragActive
                          ? 'Solte os documentos aqui...'
                          : 'Arraste documentos ou clique para selecionar'}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        PDF, DOC, DOCX, imagens até 10MB (máximo 3 documentos)
                      </p>
                    </div>

                    {documents.length > 0 && (
                      <motion.div 
                        className="mt-4 space-y-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {documents.map((file, index) => (
                          <motion.div 
                            key={index} 
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm"
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex items-center gap-3">
                              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-sm text-gray-700 font-medium">{file.name}</span>
                              <span className="text-xs text-gray-500">
                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeDocument(index)}
                              className="text-red-500 hover:text-red-700 transition-all transform hover:scale-110"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Opção de denúncia anônima */}
                  {!isLoggedIn && (
                    <motion.div 
                      className="p-6 bg-blue-50 border-2 border-blue-200 rounded-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('anonymous')}
                          className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div>
                          <span className="font-semibold text-blue-900">Denúncia Anônima</span>
                          <p className="text-sm text-blue-700">
                            Você pode denunciar sem criar uma conta, mas não poderá editar ou acompanhar sua denúncia.
                          </p>
                        </div>
                      </label>
                    </motion.div>
                  )}
                </div>

                <motion.div 
                  className="flex justify-between mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-semibold"
                  >
                    ← Anterior
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
                  >
                    Revisar →
                  </button>
                </motion.div>
              </motion.div>
            )}

            {/* Step 4: Revisão */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={pageTransition}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <span className="text-red-600">✅</span>
                  Revisão Final
                </h2>
                
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {/* Resumo das Informações */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-4">Informações da Denúncia</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Título:</span>
                        <span className="font-medium">{formData.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Categoria:</span>
                        <span className="font-medium">
                          {categories.find(c => c.value === formData.category)?.name || formData.category}
                        </span>
                      </div>
                      <div className="mt-4">
                        <span className="text-gray-600">Descrição:</span>
                        <p className="mt-2 text-gray-800 bg-white p-3 rounded">{formData.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Informações do Golpista */}
                  {(formData.scammerName || formData.scammerWebsite || formData.scammerEmail || formData.scammerPhone) && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-lg mb-4">Informações do Golpista</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {formData.scammerName && (
                          <div>
                            <span className="text-gray-600">Nome/Empresa:</span>
                            <p className="font-medium">{formData.scammerName}</p>
                          </div>
                        )}
                        {formData.scammerWebsite && (
                          <div>
                            <span className="text-gray-600">Website:</span>
                            <p className="font-medium text-red-600">{formData.scammerWebsite}</p>
                          </div>
                        )}
                        {formData.scammerEmail && (
                          <div>
                            <span className="text-gray-600">E-mail:</span>
                            <p className="font-medium">{formData.scammerEmail}</p>
                          </div>
                        )}
                        {formData.scammerPhone && (
                          <div>
                            <span className="text-gray-600">Telefone:</span>
                            <p className="font-medium">{phoneValue}</p>
                          </div>
                        )}
                        {formData.amountLost && (
                          <div>
                            <span className="text-gray-600">Prejuízo:</span>
                            <p className="font-medium text-red-600">{amountValue}</p>
                          </div>
                        )}
                        {formData.dateOccurred && (
                          <div>
                            <span className="text-gray-600">Data:</span>
                            <p className="font-medium">
                              {new Date(formData.dateOccurred).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Arquivos */}
                  {(images.length > 0 || documents.length > 0) && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-lg mb-4">Arquivos Anexados</h3>
                      <div className="space-y-2">
                        {images.length > 0 && (
                          <p className="text-gray-600">
                            📸 {images.length} imagem(ns) anexada(s)
                          </p>
                        )}
                        {documents.length > 0 && (
                          <p className="text-gray-600">
                            📄 {documents.length} documento(s) anexado(s)
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Avisos de Segurança */}
                  <motion.div 
                    className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                      ⚠️ Importante
                    </h3>
                    <ul className="text-sm text-yellow-800 space-y-2">
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Forneça informações verdadeiras e precisas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Denúncias falsas podem resultar em consequências legais</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Todas as denúncias passam por moderação antes de serem publicadas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        <span>Não inclua informações pessoais sensíveis (CPF, senhas, etc.)</span>
                      </li>
                    </ul>
                  </motion.div>
                </motion.div>

                <motion.div 
                  className="flex justify-between mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-semibold"
                  >
                    ← Anterior
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 font-semibold shadow-lg disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Enviar Denúncia
                      </>
                    )}
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </motion.div>
  )
}