import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getSystemStats(@CurrentUser() user: any) {
    if (!user.isAdmin) {
      throw new ForbiddenException('Acesso negado. Apenas administradores.');
    }
    return this.adminService.getSystemStats();
  }

  @Get('recent-activity')
  async getRecentActivity(@CurrentUser() user: any) {
    if (!user.isAdmin) {
      throw new ForbiddenException('Acesso negado. Apenas administradores.');
    }
    return this.adminService.getRecentActivity();
  }

  @Get('reports')
  async getPendingReports(@CurrentUser() user: any) {
    if (!user.isAdmin) {
      throw new ForbiddenException('Acesso negado. Apenas administradores.');
    }
    return this.adminService.getPendingReports();
  }

  @Get('users')
  async getAllUsers(@CurrentUser() user: any) {
    if (!user.isAdmin) {
      throw new ForbiddenException('Acesso negado. Apenas administradores.');
    }
    return this.adminService.getAllUsers();
  }

  @Patch('users/:id/toggle-admin')
  async toggleUserAdmin(
    @CurrentUser() user: any,
    @Param('id') userId: string,
  ) {
    if (!user.isAdmin) {
      throw new ForbiddenException('Acesso negado. Apenas administradores.');
    }
    return this.adminService.toggleUserAdmin(userId);
  }

  @Delete('users/:id')
  async deleteUser(
    @CurrentUser() user: any,
    @Param('id') userId: string,
  ) {
    if (!user.isAdmin) {
      throw new ForbiddenException('Acesso negado. Apenas administradores.');
    }
    
    if (user.id === userId) {
      throw new ForbiddenException('Você não pode excluir sua própria conta.');
    }
    
    return this.adminService.deleteUser(userId);
  }

  @Get('categories')
  async getAllCategories(@CurrentUser() user: any) {
    if (!user.isAdmin) {
      throw new ForbiddenException('Acesso negado. Apenas administradores.');
    }
    return this.adminService.getAllCategories();
  }

  @Post('categories')
  async createCategory(
    @CurrentUser() user: any,
    @Body() data: { name: string; slug: string; description?: string },
  ) {
    if (!user.isAdmin) {
      throw new ForbiddenException('Acesso negado. Apenas administradores.');
    }
    return this.adminService.createCategory(data);
  }

  @Patch('categories/:id')
  async updateCategory(
    @CurrentUser() user: any,
    @Param('id') categoryId: string,
    @Body() data: { name?: string; description?: string },
  ) {
    if (!user.isAdmin) {
      throw new ForbiddenException('Acesso negado. Apenas administradores.');
    }
    return this.adminService.updateCategory(categoryId, data);
  }

  @Delete('categories/:id')
  async deleteCategory(
    @CurrentUser() user: any,
    @Param('id') categoryId: string,
  ) {
    if (!user.isAdmin) {
      throw new ForbiddenException('Acesso negado. Apenas administradores.');
    }
    return this.adminService.deleteCategory(categoryId);
  }
}