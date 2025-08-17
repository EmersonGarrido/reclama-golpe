import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: any,
  ) {
    return this.commentsService.create(createCommentDto, user.id);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: any,
  ) {
    const comment = await this.commentsService.findOne(id);
    if (comment.userId !== user.id && !user.isAdmin) {
      throw new ForbiddenException('Você não pode editar este comentário');
    }
    return this.commentsService.update(id, updateCommentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    const comment = await this.commentsService.findOne(id);
    if (comment.userId !== user.id && !user.isAdmin) {
      throw new ForbiddenException('Você não pode excluir este comentário');
    }
    return this.commentsService.remove(id);
  }
}