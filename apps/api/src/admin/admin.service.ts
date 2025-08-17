import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ScamStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

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