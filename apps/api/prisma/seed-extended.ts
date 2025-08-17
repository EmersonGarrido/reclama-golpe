import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const golpesData = [
  // E-commerce falso
  { title: "Site falso vendendo iPhones com 90% de desconto", category: "FAKE_ECOMMERCE", description: "Encontrei um site que estava vendendo iPhone 15 Pro por apenas R$ 500. O site parecia legítimo, tinha HTTPS, imagens profissionais e até depoimentos. Fiz o pagamento via Pix e nunca recebi o produto.", scammerWebsite: "www.super-ofertas-iphone.com", amountLost: 500 },
  { title: "Loja virtual golpista vendendo tênis Nike falsos", category: "FAKE_ECOMMERCE", description: "Comprei 3 pares de tênis Nike por um preço muito abaixo do mercado. O site tinha CNPJ, endereço e tudo mais. Após o pagamento, recebi produtos falsificados de péssima qualidade.", scammerWebsite: "www.tenis-barato.com.br", amountLost: 750 },
  { title: "Marketplace falso vendendo eletrônicos", category: "FAKE_ECOMMERCE", description: "Site que se passava por marketplace conhecido vendendo TVs e notebooks. Depois do pagamento, o site saiu do ar e perdi R$ 3.500.", scammerWebsite: "megaofertas.shop", amountLost: 3500 },
  { title: "Instagram shop vendendo roupas de grife falsas", category: "FAKE_ECOMMERCE", description: "Perfil no Instagram com milhares de seguidores vendendo roupas de grife. Paguei e nunca recebi os produtos. O perfil foi deletado.", scammerName: "@fashion_outlet_br", amountLost: 1200 },
  { title: "Site clone da Amazon cobrando assinatura Prime falsa", category: "FAKE_ECOMMERCE", description: "Recebi um email dizendo que minha assinatura Prime havia expirado. Cliquei no link e paguei a renovação. Era um site clone.", scammerWebsite: "amazon-br.net", amountLost: 120 },

  // Phishing
  { title: "Falso email do banco pedindo atualização cadastral", category: "PHISHING", description: "Recebi email idêntico ao do meu banco pedindo para atualizar dados. Cliquei no link e forneci senha. Tiveram acesso à minha conta.", scammerEmail: "atendimento@brancocentral.com", amountLost: 5000 },
  { title: "SMS falso sobre pacote nos Correios", category: "PHISHING", description: "Recebi SMS dizendo que tinha um pacote retido nos Correios e precisava pagar taxa. O link levava a site falso que roubava dados do cartão.", scammerPhone: "+55 11 98765-4321", amountLost: 300 },
  { title: "WhatsApp clonado pedindo dinheiro emprestado", category: "PHISHING", description: "Clonaram o WhatsApp da minha mãe e pediram dinheiro emprestado urgente. Transferi R$ 2.000 antes de descobrir que era golpe.", scammerPhone: "+55 21 99999-8888", amountLost: 2000 },
  { title: "Email falso da Receita Federal sobre restituição", category: "PHISHING", description: "Email dizendo que eu tinha direito a restituição de R$ 3.000. Pediram dados bancários e documentos. Era golpe.", scammerEmail: "receita@gov-br.net", amountLost: 0 },
  { title: "Golpe do falso suporte do Instagram", category: "PHISHING", description: "Recebi mensagem dizendo que minha conta seria deletada. Pediram senha para 'verificar'. Perdi acesso à conta com 50k seguidores.", scammerName: "@instagram_support_br", amountLost: 0 },

  // Pirâmide
  { title: "Pirâmide financeira disfarçada de marketing multinível", category: "PYRAMID_SCHEME", description: "Fui convidado para uma 'oportunidade de negócio' que prometia ganhos de R$ 10.000 por mês trabalhando de casa. Tive que pagar R$ 2.000 para entrar.", scammerName: "MMN Success Brasil", amountLost: 2000 },
  { title: "Esquema de investimento em criptomoedas fraudulento", category: "PYRAMID_SCHEME", description: "Empresa prometia 50% de lucro ao mês com trading de Bitcoin. Investi R$ 10.000 e nunca consegui sacar. Site sumiu.", scammerWebsite: "cryptomax-invest.com", amountLost: 10000 },
  { title: "Grupo de investimento coletivo no Instagram", category: "PYRAMID_SCHEME", description: "Influencer prometia multiplicar dinheiro em 30 dias. Precisava indicar 3 pessoas. Clássica pirâmide que quebrou em 2 meses.", scammerName: "@investidor_milionario", amountLost: 5000 },
  { title: "Clube de benefícios que na verdade era pirâmide", category: "PYRAMID_SCHEME", description: "Sistema de pontos e níveis onde você ganhava indicando pessoas. Prometiam carro e viagens. Tudo mentira.", scammerWebsite: "clubevip-beneficios.com", amountLost: 3000 },
  { title: "Esquema de 'renda extra' com vendas online", category: "PYRAMID_SCHEME", description: "Curso de R$ 2.997 que prometia ensinar a ganhar R$ 10k/mês. Era só um esquema para recrutar mais pessoas para o curso.", scammerName: "Método Renda Online", amountLost: 2997 },

  // Suporte técnico
  { title: "Golpe do falso suporte técnico da Microsoft", category: "TECH_SUPPORT", description: "Recebi ligação dizendo ser do suporte técnico da Microsoft, alegando que meu computador estava infectado. Cobraram R$ 300 pelo 'serviço'.", scammerPhone: "+55 11 3333-4444", amountLost: 300 },
  { title: "Pop-up falso de vírus no computador", category: "TECH_SUPPORT", description: "Apareceu pop-up dizendo que meu PC tinha vírus. Liguei no número e deram acesso remoto. Roubaram senhas e arquivos.", scammerPhone: "0800-123-4567", amountLost: 500 },
  { title: "Falso técnico de internet pedindo acesso ao roteador", category: "TECH_SUPPORT", description: "Pessoa se passou por técnico da operadora dizendo que precisava 'otimizar' minha internet. Deu acesso e hackearam minha rede.", scammerName: "João Silva - Técnico", amountLost: 0 },
  { title: "Golpe do antivírus falso", category: "TECH_SUPPORT", description: "Baixei um 'antivírus' que na verdade era malware. Cobrava R$ 199 para 'limpar' problemas inexistentes.", scammerWebsite: "super-antivirus.net", amountLost: 199 },
  { title: "Falso suporte do WhatsApp cobrando para verificar conta", category: "TECH_SUPPORT", description: "Recebi mensagem dizendo que meu WhatsApp seria bloqueado. Cobraram R$ 50 para 'verificar' a conta.", scammerPhone: "+55 11 95555-1234", amountLost: 50 },

  // Romance
  { title: "Golpe do amor: estrangeiro pedindo dinheiro", category: "ROMANCE_SCAM", description: "Conheci um 'médico americano' no Facebook. Após meses de conversa, pediu R$ 5.000 para vir me visitar no Brasil.", scammerName: "Dr. Michael Johnson", amountLost: 5000 },
  { title: "Perfil falso no Tinder pedindo ajuda financeira", category: "ROMANCE_SCAM", description: "Match no Tinder que após semanas pediu dinheiro para emergência médica da mãe. Transferi R$ 2.000 e pessoa sumiu.", scammerName: "Ana Paula Silva", amountLost: 2000 },
  { title: "Golpe do sugar daddy no Instagram", category: "ROMANCE_SCAM", description: "Perfil oferecendo ser 'sugar daddy' mas pedia taxa de R$ 500 para 'liberar' mesada de R$ 5.000. Óbvio golpe.", scammerName: "@sugardaddy_br", amountLost: 500 },
  { title: "Militar americano pedindo dinheiro para voltar ao Brasil", category: "ROMANCE_SCAM", description: "Disse ser militar americano em missão. Pediu dinheiro para documentação para visitar o Brasil. Golpe clássico.", scammerName: "Sergeant John Smith", amountLost: 3000 },
  { title: "Golpe do relacionamento virtual com modelo", category: "ROMANCE_SCAM", description: "Modelo' do OnlyFans prometia encontro real após pagamento de R$ 1.000. Após pagar, perfil foi deletado.", scammerName: "@modelo_vip_br", amountLost: 1000 },

  // Trabalho
  { title: "Vaga de emprego falsa cobrando taxa de treinamento", category: "JOB_SCAM", description: "Fui 'aprovado' em processo seletivo e pediram R$ 800 para material de treinamento. Empresa não existia.", scammerName: "Tech Solutions BR", amountLost: 800 },
  { title: "Golpe do trabalho em casa empacotando produtos", category: "JOB_SCAM", description: "Anúncio prometia R$ 3.000/mês empacotando em casa. Cobraram R$ 400 pelo 'kit inicial'. Nunca enviaram nada.", scammerWebsite: "trabalhe-em-casa.net", amountLost: 400 },
  { title: "Falsa vaga internacional pedindo pagamento de visto", category: "JOB_SCAM", description: "Oferta de trabalho no exterior pedindo R$ 5.000 para processar visto de trabalho. Era tudo mentira.", scammerEmail: "rh@global-jobs.com", amountLost: 5000 },
  { title: "Esquema de digitação online fraudulento", category: "JOB_SCAM", description: "Site prometia pagar por digitação de captchas. Após trabalhar um mês, pediram taxa para 'liberar' pagamento.", scammerWebsite: "digite-ganhe.com", amountLost: 200 },
  { title: "Golpe da vaga de motorista de aplicativo", category: "JOB_SCAM", description: "Falsa parceria com Uber pedindo R$ 1.500 para 'cadastro especial' com corridas garantidas.", scammerName: "Uber Partners Fake", amountLost: 1500 },

  // Loteria
  { title: "Falso prêmio de loteria internacional", category: "LOTTERY_SCAM", description: "Email dizendo que ganhei na loteria espanhola. Pediram R$ 2.000 de 'taxa' para liberar prêmio de 1 milhão de euros.", scammerEmail: "loteria@españa.com", amountLost: 2000 },
  { title: "Golpe do prêmio do WhatsApp no aniversário", category: "LOTTERY_SCAM", description: "Mensagem dizendo que fui sorteado no aniversário do WhatsApp. Pediram dados e cobraram taxa de R$ 150.", scammerPhone: "WhatsApp Oficial Fake", amountLost: 150 },
  { title: "Falso sorteio de carro no Instagram", category: "LOTTERY_SCAM", description: "Influencer fake fazendo sorteio de carro. Para participar, tinha que pagar R$ 50 de 'taxa de entrega'.", scammerName: "@sorteios_brasil", amountLost: 50 },
  { title: "Golpe do prêmio da Receita Federal", category: "LOTTERY_SCAM", description: "SMS dizendo que eu tinha prêmio de R$ 10.000 da Receita. Pediram depósito de R$ 500 para 'impostos'.", scammerPhone: "Receita Fake", amountLost: 500 },
  { title: "Falso sorteio de iPhone da Apple", category: "LOTTERY_SCAM", description: "Site dizendo que fui o visitante número 1.000.000 e ganhei iPhone. Cobraram frete de R$ 99.", scammerWebsite: "apple-sorteio.net", amountLost: 99 },

  // Criptomoedas
  { title: "Golpe da mineração de Bitcoin em nuvem", category: "CRYPTOCURRENCY", description: "Site prometia minerar Bitcoin para você. Investi R$ 5.000 e nunca consegui sacar. Site desapareceu.", scammerWebsite: "cloudmining-pro.io", amountLost: 5000 },
  { title: "Falsa corretora de criptomoedas", category: "CRYPTOCURRENCY", description: "Corretora fake que sumiu com fundos de milhares de pessoas. Perdi R$ 15.000 em Bitcoin.", scammerWebsite: "cryptoexchange-br.com", amountLost: 15000 },
  { title: "Esquema pump and dump com shitcoin", category: "CRYPTOCURRENCY", description: "Grupo no Telegram manipulando preço de moeda desconhecida. Comprei no topo e perdi 90% do valor.", scammerName: "Crypto Pumps Brasil", amountLost: 3000 },
  { title: "Golpe do robô trader de criptomoedas", category: "CRYPTOCURRENCY", description: "Software que prometia lucros automáticos no trading. Paguei R$ 2.000 pela licença e nunca funcionou.", scammerWebsite: "robot-trader.net", amountLost: 2000 },
  { title: "ICO fraudulenta de nova criptomoeda", category: "CRYPTOCURRENCY", description: "Investimento inicial em moeda que prometia ser o 'novo Bitcoin'. Projeto era fake e perdi R$ 8.000.", scammerName: "SuperCoin ICO", amountLost: 8000 },

  // Outros
  { title: "Golpe do empréstimo facilitado online", category: "OTHER", description: "Site oferecendo empréstimo sem consulta ao SPC. Cobraram R$ 500 de 'taxa antecipada' e sumiram.", scammerWebsite: "emprestimo-facil.com", amountLost: 500 },
  { title: "Falso consórcio contemplado", category: "OTHER", description: "Ligação dizendo que fui contemplado em consórcio que nunca participei. Pediram R$ 2.000 para 'liberar' o prêmio.", scammerPhone: "+55 11 2222-3333", amountLost: 2000 },
  { title: "Golpe do cartão de crédito clonado", category: "OTHER", description: "Clonaram meu cartão após compra em site suspeito. Fizeram compras de R$ 7.000 antes de eu bloquear.", amountLost: 7000 },
  { title: "Falsa ONG pedindo doações", category: "OTHER", description: "ONG fake pedindo doações para crianças carentes. Descobri que era golpe após doar R$ 500.", scammerName: "Ajude Crianças Brasil", amountLost: 500 },
  { title: "Golpe do aluguel de temporada", category: "OTHER", description: "Aluguei casa na praia por site. Paguei R$ 3.000 antecipado. Chegando lá, a casa não existia.", scammerWebsite: "alugue-temporada.com", amountLost: 3000 },
  { title: "Falso investimento em energia solar", category: "OTHER", description: "Empresa oferecendo investimento em fazenda solar com retorno de 5% ao mês. Investi R$ 20.000 e empresa sumiu.", scammerName: "Solar Invest Brasil", amountLost: 20000 },
  { title: "Golpe do IPVA premiado", category: "OTHER", description: "SMS dizendo que meu IPVA foi sorteado e estava isento. Pediram R$ 200 de 'taxa administrativa'.", scammerPhone: "Detran Fake", amountLost: 200 },
  { title: "Falso leilão de veículos", category: "OTHER", description: "Site de leilão fake vendendo carros apreendidos. Dei lance de R$ 15.000 e nunca recebi o veículo.", scammerWebsite: "leilao-veiculos.net", amountLost: 15000 },
  { title: "Golpe do seguro auto barato", category: "OTHER", description: "Corretora oferecendo seguro 70% mais barato. Paguei R$ 2.000 e descobri que apólice era falsa quando precisei.", scammerName: "Seguros Premium Fake", amountLost: 2000 },
  { title: "Falsa multa de trânsito por email", category: "OTHER", description: "Email com link para pagar multa com desconto. Era phishing para roubar dados do cartão.", scammerEmail: "detran@multas.gov", amountLost: 0 },
];

async function main() {
  console.log('🌱 Iniciando seed estendido do banco de dados...');

  // Limpar dados existentes
  await prisma.like.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.scam.deleteMany({});
  await prisma.user.deleteMany({});

  // Criar usuários
  const users: any[] = [];
  const userPassword = await bcrypt.hash('user123', 10);
  
  // Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@reclamagolpe.com',
      name: 'Administrador',
      password: adminPassword,
      isAdmin: true,
    },
  });
  users.push(admin);
  console.log('✅ Admin criado');

  // Criar 10 usuários de teste
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        name: `Usuário ${i}`,
        password: userPassword,
        bio: `Cidadão preocupado com golpes online #${i}`,
      },
    });
    users.push(user);
  }
  console.log('✅ 10 usuários criados');

  // Criar golpes
  const statuses = ['PENDING', 'VERIFIED', 'UNVERIFIED', 'RESOLVED'];
  const createdScams: any[] = [];

  for (const [index, scamData] of golpesData.entries()) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000); // Últimos 90 dias
    
    const scam = await prisma.scam.create({
      data: {
        title: scamData.title,
        description: scamData.description,
        category: scamData.category as any,
        status: randomStatus as any,
        scammerName: scamData.scammerName || null,
        scammerWebsite: scamData.scammerWebsite || null,
        scammerPhone: scamData.scammerPhone || null,
        scammerEmail: scamData.scammerEmail || null,
        amountLost: scamData.amountLost || 0,
        dateOccurred: randomDate,
        evidence: ['screenshot1.jpg', 'screenshot2.jpg'],
        views: Math.floor(Math.random() * 5000),
        userId: randomUser.id,
        createdAt: randomDate,
      },
    });
    createdScams.push(scam);
    
    if ((index + 1) % 10 === 0) {
      console.log(`✅ ${index + 1} golpes criados...`);
    }
  }

  // Adicionar comentários e curtidas aleatórios
  console.log('🎲 Adicionando interações...');
  
  for (const scam of createdScams.slice(0, 30)) { // Primeiros 30 golpes terão interações
    // Adicionar 0-5 comentários
    const numComments = Math.floor(Math.random() * 6);
    for (let i = 0; i < numComments; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      await prisma.comment.create({
        data: {
          content: [
            'Também caí nesse golpe!',
            'Obrigado pelo alerta, quase caí nessa.',
            'Denunciei na polícia e nada foi feito.',
            'Esse tipo de golpe está muito comum.',
            'Consegui recuperar meu dinheiro através do banco.',
            'Cuidado pessoal, está acontecendo muito isso.',
          ][Math.floor(Math.random() * 6)],
          userId: randomUser.id,
          scamId: scam.id,
        },
      });
    }

    // Adicionar 0-20 curtidas
    const numLikes = Math.floor(Math.random() * 21);
    const likedUsers = new Set();
    for (let i = 0; i < numLikes; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      if (!likedUsers.has(randomUser.id)) {
        likedUsers.add(randomUser.id);
        await prisma.like.create({
          data: {
            userId: randomUser.id,
            scamId: scam.id,
          },
        });
      }
    }
  }

  console.log('✅ Interações adicionadas');
  console.log(`🎉 Seed concluído! ${golpesData.length} golpes criados com sucesso!`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });