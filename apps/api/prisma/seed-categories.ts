import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  {
    slug: 'phishing',
    name: 'Phishing',
    description: 'Golpes que tentam roubar dados pessoais através de sites, e-mails ou mensagens falsas que se passam por empresas legítimas.',
    icon: '🎣',
    tips: [
      'Sempre verifique o URL do site antes de inserir dados pessoais',
      'Bancos e empresas sérias nunca pedem senha por e-mail',
      'Desconfie de mensagens com urgência excessiva ou ameaças',
      'Verifique o remetente real do e-mail, não apenas o nome exibido',
      'Use autenticação de dois fatores sempre que possível'
    ],
    riskLevel: 'HIGH',
    order: 1
  },
  {
    slug: 'ecommerce-falso',
    name: 'E-commerce Falso',
    description: 'Sites de compras fraudulentos que não entregam produtos, vendem itens falsificados ou roubam dados de cartão de crédito.',
    icon: '🛒',
    tips: [
      'Pesquise a reputação da loja no Reclame Aqui e Google',
      'Desconfie de preços muito abaixo do mercado',
      'Verifique se o site tem certificado de segurança (HTTPS)',
      'Confirme o CNPJ da empresa na Receita Federal',
      'Prefira pagar com cartão de crédito ou intermediadores'
    ],
    riskLevel: 'HIGH',
    order: 2
  },
  {
    slug: 'piramide-financeira',
    name: 'Pirâmide Financeira',
    description: 'Esquemas que prometem lucros fáceis baseados no recrutamento de novos participantes, não em produtos ou serviços reais.',
    icon: '📊',
    tips: [
      'Se o foco principal é recrutar pessoas, é pirâmide',
      'Desconfie de promessas de enriquecimento rápido',
      'Ganhos dependentes apenas de indicações são suspeitos',
      'Pirâmides sempre quebram, não importa o tamanho',
      'Verifique se a empresa tem produtos/serviços reais'
    ],
    riskLevel: 'CRITICAL',
    order: 3
  },
  {
    slug: 'criptomoedas',
    name: 'Golpes com Criptomoedas',
    description: 'Fraudes envolvendo Bitcoin e outras moedas digitais, incluindo exchanges falsas, esquemas Ponzi e promessas de lucros garantidos.',
    icon: '₿',
    tips: [
      'Não existe investimento sem risco ou lucro garantido',
      'Verifique se a exchange é regulamentada e tem boa reputação',
      'Nunca compartilhe suas chaves privadas',
      'Desconfie de celebridades promovendo criptomoedas',
      'Pesquise muito antes de investir em qualquer projeto'
    ],
    riskLevel: 'CRITICAL',
    order: 4
  },
  {
    slug: 'suporte-tecnico',
    name: 'Suporte Técnico Falso',
    description: 'Golpistas se passam por suporte técnico de grandes empresas para obter acesso remoto ao computador ou cobrar por serviços desnecessários.',
    icon: '💻',
    tips: [
      'Microsoft, Apple e Google NUNCA ligam oferecendo suporte',
      'Nunca permita acesso remoto ao seu computador para desconhecidos',
      'Desconfie de pop-ups dizendo que seu PC está infectado',
      'Suporte oficial só através dos canais oficiais das empresas',
      'Não pague por "limpeza" ou antivírus por telefone'
    ],
    riskLevel: 'HIGH',
    order: 5
  },
  {
    slug: 'romance',
    name: 'Golpe Romântico',
    description: 'Criminosos criam perfis falsos em sites de namoro para conquistar vítimas emocionalmente e depois pedir dinheiro.',
    icon: '❤️',
    tips: [
      'Desconfie de perfis perfeitos demais ou genéricos',
      'Nunca envie dinheiro para alguém que conheceu online',
      'Cuidado com pedidos de ajuda financeira urgente',
      'Faça videochamadas antes de confiar em alguém',
      'Pesquise as fotos do perfil no Google Imagens'
    ],
    riskLevel: 'HIGH',
    order: 6
  },
  {
    slug: 'emprego-falso',
    name: 'Golpe de Emprego',
    description: 'Ofertas de emprego falsas que cobram taxas antecipadas, roubam dados pessoais ou envolvem as vítimas em atividades ilegais.',
    icon: '💼',
    tips: [
      'Empresas sérias não cobram para contratar',
      'Desconfie de salários muito acima da média',
      'Pesquise sobre a empresa antes da entrevista',
      'Não forneça documentos pessoais antes da contratação formal',
      'Cuidado com "trabalhos" que envolvem receber e repassar dinheiro'
    ],
    riskLevel: 'MEDIUM',
    order: 7
  },
  {
    slug: 'loteria',
    name: 'Golpe de Loteria/Prêmio',
    description: 'Notificações falsas de prêmios em loterias ou sorteios que você não participou, exigindo pagamento de taxas para "liberar" o prêmio.',
    icon: '🎰',
    tips: [
      'Você não pode ganhar uma loteria que não jogou',
      'Prêmios legítimos nunca exigem pagamento antecipado',
      'Desconfie de mensagens sobre prêmios inesperados',
      'Loterias oficiais têm canais oficiais de comunicação',
      'Não forneça dados pessoais para "receber prêmios"'
    ],
    riskLevel: 'MEDIUM',
    order: 8
  },
  {
    slug: 'investimento',
    name: 'Fraude de Investimento',
    description: 'Ofertas de investimentos com promessas irreais de retorno, operações de forex fraudulentas ou gestores falsos.',
    icon: '💰',
    tips: [
      'Verifique se a corretora é autorizada pela CVM',
      'Desconfie de rentabilidades muito acima do mercado',
      'Pesquise sobre a empresa e seus responsáveis',
      'Não invista em algo que não entende completamente',
      'Cuidado com "gurus" prometendo riqueza rápida'
    ],
    riskLevel: 'CRITICAL',
    order: 9
  },
  {
    slug: 'whatsapp',
    name: 'Golpes via WhatsApp',
    description: 'Golpes aplicados através do WhatsApp, incluindo clonagem de conta, pedidos falsos de dinheiro e links maliciosos.',
    icon: '📱',
    tips: [
      'Ative a verificação em duas etapas no WhatsApp',
      'Nunca compartilhe códigos de verificação',
      'Ligue para confirmar antes de fazer transferências',
      'Desconfie de mensagens pedindo dinheiro urgente',
      'Não clique em links suspeitos recebidos por mensagem'
    ],
    riskLevel: 'HIGH',
    order: 10
  },
  {
    slug: 'boleto-falso',
    name: 'Boleto Falso',
    description: 'Boletos adulterados ou completamente falsos enviados por e-mail ou WhatsApp para desviar pagamentos.',
    icon: '📄',
    tips: [
      'Sempre confira os dados do beneficiário',
      'Verifique o código de barras em sites oficiais dos bancos',
      'Baixe boletos apenas do site oficial da empresa',
      'Desconfie de boletos recebidos por e-mail não solicitado',
      'Compare o valor com o esperado'
    ],
    riskLevel: 'HIGH',
    order: 11
  },
  {
    slug: 'pix',
    name: 'Golpes do Pix',
    description: 'Fraudes específicas usando o sistema Pix, incluindo sequestro de contas, QR codes falsos e engenharia social.',
    icon: '💸',
    tips: [
      'Configure limites baixos para Pix noturno',
      'Sempre confirme os dados do destinatário',
      'Cuidado com QR Codes em lugares públicos',
      'Cadastre apenas chaves Pix que você controla',
      'Use o Pix Cobrança para receber com segurança'
    ],
    riskLevel: 'HIGH',
    order: 12
  },
  {
    slug: 'cartao-clonado',
    name: 'Clonagem de Cartão',
    description: 'Roubo de dados do cartão de crédito/débito através de dispositivos em caixas eletrônicos, sites falsos ou vazamentos.',
    icon: '💳',
    tips: [
      'Verifique se há dispositivos estranhos em caixas eletrônicos',
      'Cubra o teclado ao digitar a senha',
      'Use cartões virtuais para compras online',
      'Monitore regularmente sua fatura',
      'Ative notificações de transações no app do banco'
    ],
    riskLevel: 'HIGH',
    order: 13
  },
  {
    slug: 'emprestimo-falso',
    name: 'Empréstimo Fraudulento',
    description: 'Ofertas de empréstimo que cobram taxas antecipadas, roubam dados ou aplicam juros abusivos.',
    icon: '🏦',
    tips: [
      'Instituições sérias não cobram antecipado para emprestar',
      'Verifique se a empresa é autorizada pelo Banco Central',
      'Leia todo o contrato antes de assinar',
      'Desconfie de aprovações muito fáceis ou rápidas',
      'Compare taxas com outras instituições'
    ],
    riskLevel: 'MEDIUM',
    order: 14
  },
  {
    slug: 'falso-sequestro',
    name: 'Golpe do Falso Sequestro',
    description: 'Ligações falsas alegando sequestro de familiares para extorquir dinheiro das vítimas em pânico.',
    icon: '📞',
    tips: [
      'Mantenha a calma e não desligue o telefone',
      'Peça para falar com o familiar supostamente sequestrado',
      'Use outro telefone para ligar para o familiar',
      'Não forneça informações sobre sua família',
      'Denuncie imediatamente à polícia'
    ],
    riskLevel: 'HIGH',
    order: 15
  },
  {
    slug: 'redes-sociais',
    name: 'Golpes em Redes Sociais',
    description: 'Fraudes através de perfis falsos, promoções enganosas, vendas fraudulentas e roubo de contas em redes sociais.',
    icon: '📲',
    tips: [
      'Verifique se o perfil tem o selo de verificado',
      'Desconfie de promoções muito generosas',
      'Não clique em links encurtados suspeitos',
      'Use autenticação de dois fatores em suas contas',
      'Denuncie e bloqueie perfis suspeitos'
    ],
    riskLevel: 'MEDIUM',
    order: 16
  },
  {
    slug: 'falsa-central',
    name: 'Falsa Central de Atendimento',
    description: 'Números de telefone falsos que se passam por centrais de atendimento de bancos ou empresas para roubar dados.',
    icon: '☎️',
    tips: [
      'Sempre busque o número oficial no site da empresa',
      'Bancos não pedem senha completa por telefone',
      'Desconfie se pedirem para instalar aplicativos',
      'Não forneça códigos recebidos por SMS',
      'Desligue e ligue para o número oficial se suspeitar'
    ],
    riskLevel: 'HIGH',
    order: 17
  },
  {
    slug: 'nft-metaverso',
    name: 'Golpes com NFT e Metaverso',
    description: 'Fraudes envolvendo tokens não fungíveis (NFTs), terrenos virtuais e projetos falsos de metaverso.',
    icon: '🎨',
    tips: [
      'Pesquise profundamente sobre o projeto e criadores',
      'Verifique a autenticidade dos contratos inteligentes',
      'Cuidado com promessas de valorização garantida',
      'Não conecte sua carteira em sites suspeitos',
      'Desconfie de NFTs com preços muito abaixo do mercado'
    ],
    riskLevel: 'HIGH',
    order: 18
  },
  {
    slug: 'influencer-falso',
    name: 'Golpe de Influencer Falso',
    description: 'Perfis que se passam por influencers famosos ou criam personas falsas para vender produtos, cursos ou investimentos duvidosos.',
    icon: '⭐',
    tips: [
      'Verifique se o perfil é verificado oficialmente',
      'Pesquise sobre denúncias e reclamações',
      'Desconfie de resultados extraordinários',
      'Não compre baseado apenas em depoimentos',
      'Procure provas reais dos resultados prometidos'
    ],
    riskLevel: 'MEDIUM',
    order: 19
  },
  {
    slug: 'outros',
    name: 'Outros Golpes',
    description: 'Categoria para golpes que não se encaixam nas categorias específicas ou novos tipos de fraudes ainda não catalogados.',
    icon: '⚠️',
    tips: [
      'Sempre desconfie de ofertas muito boas para ser verdade',
      'Pesquise sobre a empresa ou pessoa antes de negociar',
      'Não forneça dados pessoais desnecessariamente',
      'Guarde todos os comprovantes e conversas',
      'Denuncie qualquer tentativa de golpe às autoridades'
    ],
    riskLevel: 'MEDIUM',
    order: 20
  }
]

async function seedCategories() {
  console.log('🌱 Iniciando seed de categorias...')
  
  for (const category of categories) {
    const existing = await prisma.category.findUnique({
      where: { slug: category.slug }
    })

    if (existing) {
      console.log(`✓ Categoria "${category.name}" já existe, atualizando...`)
      await prisma.category.update({
        where: { slug: category.slug },
        data: category
      })
    } else {
      console.log(`+ Criando categoria "${category.name}"...`)
      await prisma.category.create({
        data: category
      })
    }
  }

  const totalCategories = await prisma.category.count()
  console.log(`\n✅ Seed concluído! Total de categorias: ${totalCategories}`)
}

seedCategories()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })