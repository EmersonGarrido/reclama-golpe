import { Module } from '@nestjs/common';
import { ScamsService } from './scams.service';
import { ScamsController } from './scams.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [PrismaModule, WebsocketModule],
  controllers: [ScamsController],
  providers: [ScamsService],
  exports: [ScamsService],
})
export class ScamsModule {}