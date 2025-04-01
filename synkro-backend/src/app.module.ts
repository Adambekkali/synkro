import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UtilisateursModule } from './utilisateurs/utilisateurs.module';
import { EvenementsModule } from './evenements/evenements.module';
import { InscriptionsModule } from './inscriptions/inscriptions.module';

@Module({
  imports: [PrismaModule, UtilisateursModule,EvenementsModule,InscriptionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
