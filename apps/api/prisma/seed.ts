import { PrismaClient, ScamCategory, ScamStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Dados realistas para golpes
const scamTitles = [
  'Site falso vendendo iPhones com 90% de desconto',
  'Golpe do falso suporte técnico da Microsoft',
  'Pirâmide financeira disfarçada de marketing multinível',
  'Site clone do Mercado Livre roubando dados',
  'Falso emprego home office pedindo pagamento antecipado',
  'Golpe do WhatsApp clonado pedindo dinheiro',
  'Site de apostas que não paga os prêmios',
  'Loja virtual que não entrega produtos',
  'Golpe do Pix errado com devolução dobrada',
  'Falso investimento em criptomoedas',
  'Venda de ingressos falsos para shows',
  'Golpe do FGTS liberado pelo governo',
  'Site falso de doações para ONGs',
  'Esquema de pirâmide com produtos de beleza',
  'Golpe do empréstimo sem consulta ao SPC',
  'Falso aluguel de temporada no litoral',
  'Golpe do carro batido vendido como novo',
  'Site falso de venda de passagens aéreas',
  'Golpe do romance no Tinder pedindo dinheiro',
  'Falsa vaga de emprego cobrando curso',
  'Golpe do boleto falso enviado por email',
  'Site clone da Netflix cobrando mensalidade',
  'Golpe do técnico de internet falso',
  'Venda de diplomas universitários falsos',
  'Golpe da maquininha com taxa zero',
  'Site falso vendendo tênis de marca',
  'Golpe do seguro de carro mais barato',
  'Falso consórcio contemplado',
  'Golpe do cartão clonado em posto de gasolina',
  'Site de compras coletivas fraudulento',
  'Golpe do falso sequestro',
  'Venda de produtos falsificados como originais',
  'Golpe do prêmio da loteria internacional',
  'Site falso de venda de eletrônicos',
  'Golpe do financiamento aprovado',
  'Falsa ONG pedindo doações',
  'Golpe do amor virtual internacional',
  'Site clone do Instagram roubando senhas',
  'Golpe da revisão do FGTS',
  'Venda de cursos online que não existem',
  'Golpe do aluguel sem visitar o imóvel',
  'Site falso de venda de celulares',
  'Golpe do empréstimo consignado',
  'Falsa venda de carro com preço abaixo da tabela',
  'Golpe do SMS da Receita Federal',
  'Site de namoro cobrando para conversar',
  'Golpe do falso advogado',
  'Venda de produtos diet milagrosos',
  'Golpe do Bitcoin fácil',
  'Site falso de venda de roupas de marca'
];

const descriptions = [
  'Recebi um anúncio no Instagram sobre iPhones com desconto absurdo. O site parecia legítimo, tinha HTTPS e tudo. Fiz o pagamento via Pix de R$ 500 e nunca recebi o produto. O site saiu do ar 3 dias depois.',
  'Apareceu um pop-up dizendo que meu computador estava infectado e precisava ligar para o suporte da Microsoft. Liguei e me cobraram R$ 300 para "limpar" o PC. Depois descobri que era golpe.',
  'Me chamaram para uma "oportunidade única" de ganhar dinheiro trabalhando de casa. Tive que investir R$ 2000 em produtos para revender. Nunca consegui vender nada e descobri que era pirâmide.',
  'Encontrei um anúncio de um notebook muito barato, o site era idêntico ao Mercado Livre. Coloquei meus dados do cartão e fizeram várias compras. Perdi R$ 5000.',
  'Vi uma vaga de emprego para trabalhar de casa ganhando R$ 5000. Pediram R$ 200 para o "kit inicial". Paguei e nunca mais responderam.',
  'Recebi mensagem no WhatsApp da minha "mãe" pedindo dinheiro urgente. O número era diferente mas ela disse que tinha perdido o celular. Transferi R$ 1000 e depois descobri que era golpe.',
  'Me cadastrei em um site de apostas que prometia dobrar o investimento. Depositei R$ 500, ganhei R$ 2000 mas quando tentei sacar, o site sumiu.',
  'Comprei um tênis em uma loja online com preço ótimo. Paguei R$ 300 via boleto, o prazo de entrega passou e o site não existe mais.',
  'Recebi um Pix de R$ 1000 "por engano" e a pessoa pediu para devolver R$ 2000 dizendo que era o valor correto. Devolvi e depois o Pix original foi estornado. Perdi R$ 2000.',
  'Um "especialista" em criptomoedas me prometeu 50% de lucro ao mês. Investi R$ 10.000 e em 2 meses a empresa sumiu com o dinheiro de todos.',
  'Comprei ingressos para show do meu artista favorito em um site que parecia oficial. Paguei R$ 800 por 2 ingressos VIP. No dia do show descobri que eram falsos.',
  'Recebi SMS dizendo que tinha R$ 2.500 de FGTS liberado pelo governo. Cliquei no link e preenchi meus dados. Roubaram R$ 3.000 da minha conta.',
  'Vi uma campanha no Facebook para ajudar crianças carentes. Doei R$ 500 mas descobri que a ONG não existia e as fotos eram falsas.',
  'Entrei em um esquema de venda de cosméticos onde prometiam lucro de R$ 10.000 por mês. Investi R$ 5.000 em produtos e não consegui vender nem R$ 500.',
  'Recebi uma ligação oferecendo empréstimo sem consulta ao SPC/Serasa. Paguei R$ 300 de "taxa administrativa" e nunca recebi o empréstimo.',
  'Aluguei uma casa na praia pelo Facebook. Transferi R$ 2.000 de sinal. Quando cheguei lá, a casa não estava disponível e o "proprietário" sumiu.',
  'Comprei um carro usado que parecia perfeito. Depois descobri que tinha sido batido e recuperado. O vendedor sumiu e perdi R$ 15.000.',
  'Encontrei passagens aéreas com 70% de desconto em um site. Paguei R$ 1.200 e recebi vouchers falsos. A companhia aérea nunca ouviu falar do site.',
  'Conheci alguém no Tinder, conversamos por meses. A pessoa pediu R$ 5.000 emprestado para uma emergência médica. Enviei o dinheiro e a pessoa sumiu.',
  'Me candidatei a uma vaga que exigia fazer um curso de R$ 800 antes de começar. Paguei o curso e a vaga nunca existiu.',
  'Recebi um boleto por email de uma compra que não fiz. Achei que era erro e paguei R$ 450. Era um boleto falso.',
  'Vi anúncio de Netflix vitalícia por R$ 50. Paguei e me deram uma conta que funcionou por 2 dias apenas.',
  'Um suposto técnico da operadora de internet bateu na minha porta. Cobrou R$ 150 por uma "manutenção obrigatória". Depois descobri que era golpe.',
  'Paguei R$ 3.000 por um diploma universitário que prometiam ser reconhecido pelo MEC. O diploma era completamente falso.',
  'Vendedor de maquininha me prometeu taxa zero e R$ 500 de bônus. Paguei R$ 200 pela ativação e nunca recebi a máquina.',
  'Comprei 3 pares de tênis Nike por R$ 400 em um site. Recebi produtos falsificados de péssima qualidade.',
  'Contratei um seguro de carro super barato online. Paguei R$ 1.200 à vista. Quando precisei acionar, descobri que a seguradora não existia.',
  'Me ligaram dizendo que fui contemplado em um consórcio. Paguei R$ 500 de taxa para liberar e obviamente era mentira.',
  'Clonaram meu cartão em um posto de gasolina. Fizeram compras de R$ 8.000 antes que eu percebesse.',
  'Site de compras coletivas oferecia 90% de desconto em restaurantes. Paguei R$ 200 em cupons e o site desapareceu.',
  'Recebi ligação dizendo que meu filho havia sido sequestrado. Em pânico, transferi R$ 10.000. Depois descobri que meu filho estava seguro na escola.',
  'Comprei perfumes importados por metade do preço. Paguei R$ 600 e recebi produtos falsificados que causaram alergia.',
  'Email dizendo que ganhei na loteria da Espanha. Paguei R$ 2.000 em "taxas" para receber o prêmio de 1 milhão de euros que nunca veio.',
  'Comprei uma TV 65" por R$ 1.500 em um site que parecia confiável. O site sumiu no dia seguinte com meu dinheiro.',
  'Recebi mensagem de financiamento pré-aprovado. Paguei R$ 800 de entrada e o financiamento nunca foi liberado.',
  'ONG pedindo doação para cachorros abandonados. Doei R$ 300 e descobri que usavam fotos roubadas da internet.',
  'Mulher estrangeira no Facebook dizendo que queria vir ao Brasil me conhecer. Enviei R$ 4.000 para passagem e visto. Era tudo mentira.',
  'Site pedindo login do Instagram para ganhar seguidores. Colocaram meus dados e roubaram minha conta com 10k de seguidores.',
  'SMS da Caixa sobre revisão do FGTS. Cliquei no link e colocaram meus dados. Tentaram fazer empréstimo em meu nome.',
  'Paguei R$ 1.500 em um curso online de marketing digital. O curso não existia e o site saiu do ar.',
  'Transferi R$ 3.000 de caução para alugar apartamento que vi apenas por fotos. O apartamento não existia.',
  'Comprei iPhone 13 por R$ 2.000 em site que parecia loja oficial. Recebi uma caixa com pedras.',
  'Fizeram empréstimo consignado em meu nome sem autorização. Descobri quando começaram a descontar do meu salário.',
  'Carro anunciado por R$ 20.000 abaixo da tabela. Transferi R$ 5.000 de sinal. O vendedor e o carro nunca existiram.',
  'SMS dizendo que tinha pendência com a Receita Federal. Cliquei no link e instalaram vírus que roubou dados bancários.',
  'Site de namoro cobrou R$ 100 para desbloquear conversas. Paguei e todas as mulheres eram perfis falsos.',
  'Falso advogado cobrou R$ 3.000 para resolver uma causa trabalhista. Sumiu com o dinheiro e não era advogado.',
  'Comprei shake emagrecedor milagroso por R$ 500. Não funcionou e me causou problemas de saúde.',
  'Investimento em Bitcoin prometendo lucro garantido. Perdi R$ 20.000 em esquema Ponzi.',
  'Loja online de roupas de grife com preços incríveis. Paguei R$ 1.200 e recebi roupas falsificadas de péssima qualidade.'
];

const userNames = [
  'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Ferreira',
  'Juliana Lima', 'Roberto Alves', 'Fernanda Souza', 'Lucas Rodrigues', 'Patricia Martins',
  'Marcos Pereira', 'Camila Gomes', 'Rafael Barbosa', 'Amanda Ribeiro', 'Bruno Carvalho',
  'Larissa Castro', 'Thiago Rocha', 'Beatriz Almeida', 'Felipe Dias', 'Mariana Araújo',
  'Gustavo Mendes', 'Isabela Ramos', 'Leonardo Nunes', 'Gabriela Tavares', 'Rodrigo Correia',
  'Carolina Cardoso', 'Daniel Teixeira', 'Natália Pinto', 'Eduardo Monteiro', 'Aline Moreira',
  'Vinicius Campos', 'Jessica Barros', 'Matheus Freitas', 'Priscila Machado', 'André Vieira',
  'Renata Moura', 'Paulo Nascimento', 'Cristina Farias', 'Diego Azevedo', 'Vanessa Reis',
  'Alexandre Cunha', 'Michele Sales', 'Ricardo Borges', 'Tatiana Viana', 'Henrique Lopes',
  'Sabrina Duarte', 'Gabriel Pires', 'Leticia Melo', 'Fernando Santana', 'Bruna Cavalcante'
];

const comments = [
  'Também caí nesse golpe! Perdi R$ 500',
  'Obrigado pelo alerta, quase caí nessa',
  'Denunciei na polícia mas não deu em nada',
  'O site ainda está no ar! Cuidado pessoal',
  'Consegui recuperar parte do dinheiro pelo banco',
  'Meu vizinho também foi vítima desse golpe',
  'Compartilhei no Facebook para alertar mais pessoas',
  'Como podemos denunciar esse site?',
  'Já são 5 pessoas que conheço que caíram nisso',
  'O golpista usa vários números diferentes',
  'Cuidado! Eles mudaram de nome mas é o mesmo golpe',
  'Recebi o mesmo golpe ontem por WhatsApp',
  'Muito obrigado por compartilhar, me ajudou muito',
  'A polícia federal precisa investigar isso',
  'Perdi R$ 2000 nesse golpe, estou desesperado',
  'Como você descobriu que era golpe?',
  'Eles ainda estão ativos no Instagram',
  'Denunciei no Reclame Aqui também',
  'Minha mãe quase caiu nesse golpe hoje',
  'Esse tipo de golpe está cada vez mais comum',
  'Consegui bloquear o Pix a tempo',
  'O banco não quer devolver meu dinheiro',
  'Vamos criar um grupo para denunciar juntos',
  'Encontrei o mesmo golpe com outro nome',
  'Cuidado com sites muito parecidos com os originais',
  'Sempre desconfie de preços muito baixos',
  'Nunca façam Pix para desconhecidos',
  'O Procon precisa tomar providências',
  'Esse golpista já foi preso?',
  'Compartilhem para alertar mais pessoas!'
];

const scammerWebsites = [
  'www.super-ofertas-iphone.com', 'www.desconto-maximo.net', 'www.loja-barata.shop',
  'www.promo-celular.online', 'www.oferta-relampago.site', 'www.mega-desconto.store',
  'www.preco-baixo.click', 'www.compre-agora.top', 'www.super-promo.club',
  'www.ofertas-imperdiveis.xyz', 'www.black-friday-sempre.com', 'www.desconto-total.net',
  'www.loja-confiavel.shop', 'www.melhor-preco.online', 'www.super-barato.site',
  'www.ofertas-unicas.store', 'www.promo-especial.click', 'www.desconto-vip.top',
  'www.mega-ofertas.club', 'www.preco-minimo.xyz'
];

const resolutionNotes = [
  'Site foi tirado do ar pela polícia federal após múltiplas denúncias',
  'Golpista foi preso em operação da polícia civil',
  'Conseguimos que o Procon interditasse a empresa',
  'Site removido após denúncia ao provedor de hospedagem',
  'Conta bancária do golpista foi bloqueada pela justiça',
  'Instagram removeu o perfil após denúncias em massa',
  'Operação policial prendeu quadrilha responsável',
  'Ministério Público abriu investigação e site foi bloqueado',
  'Anatel bloqueou o número usado no golpe',
  'Banco devolveu o dinheiro de todas as vítimas'
];

const resolutionLinks = [
  'https://g1.globo.com/noticia/policia-prende-quadrilha-golpe-pix',
  'https://www.uol.com.br/tilt/noticias/site-falso-vendas-tirado-ar',
  'https://www.folha.com.br/mercado/operacao-contra-piramide-financeira',
  'https://www.estadao.com.br/economia/golpe-whatsapp-clonado-pf',
  'https://www.cnnbrasil.com.br/nacional/procon-interdita-loja-virtual-fraude',
  'https://www.terra.com.br/noticias/brasil/policia-prende-estelionatarios',
  'https://www.r7.com/tecnologia/instagram-remove-perfis-golpistas',
  'https://valor.globo.com/brasil/noticia/mp-bloqueia-sites-fraudulentos',
  'https://oglobo.com/economia/noticia/anatel-bloqueia-numeros-golpe',
  'https://www.metropoles.com/brasil/justica-manda-banco-devolver-vitimas'
];

async function main() {
  console.log('🌱 Iniciando seed do banco de dados com dados completos...');

  // Limpar banco de dados
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.report.deleteMany();
  await prisma.scam.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  console.log('🧹 Banco de dados limpo');

  // Criar categorias
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        slug: 'phishing',
        name: 'Phishing',
        description: 'Sites e emails falsos que tentam roubar suas informações pessoais',
        icon: '🎣',
        tips: [
          'Sempre verifique o endereço do site',
          'Desconfie de emails com erros de português',
          'Bancos nunca pedem senha por email'
        ],
        riskLevel: 'HIGH'
      }
    }),
    prisma.category.create({
      data: {
        slug: 'fake-ecommerce',
        name: 'E-commerce Falso',
        description: 'Lojas online fraudulentas que não entregam produtos',
        icon: '🛒',
        tips: [
          'Pesquise a reputação da loja',
          'Desconfie de preços muito baixos',
          'Prefira pagamento na entrega quando possível'
        ],
        riskLevel: 'HIGH'
      }
    }),
    prisma.category.create({
      data: {
        slug: 'pyramid',
        name: 'Pirâmide Financeira',
        description: 'Esquemas que prometem lucros irreais',
        icon: '📊',
        tips: [
          'Desconfie de promessas de lucro fácil',
          'Investimentos sérios não garantem retornos altos',
          'Consulte a CVM sobre investimentos'
        ],
        riskLevel: 'CRITICAL'
      }
    })
  ]);

  console.log('✅ Categorias criadas');

  // Criar 50 usuários
  const users: any[] = [];
  for (let i = 0; i < 50; i++) {
    const user = await prisma.user.create({
      data: {
        name: userNames[i],
        email: `user${i + 1}@example.com`,
        password: await bcrypt.hash('senha123', 10),
        isAdmin: i === 0, // Primeiro usuário é admin
        bio: i === 0 ? 'Administrador do sistema' : `Usuário ativo na luta contra golpes online`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userNames[i]}`
      }
    });
    users.push(user);
  }

  console.log('✅ 50 usuários criados');

  // Criar 50 denúncias
  const scams: any[] = [];
  const categoriesEnum = [
    ScamCategory.PHISHING,
    ScamCategory.FAKE_ECOMMERCE,
    ScamCategory.PYRAMID_SCHEME,
    ScamCategory.TECH_SUPPORT,
    ScamCategory.ROMANCE_SCAM,
    ScamCategory.JOB_SCAM,
    ScamCategory.LOTTERY_SCAM,
    ScamCategory.CRYPTOCURRENCY,
    ScamCategory.INVESTMENT_FRAUD,
    ScamCategory.OTHER
  ];

  const statusEnum = [
    ScamStatus.VERIFIED,
    ScamStatus.VERIFIED,
    ScamStatus.VERIFIED,
    ScamStatus.UNVERIFIED,
    ScamStatus.PENDING
  ];

  for (let i = 0; i < 50; i++) {
    const isResolved = i < 10; // Primeiras 10 denúncias estão resolvidas
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomCategory = categoriesEnum[Math.floor(Math.random() * categoriesEnum.length)];
    const randomStatus = statusEnum[Math.floor(Math.random() * statusEnum.length)];
    
    const scam = await prisma.scam.create({
      data: {
        title: scamTitles[i],
        description: descriptions[i],
        category: randomCategory,
        status: randomStatus,
        userId: randomUser.id,
        scammerName: Math.random() > 0.3 ? `Empresa Golpista ${i + 1}` : null,
        scammerWebsite: Math.random() > 0.4 ? scammerWebsites[Math.floor(Math.random() * scammerWebsites.length)] : null,
        scammerPhone: Math.random() > 0.5 ? `+55 11 9${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}` : null,
        scammerEmail: Math.random() > 0.6 ? `contato@golpista${i + 1}.com` : null,
        amountLost: Math.random() > 0.3 ? Math.floor(Math.random() * 50000) + 100 : null,
        dateOccurred: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000), // Últimos 90 dias
        evidence: Math.random() > 0.5 ? ['screenshot1.jpg', 'screenshot2.jpg', 'comprovante.pdf'] : [],
        views: Math.floor(Math.random() * 5000) + 100,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Últimos 30 dias
        // Campos de resolução
        isResolved: isResolved,
        resolvedAt: isResolved ? new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000) : null,
        resolutionNote: isResolved ? resolutionNotes[Math.floor(Math.random() * resolutionNotes.length)] : null,
        resolutionLinks: isResolved ? [resolutionLinks[Math.floor(Math.random() * resolutionLinks.length)]] : [],
        resolvedBy: isResolved ? randomUser.id : null,
        categoryId: Math.random() > 0.7 ? categories[Math.floor(Math.random() * categories.length)].id : null
      }
    });
    scams.push(scam);
  }

  console.log('✅ 50 denúncias criadas (10 resolvidas)');

  // Criar comentários (média de 5 por denúncia)
  let commentCount = 0;
  for (const scam of scams) {
    const numComments = Math.floor(Math.random() * 10) + 1; // 1 a 10 comentários por denúncia
    
    for (let i = 0; i < numComments; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomComment = comments[Math.floor(Math.random() * comments.length)];
      
      await prisma.comment.create({
        data: {
          content: randomComment,
          userId: randomUser.id,
          scamId: scam.id,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000)
        }
      });
      commentCount++;
    }
  }

  console.log(`✅ ${commentCount} comentários criados`);

  // Criar curtidas (média de 10 por denúncia)
  let likeCount = 0;
  for (const scam of scams) {
    const numLikes = Math.floor(Math.random() * 20) + 1; // 1 a 20 curtidas por denúncia
    const usersWhoLiked = new Set();
    
    for (let i = 0; i < numLikes; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      // Evitar curtidas duplicadas do mesmo usuário
      if (!usersWhoLiked.has(randomUser.id)) {
        usersWhoLiked.add(randomUser.id);
        
        await prisma.like.create({
          data: {
            userId: randomUser.id,
            scamId: scam.id,
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000)
          }
        });
        likeCount++;
      }
    }
  }

  console.log(`✅ ${likeCount} curtidas criadas`);

  // Criar alguns reports para denúncias duvidosas
  let reportCount = 0;
  for (const scam of scams.slice(40, 50)) { // Últimas 10 denúncias têm reports
    const numReports = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numReports; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      await prisma.report.create({
        data: {
          userId: randomUser.id,
          scamId: scam.id,
          reason: ['FALSE_INFORMATION', 'SPAM', 'INAPPROPRIATE_CONTENT', 'DUPLICATE', 'OTHER'][Math.floor(Math.random() * 5)] as any,
          details: 'Esta denúncia parece suspeita ou duplicada',
          status: ['PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED'][Math.floor(Math.random() * 4)] as any
        }
      });
      reportCount++;
    }
  }

  console.log(`✅ ${reportCount} reports criados`);

  // Estatísticas finais
  const stats = {
    users: await prisma.user.count(),
    scams: await prisma.scam.count(),
    resolvedScams: await prisma.scam.count({ where: { isResolved: true } }),
    comments: await prisma.comment.count(),
    likes: await prisma.like.count(),
    reports: await prisma.report.count(),
    categories: await prisma.category.count()
  };

  console.log('\n📊 Estatísticas do banco de dados:');
  console.log(`   👥 Usuários: ${stats.users}`);
  console.log(`   🚨 Denúncias: ${stats.scams}`);
  console.log(`   ✅ Resolvidas: ${stats.resolvedScams}`);
  console.log(`   💬 Comentários: ${stats.comments}`);
  console.log(`   ❤️  Curtidas: ${stats.likes}`);
  console.log(`   ⚠️  Reports: ${stats.reports}`);
  console.log(`   📁 Categorias: ${stats.categories}`);

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('\n📧 Usuários de teste:');
  console.log('   Admin: user1@example.com / senha123');
  console.log('   User: user2@example.com / senha123');
  console.log('   (... até user50@example.com)');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });