import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { CreateScamDto, UpdateScamDto, FilterScamsDto } from './dto/scam.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ScamsService {
  constructor(
    private prisma: PrismaService,
    private websocket: WebsocketGateway,
  ) {}

  async create(createScamDto: CreateScamDto, userId: string) {
    // Buscar categoria pelo slug
    const category = await this.prisma.category.findUnique({
      where: { slug: createScamDto.category }
    });

    if (!category) {
      throw new NotFoundException(`Categoria '${createScamDto.category}' não encontrada`);
    }

    // Mapear o slug da categoria para o enum antigo (temporariamente para compatibilidade)
    const categoryEnumMap: any = {
      'phishing': 'PHISHING',
      'piramide-financeira': 'PYRAMID_SCHEME',
      'ecommerce-falso': 'FAKE_ECOMMERCE',
      'investimento': 'INVESTMENT_FRAUD',
      'romance': 'ROMANCE_SCAM',
      'emprego-falso': 'JOB_SCAM',
      'loteria': 'LOTTERY_SCAM',
      'suporte-tecnico': 'TECH_SUPPORT',
      'criptomoedas': 'CRYPTOCURRENCY',
      'whatsapp': 'OTHER',
      'boleto-falso': 'OTHER',
      'pix': 'OTHER',
      'cartao-clonado': 'OTHER',
      'emprestimo-falso': 'OTHER',
      'falso-sequestro': 'OTHER',
      'redes-sociais': 'OTHER',
      'falsa-central': 'OTHER',
      'nft-metaverso': 'OTHER',
      'influencer-falso': 'OTHER',
      'outros': 'OTHER'
    };

    const categoryEnum = categoryEnumMap[createScamDto.category] || 'OTHER';

    const { category: _, ...scamData } = createScamDto;

    const scam = await this.prisma.scam.create({
      data: {
        ...scamData,
        category: categoryEnum, // Enum antigo para compatibilidade
        categoryId: category.id, // Relacionamento com a tabela de categorias
        userId,
        status: 'PENDING', // Toda denúncia começa como pendente para moderação
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        categoryRel: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    // Emitir evento via WebSocket
    this.websocket.emitNewScam(scam);

    return {
      ...scam,
      message: 'Denúncia enviada para análise. Será publicada após aprovação da moderação.'
    };
  }

  async findAll(filters: FilterScamsDto, page = 1, limit = 20, isAdmin = false) {
    const skip = (page - 1) * limit;
    
    const where: Prisma.ScamWhereInput = {};
    
    // Se não for admin, só mostra denúncias aprovadas (VERIFIED)
    if (!isAdmin && !filters.status) {
      where.status = 'VERIFIED';
    }
    
    if (filters.category) {
      // Buscar categoria pelo slug e filtrar pelo categoryId
      const category = await this.prisma.category.findUnique({
        where: { slug: filters.category }
      });
      if (category) {
        where.categoryId = category.id;
      }
    }
    
    if (filters.status) {
      where.status = filters.status;
    }
    
    if (filters.userId) {
      where.userId = filters.userId;
    }
    
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { scammerName: { contains: filters.search, mode: 'insensitive' } },
        { scammerWebsite: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    const sortBy = filters.sortBy || 'createdAt';
    const order = filters.order || 'desc';

    if (sortBy === 'likes' || sortBy === 'comments') {
      orderBy[sortBy] = { _count: order };
    } else {
      orderBy[sortBy] = order;
    }

    const [scams, total] = await Promise.all([
      this.prisma.scam.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
      }),
      this.prisma.scam.count({ where }),
    ]);

    return {
      scams,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId?: string) {
    // Log para debug em produção
    if (id === 'admin') {
      console.error('ERRO: Rota /scams/admin está caindo em findOne! Verifique a ordem das rotas.');
      throw new NotFoundException('Rota incorreta - use a rota específica de admin');
    }
    
    const scam = await this.prisma.scam.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
          },
        },
        comments: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        likes: userId ? {
          where: { userId },
          select: { id: true },
        } : false,
        _count: {
          select: {
            comments: true,
            likes: true,
            reports: true,
          },
        },
      },
    });

    if (!scam) {
      throw new NotFoundException('Denúncia não encontrada');
    }

    // Incrementar visualizações
    await this.prisma.scam.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return {
      ...scam,
      isLiked: userId && scam.likes ? scam.likes.length > 0 : false,
    };
  }

  async update(id: string, updateScamDto: UpdateScamDto, userId: string, isAdmin: boolean) {
    const scam = await this.prisma.scam.findUnique({
      where: { id },
    });

    if (!scam) {
      throw new NotFoundException('Denúncia não encontrada');
    }

    if (scam.userId !== userId && !isAdmin) {
      throw new ForbiddenException('Sem permissão para editar esta denúncia');
    }

    // Se categoria foi passada, buscar o ID da categoria
    let updateData: any = { ...updateScamDto };
    
    if (updateScamDto.category) {
      const category = await this.prisma.category.findUnique({
        where: { slug: updateScamDto.category }
      });
      
      if (!category) {
        throw new NotFoundException(`Categoria '${updateScamDto.category}' não encontrada`);
      }
      
      // Mapear o slug para enum (compatibilidade)
      const categoryEnumMap: any = {
        'phishing': 'PHISHING',
        'piramide-financeira': 'PYRAMID_SCHEME',
        'ecommerce-falso': 'FAKE_ECOMMERCE',
        'investimento': 'INVESTMENT_FRAUD',
        'romance': 'ROMANCE_SCAM',
        'emprego-falso': 'JOB_SCAM',
        'loteria': 'LOTTERY_SCAM',
        'suporte-tecnico': 'TECH_SUPPORT',
        'criptomoedas': 'CRYPTOCURRENCY',
        'outros': 'OTHER'
      };
      
      const { category: _, ...restData } = updateScamDto;
      updateData = {
        ...restData,
        category: categoryEnumMap[updateScamDto.category] || 'OTHER',
        categoryId: category.id
      };
    }

    const updatedScam = await this.prisma.scam.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        categoryRel: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    // Emitir atualização via WebSocket
    this.websocket.emitScamUpdate(id, updatedScam);

    return updatedScam;
  }

  async remove(id: string, userId: string, isAdmin: boolean) {
    const scam = await this.prisma.scam.findUnique({
      where: { id },
    });

    if (!scam) {
      throw new NotFoundException('Denúncia não encontrada');
    }

    if (scam.userId !== userId && !isAdmin) {
      throw new ForbiddenException('Sem permissão para deletar esta denúncia');
    }

    await this.prisma.scam.delete({
      where: { id },
    });

    return { message: 'Denúncia removida com sucesso' };
  }

  async toggleLike(scamId: string, userId: string) {
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_scamId: {
          userId,
          scamId,
        },
      },
    });

    if (existingLike) {
      await this.prisma.like.delete({
        where: { id: existingLike.id },
      });
      
      const count = await this.prisma.like.count({
        where: { scamId },
      });

      this.websocket.emitNewLike(scamId, { 
        action: 'unlike', 
        userId, 
        count 
      });

      return { liked: false, count };
    } else {
      await this.prisma.like.create({
        data: {
          userId,
          scamId,
        },
      });

      const count = await this.prisma.like.count({
        where: { scamId },
      });

      this.websocket.emitNewLike(scamId, { 
        action: 'like', 
        userId, 
        count 
      });

      return { liked: true, count };
    }
  }

  async getTrending(limit = 10) {
    const trending = await this.prisma.scam.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Últimos 7 dias
        },
      },
      orderBy: [
        { views: 'desc' },
        { likes: { _count: 'desc' } },
        { comments: { _count: 'desc' } },
      ],
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        categoryRel: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    return trending;
  }

  async getComments(scamId: string) {
    const comments = await this.prisma.comment.findMany({
      where: { scamId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return { comments };
  }

  async verifyDomain(domain: string) {
    if (!domain) {
      return {
        status: 'unknown',
        domain: '',
        scamsCount: 0,
        message: 'Domínio inválido',
        scams: []
      };
    }

    // Search for scams with this domain
    const scams = await this.prisma.scam.findMany({
      where: {
        OR: [
          { scammerWebsite: { contains: domain, mode: 'insensitive' } },
          { description: { contains: domain, mode: 'insensitive' } },
          { title: { contains: domain, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        category: true,
        createdAt: true,
        views: true,
      },
    });

    const scamsCount = await this.prisma.scam.count({
      where: {
        OR: [
          { scammerWebsite: { contains: domain, mode: 'insensitive' } },
          { description: { contains: domain, mode: 'insensitive' } },
          { title: { contains: domain, mode: 'insensitive' } },
        ],
      },
    });

    let status: 'safe' | 'warning' | 'danger' | 'unknown' = 'safe';
    let message = 'Nenhuma denúncia encontrada para este domínio';

    if (scamsCount > 0) {
      if (scamsCount > 5) {
        status = 'danger';
        message = `Atenção! Encontramos ${scamsCount} denúncias sobre este domínio`;
      } else {
        status = 'warning';
        message = `Encontramos ${scamsCount} denúncia${scamsCount > 1 ? 's' : ''} sobre este domínio`;
      }
    }

    const lastReport = scams.length > 0 ? scams[0].createdAt : null;

    return {
      status,
      domain,
      scamsCount,
      lastReport,
      message,
      scams,
    };
  }

  async reportScam(scamId: string, reportData: { reason: string; description: string; email?: string; userId: string | null }) {
    const scam = await this.prisma.scam.findUnique({
      where: { id: scamId },
    });

    if (!scam) {
      throw new NotFoundException('Denúncia não encontrada');
    }

    // Permitir reports anônimos (userId pode ser null)
    const reportDataToSave: any = {
      scamId,
      reason: reportData.reason as any,
      details: reportData.description,
    };

    // Adicionar userId apenas se existir
    if (reportData.userId) {
      reportDataToSave.userId = reportData.userId;
    }

    // Adicionar email se fornecido (para contato em reports anônimos)
    if (reportData.email) {
      reportDataToSave.reporterEmail = reportData.email;
    }

    const report = await this.prisma.report.create({
      data: reportDataToSave,
    });

    return {
      success: true,
      message: 'Reporte enviado com sucesso. Nossa equipe irá analisar.',
      reportId: report.id,
    };
  }

  async markAsResolved(
    scamId: string,
    userId: string,
    resolutionData: {
      resolutionNote: string;
      resolutionLinks?: string[];
    },
  ) {
    const scam = await this.prisma.scam.findUnique({
      where: { id: scamId },
    });

    if (!scam) {
      throw new NotFoundException('Denúncia não encontrada');
    }

    const updatedScam = await this.prisma.scam.update({
      where: { id: scamId },
      data: {
        isResolved: true,
        resolvedAt: new Date(),
        resolutionNote: resolutionData.resolutionNote,
        resolutionLinks: resolutionData.resolutionLinks || [],
        resolvedBy: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    // Emit websocket event
    this.websocket.server.emit('scamResolved', {
      scamId,
      resolvedBy: userId,
      resolvedAt: updatedScam.resolvedAt,
    });

    return updatedScam;
  }

  async getResolutionInfo(scamId: string) {
    const scam = await this.prisma.scam.findUnique({
      where: { id: scamId },
      select: {
        isResolved: true,
        resolvedAt: true,
        resolutionNote: true,
        resolutionLinks: true,
        resolvedBy: true,
      },
    });

    if (!scam) {
      throw new NotFoundException('Denúncia não encontrada');
    }

    return scam;
  }
}