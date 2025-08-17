import {
  Controller,
  Get,
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
}