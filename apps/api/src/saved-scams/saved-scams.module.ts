import { Module } from '@nestjs/common';
import { SavedScamsController } from './saved-scams.controller';
import { SavedScamsService } from './saved-scams.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SavedScamsController],
  providers: [SavedScamsService],
  exports: [SavedScamsService],
})
export class SavedScamsModule {}