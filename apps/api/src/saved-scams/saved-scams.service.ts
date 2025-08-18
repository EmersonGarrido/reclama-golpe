import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SavedScamsService {
  constructor(private prisma: PrismaService) {}

  async findUserSavedScams(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [savedScams, total] = await Promise.all([
      this.prisma.savedScam.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          scam: {
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
          },
        },
      }),
      this.prisma.savedScam.count({ where: { userId } }),
    ]);

    return {
      data: savedScams.map((saved) => ({
        ...saved.scam,
        savedAt: saved.createdAt,
        isSaved: true,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async saveScam(userId: string, scamId: string) {
    // Verificar se o golpe existe
    const scam = await this.prisma.scam.findUnique({
      where: { id: scamId },
    });

    if (!scam) {
      throw new NotFoundException('Golpe não encontrado');
    }

    // Verificar se já foi salvo
    const existing = await this.prisma.savedScam.findUnique({
      where: {
        userId_scamId: {
          userId,
          scamId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Golpe já está salvo');
    }

    return this.prisma.savedScam.create({
      data: {
        userId,
        scamId,
      },
      include: {
        scam: true,
      },
    });
  }

  async unsaveScam(userId: string, scamId: string) {
    const savedScam = await this.prisma.savedScam.findUnique({
      where: {
        userId_scamId: {
          userId,
          scamId,
        },
      },
    });

    if (!savedScam) {
      throw new NotFoundException('Golpe salvo não encontrado');
    }

    await this.prisma.savedScam.delete({
      where: {
        userId_scamId: {
          userId,
          scamId,
        },
      },
    });

    return { message: 'Golpe removido dos salvos' };
  }

  async checkIfSaved(userId: string, scamId: string) {
    const savedScam = await this.prisma.savedScam.findUnique({
      where: {
        userId_scamId: {
          userId,
          scamId,
        },
      },
    });

    return { isSaved: !!savedScam };
  }
}