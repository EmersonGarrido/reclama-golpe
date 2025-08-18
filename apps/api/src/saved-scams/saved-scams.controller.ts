import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { SavedScamsService } from './saved-scams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('saved-scams')
@UseGuards(JwtAuthGuard)
export class SavedScamsController {
  constructor(private readonly savedScamsService: SavedScamsService) {}

  @Get()
  async findUserSavedScams(
    @Req() req,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.savedScamsService.findUserSavedScams(
      req.user.id,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Post(':scamId')
  async saveScam(@Req() req, @Param('scamId') scamId: string) {
    return this.savedScamsService.saveScam(req.user.id, scamId);
  }

  @Delete(':scamId')
  async unsaveScam(@Req() req, @Param('scamId') scamId: string) {
    return this.savedScamsService.unsaveScam(req.user.id, scamId);
  }

  @Get('check/:scamId')
  async checkIfSaved(@Req() req, @Param('scamId') scamId: string) {
    return this.savedScamsService.checkIfSaved(req.user.id, scamId);
  }
}