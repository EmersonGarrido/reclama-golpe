import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto, ChangePasswordDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          bio: true,
          isAdmin: true,
          createdAt: true,
          _count: {
            select: {
              scams: true,
              comments: true,
              likes: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        isAdmin: true,
        createdAt: true,
        _count: {
          select: {
            scams: true,
            comments: true,
            likes: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findUserScams(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [scams, total] = await Promise.all([
      this.prisma.scam.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.scam.count({ where: { userId } }),
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

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        isAdmin: true,
        createdAt: true,
      },
    });

    return user;
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Senha atual incorreta');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Senha alterada com sucesso' };
  }

  async delete(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    return { message: 'Conta desativada com sucesso' };
  }

  async getUserStats(userId: string) {
    const [totalScams, resolvedScams, totalComments, scamsWithLikes] = await Promise.all([
      this.prisma.scam.count({ where: { userId } }),
      this.prisma.scam.count({ where: { userId, isResolved: true } }),
      this.prisma.comment.count({ where: { userId } }),
      this.prisma.scam.findMany({
        where: { userId },
        select: {
          _count: {
            select: {
              likes: true
            }
          }
        }
      })
    ]);

    const totalLikes = scamsWithLikes.reduce((sum, scam) => sum + scam._count.likes, 0);

    return {
      totalScams,
      resolvedScams,
      totalComments,
      totalLikes
    };
  }
}