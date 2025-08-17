import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@reclamagolpe.com' },
    update: {},
    create: {
      email: 'admin@reclamagolpe.com',
      name: 'Administrador',
      password: adminPassword,
      isAdmin: true,
    },
  });

  console.log('✅ Usuário admin criado:', admin.email);

  // Criar usuário de teste
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Usuário Teste',
      password: userPassword,
      bio: 'Usuário de teste para desenvolvimento',
    },
  });

  console.log('✅ Usuário teste criado:', user.email);

  // Criar alguns golpes de exemplo
  const scams = [
    {
      title: 'Site falso vendendo iPhones com 90% de desconto',
      description: 'Encontrei um site que estava vendendo iPhone 15 Pro por apenas R$ 500. O site parecia legítimo, tinha HTTPS, imagens profissionais e até depoimentos. Fiz o pagamento via Pix e nunca recebi o produto. O site sumiu 2 dias depois.',
      category: 'FAKE_ECOMMERCE' as const,
      scammerWebsite: 'www.super-ofertas-iphone.com',
      amountLost: 500,
      userId: user.id,
    },
    {
      title: 'Golpe do falso suporte técnico da Microsoft',
      description: 'Recebi uma ligação dizendo ser do suporte técnico da Microsoft, alegando que meu computador estava infectado. Pediram acesso remoto para "resolver o problema" e cobraram R$ 300 pelo serviço. Depois descobri que era golpe.',
      category: 'TECH_SUPPORT' as const,
      scammerPhone: '+55 11 99999-0000',
      amountLost: 300,
      userId: user.id,
    },
    {
      title: 'Pirâmide financeira disfarçada de marketing multinível',
      description: 'Fui convidado para uma "oportunidade de negócio" que prometia ganhos de R$ 10.000 por mês trabalhando de casa. Tive que pagar R$ 2.000 para entrar e recrutar outras pessoas. Típica pirâmide financeira.',
      category: 'PYRAMID_SCHEME' as const,
      amountLost: 2000,
      userId: admin.id,
    },
  ];

  for (const scamData of scams) {
    const scam = await prisma.scam.create({
      data: {
        ...scamData,
        status: 'VERIFIED',
        evidence: ['screenshot1.jpg', 'screenshot2.jpg'],
      },
    });
    console.log(`✅ Golpe criado: ${scam.title.substring(0, 50)}...`);
  }

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });