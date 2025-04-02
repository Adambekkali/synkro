import { Module } from '@nestjs/common';
import { EvenementsService } from './evenements.service';
import { EvenementsController } from './evenements.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EvenementsController],
  providers: [EvenementsService],
})
export class EvenementsModule {}
