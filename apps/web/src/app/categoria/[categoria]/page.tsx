import { notFound } from 'next/navigation'
import ScamCard from '@/components/ScamCard'
import Link from 'next/link'

const categoryInfo = {
  phishing: {
    title: 'Phishing',
    description: 'Golpes que tentam roubar dados pessoais através de sites e e-mails falsos',
    icon: '🎣',
    tips: [
      'Sempre verifique o URL do site antes de inserir dados',
      'Bancos nunca pedem senha por e-mail',
      'Desconfie de mensagens com urgência excessiva',
    ],
    apiCategory: 'PHISHING'
  },
  ecommerce: {
    title: 'E-commerce Falso',
    description: 'Sites de compras fraudulentos que não entregam produtos ou roubam dados de cartão',
    icon: '🛒',
    tips: [
      'Pesquise a reputação da loja antes de comprar',
      'Desconfie de preços muito abaixo do mercado',
      'Verifique se o site tem certificado de segurança (HTTPS)',
    ],
    apiCategory: 'FAKE_ECOMMERCE'
  },
  crypto: {
    title: 'Criptomoedas',
    description: 'Fraudes envolvendo Bitcoin e outras moedas digitais',
    icon: '₿',
    tips: [
      'Não existe investimento sem risco',
      'Desconfie de promessas de lucro garantido',
      'Verifique se a exchange é regulamentada',
    ],
    apiCategory: 'CRYPTOCURRENCY'
  },
  piramide: {
    title: 'Pirâmide Financeira',
    description: 'Esquemas que dependem do recrutamento constante de novos participantes',
    icon: '📊',
    tips: [
      'Se o foco é recrutar pessoas, é pirâmide',
      'Ganhos dependentes de indicações são suspeitos',
      'Pirâmides sempre quebram, não importa o tamanho',
    ],
    apiCategory: 'PYRAMID_SCHEME'
  }
}

async function fetchCategoryScams(category: string) {
  try {
    const apiCategory = categoryInfo[category as keyof typeof categoryInfo]?.apiCategory
    if (!apiCategory) return []
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/scams?category=${apiCategory}&limit=20`,
      { next: { revalidate: 60 } }
    )
    
    if (!response.ok) return []
    
    const data = await response.json()
    return data.scams || []
  } catch (error) {
    console.error('Failed to fetch category scams:', error)
    return []
  }
}

export default async function CategoriaPage({
  params
}: {
  params: { categoria: string }
}) {
  const category = categoryInfo[params.categoria as keyof typeof categoryInfo]
  
  if (!category) {
    notFound()
  }

  const scams = await fetchCategoryScams(params.categoria)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{category.icon}</span>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Golpes de {category.title}
              </h1>
              <p className="text-gray-600 mt-2">
                {category.description}
              </p>
            </div>
          </div>
        </div>

        {/* Dicas de Prevenção */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-yellow-900 mb-3">
            ⚠️ Como se Proteger
          </h2>
          <ul className="space-y-2">
            {category.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">•</span>
                <span className="text-yellow-800">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-red-600">{scams.length}</div>
            <div className="text-sm text-gray-600">Golpes Reportados</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-orange-600">Alto</div>
            <div className="text-sm text-gray-600">Nível de Risco</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">↑</div>
            <div className="text-sm text-gray-600">Em Crescimento</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">24h</div>
            <div className="text-sm text-gray-600">Resposta Média</div>
          </div>
        </div>

        {/* Lista de Golpes */}
        {scams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scams.map((scam: any) => (
              <ScamCard key={scam.id} scam={scam} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-500 mb-4">
              Nenhum golpe desta categoria foi reportado ainda.
            </p>
            <p className="text-gray-400 mb-6">
              Conhece algum golpe de {category.title}? Ajude a comunidade!
            </p>
            <Link
              href="/denunciar"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Denunciar Golpe de {category.title}
            </Link>
          </div>
        )}

        {/* Links Relacionados */}
        <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Explorar Outras Categorias</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(categoryInfo).map(([key, info]) => (
              <Link
                key={key}
                href={`/categoria/${key}`}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  key === params.categoria
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <span>{info.icon}</span>
                <span>{info.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/dicas"
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            Ver todas as dicas de segurança →
          </Link>
        </div>
      </div>
    </div>
  )
}