import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard) // Aplica ambos os guards em todas as rotas
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getSystemStats(@CurrentUser() user: any) {
    return this.adminService.getSystemStats();
  }

  @Get('recent-activity')
  async getRecentActivity(@CurrentUser() user: any) {
    return this.adminService.getRecentActivity();
  }

  @Get('reports')
  async getPendingReports(@CurrentUser() user: any) {
    return this.adminService.getPendingReports();
  }

  @Get('users')
  async getAllUsers(@CurrentUser() user: any) {
    return this.adminService.getAllUsers();
  }

  @Patch('users/:id/toggle-admin')
  async toggleUserAdmin(
    @CurrentUser() user: any,
    @Param('id') userId: string,
  ) {
    return this.adminService.toggleUserAdmin(userId);
  }

  @Delete('users/:id')
  async deleteUser(
    @CurrentUser() user: any,
    @Param('id') userId: string,
  ) {
    
    if (user.id === userId) {
      throw new ForbiddenException('Você não pode excluir sua própria conta.');
    }
    
    return this.adminService.deleteUser(userId);
  }

  @Get('categories')
  async getAllCategories(@CurrentUser() user: any) {
    return this.adminService.getAllCategories();
  }

  @Post('categories')
  async createCategory(
    @CurrentUser() user: any,
    @Body() data: { name: string; slug: string; description?: string },
  ) {
    return this.adminService.createCategory(data);
  }

  @Patch('categories/:id')
  async updateCategory(
    @CurrentUser() user: any,
    @Param('id') categoryId: string,
    @Body() data: { name?: string; description?: string },
  ) {
    return this.adminService.updateCategory(categoryId, data);
  }

  @Delete('categories/:id')
  async deleteCategory(
    @CurrentUser() user: any,
    @Param('id') categoryId: string,
  ) {
    return this.adminService.deleteCategory(categoryId);
  }
}