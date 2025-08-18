import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ScamsService } from './scams.service';
import { CreateScamDto, UpdateScamDto, FilterScamsDto } from './dto/scam.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('scams')
export class ScamsController {
  constructor(private readonly scamsService: ScamsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createScamDto: CreateScamDto,
    @CurrentUser() user: any,
  ) {
    return this.scamsService.create(createScamDto, user.id);
  }

  // IMPORTANTE: Esta rota DEVE vir antes de :id
  @Get('admin')
  @UseGuards(JwtAuthGuard, AdminGuard) // Protege com ambos os guards
  async findAllAdmin(
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('userId') userId?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @CurrentUser() user?: any,
  ) {

    const filters: any = {};
    if (category) filters.category = category;
    if (status) filters.status = status;
    if (search) filters.search = search;
    if (userId) filters.userId = userId;
    if (sortBy) filters.sortBy = sortBy;
    if (order) filters.order = order;
    
    // Admin sempre vê todas as denúncias
    return this.scamsService.findAll(
      filters,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      true, // isAdmin = true
    );
  }

  // Rota alternativa para admin (temporária para debug)
  @Get('for-admin')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async findAllForAdmin(
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('userId') userId?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @CurrentUser() user?: any,
  ) {

    const filters: any = {};
    if (category) filters.category = category;
    if (status) filters.status = status;
    if (search) filters.search = search;
    if (userId) filters.userId = userId;
    if (sortBy) filters.sortBy = sortBy;
    if (order) filters.order = order;
    
    // Admin sempre vê todas as denúncias
    return this.scamsService.findAll(
      filters,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      true, // isAdmin = true
    );
  }

  @Public()
  @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('userId') userId?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('includeAll') includeAll?: string,
    @CurrentUser() user?: any,
  ) {
    const filters: any = {};
    if (category) filters.category = category;
    if (status) filters.status = status;
    if (search) filters.search = search;
    if (userId) filters.userId = userId;
    if (sortBy) filters.sortBy = sortBy;
    if (order) filters.order = order;
    
    // Só mostra denúncias pendentes para admins ou se explicitamente solicitado
    const isAdmin = user?.isAdmin || includeAll === 'true';
    
    return this.scamsService.findAll(
      filters,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      isAdmin,
    );
  }

  @Public()
  @Get('trending')
  async getTrending(@Query('limit') limit?: string) {
    return this.scamsService.getTrending(
      limit ? parseInt(limit) : 10,
    );
  }

  @Public()
  @Get('verify-domain')
  async verifyDomain(@Query('domain') domain: string) {
    return this.scamsService.verifyDomain(domain);
  }

  @Public()
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user?: any,
  ) {
    return this.scamsService.findOne(id, user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateScamDto: UpdateScamDto,
    @CurrentUser() user: any,
  ) {
    return this.scamsService.update(id, updateScamDto, user.id, user.isAdmin);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.scamsService.remove(id, user.id, user.isAdmin);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async toggleLike(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.scamsService.toggleLike(id, user.id);
  }

  @Public()
  @Get(':id/comments')
  async getComments(@Param('id') id: string) {
    return this.scamsService.getComments(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/report')
  async reportScam(
    @Param('id') id: string,
    @Body() reportData: { reason: string; description: string; email?: string },
    @CurrentUser() user: any,
  ) {
    return this.scamsService.reportScam(id, { ...reportData, userId: user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/resolve')
  async markAsResolved(
    @Param('id') id: string,
    @Body() resolutionData: { resolutionNote: string; resolutionLinks?: string[] },
    @CurrentUser() user: any,
  ) {
    return this.scamsService.markAsResolved(id, user.id, resolutionData);
  }

  @Public()
  @Get(':id/resolution')
  async getResolutionInfo(@Param('id') id: string) {
    return this.scamsService.getResolutionInfo(id);
  }
}