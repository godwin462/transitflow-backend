import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [HistoryController],
  providers: [HistoryService, PrismaService],
})
export class HistoryModule {}
