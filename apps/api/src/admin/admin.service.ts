import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ScamStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getChartStats(period: string) {
    const days = period === '30days' ? 30 : period === '90days' ? 90 : 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Buscar denúncias agrupadas por dia
    const scamsByDay = await this.prisma.scam.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: true
    });

    // Buscar usuários agrupados por dia
    const usersByDay = await this.prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: true
    });

    // Formatar dados para o gráfico
    const chartData = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const scamsCount = scamsByDay.filter(s => 
        s.createdAt.toISOString().split('T')[0] === dateStr
      ).length;
      
      const usersCount = usersByDay.filter(u => 
        u.createdAt.toISOString().split('T')[0] === dateStr
      ).length;

      chartData.unshift({
        date: dateStr,
        scams: scamsCount,
        users: usersCount
      });
    }

    // Buscar estatísticas por categoria
    const categoryStats = await this.prisma.scam.groupBy({
      by: ['category'],
      _count: true
    });

    return {
      chartData,
      categoryStats: categoryStats.map(c => ({
        category: c.category,
        count: c._count
      }))
    };
  }

  async getSystemStats() {
    const [
      totalUsers,
      totalScams,
      pendingScams,
      verifiedScams,
      resolvedScams,
      totalComments,
      totalReports,
      recentScams
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.scam.count(),
      this.prisma.scam.count({ where: { status: ScamStatus.PENDING } }),
      this.prisma.scam.count({ where: { status: ScamStatus.VERIFIED } }),
      this.prisma.scam.count({ where: { isResolved: true } }),
      this.prisma.comment.count(),
      this.prisma.report.count({ where: { status: 'PENDING' } }),
      this.prisma.scam.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      })
    ]);

    const recentActivity = recentScams.map(scam => ({
      description: `Nova denúncia "${scam.title}" por ${scam.user.name}`,
      time: this.formatTimeAgo(scam.createdAt)
    }));

    return {
      totalUsers,
      totalScams,
      pendingScams,
      verifiedScams,
      resolvedScams,
      totalComments,
      totalReports,
      recentActivity
    };
  }

  async getRecentActivity() {
    const [recentScams, recentComments, recentUsers] = await Promise.all([
      this.prisma.scam.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true }
          }
        }
      }),
      this.prisma.comment.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true }
          },
          scam: {
            select: { title: true }
          }
        }
      }),
      this.prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          name: true,
          createdAt: true
        }
      })
    ]);

    const activities = [
      ...recentScams.map(scam => ({
        type: 'scam',
        description: `Nova denúncia "${scam.title}" por ${scam.user.name}`,
        time: scam.createdAt,
        timeAgo: this.formatTimeAgo(scam.createdAt)
      })),
      ...recentComments.map(comment => ({
        type: 'comment',
        description: `${comment.user.name} comentou em "${comment.scam.title}"`,
        time: comment.createdAt,
        timeAgo: this.formatTimeAgo(comment.createdAt)
      })),
      ...recentUsers.map(user => ({
        type: 'user',
        description: `Novo usuário cadastrado: ${user.name}`,
        time: user.createdAt,
        timeAgo: this.formatTimeAgo(user.createdAt)
      }))
    ];

    return activities
      .sort((a, b) => b.time.getTime() - a.time.getTime())
      .slice(0, 20);
  }

  async getPendingReports() {
    const reports = await this.prisma.report.findMany({
      where: { status: 'PENDING' },
      include: {
        scam: {
          select: {
            id: true,
            title: true
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return reports;
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        isAdmin: true,
        createdAt: true,
        _count: {
          select: {
            scams: true,
            comments: true,
            likes: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return users;
  }

  async toggleUserAdmin(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { isAdmin: !user.isAdmin }
    });
  }

  async deleteUser(userId: string) {
    // Primeiro, deletar todas as relações do usuário
    await this.prisma.$transaction([
      // Deletar likes
      this.prisma.like.deleteMany({
        where: { userId }
      }),
      // Deletar reports
      this.prisma.report.deleteMany({
        where: { userId }
      }),
      // Deletar comentários
      this.prisma.comment.deleteMany({
        where: { userId }
      }),
      // Deletar denúncias
      this.prisma.scam.deleteMany({
        where: { userId }
      }),
      // Por fim, deletar o usuário
      this.prisma.user.delete({
        where: { id: userId }
      })
    ]);

    return { message: 'Usuário excluído com sucesso' };
  }

  async getAllCategories() {
    const categories = await this.prisma.category.findMany({
      include: {
        _count: {
          select: {
            scams: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    return categories;
  }

  async createCategory(data: { name: string; slug: string; description?: string }) {
    // Verificar se já existe categoria com o mesmo slug
    const existing = await this.prisma.category.findUnique({
      where: { slug: data.slug }
    });

    if (existing) {
      throw new Error('Já existe uma categoria com este identificador');
    }

    return this.prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || ''
      }
    });
  }

  async updateCategory(categoryId: string, data: { name?: string; description?: string }) {
    return this.prisma.category.update({
      where: { id: categoryId },
      data
    });
  }

  async deleteCategory(categoryId: string) {
    // Verificar se existem denúncias usando esta categoria
    const scamsCount = await this.prisma.scam.count({
      where: { categoryId }
    });

    if (scamsCount > 0) {
      throw new Error(`Não é possível excluir. Existem ${scamsCount} denúncias usando esta categoria.`);
    }

    return this.prisma.category.delete({
      where: { id: categoryId }
    });
  }

  private formatTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} dia${days > 1 ? 's' : ''} atrás`;
    } else if (hours > 0) {
      return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
    } else if (minutes > 0) {
      return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`;
    } else {
      return 'Agora mesmo';
    }
  }
}