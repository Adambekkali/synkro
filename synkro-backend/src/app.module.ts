import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './api/prisma/prisma.module';
import { UtilisateursModule } from './api/utilisateurs/utilisateurs.module';
import { EvenementsModule } from './api/evenements/evenements.module';
import { InscriptionsModule } from './api/inscriptions/inscriptions.module';
import { InvitationsModule } from './api/invitations/invitations.module';
import { AuthModule } from './api/auth/auth.module';

@Module({
  imports: [PrismaModule, UtilisateursModule,EvenementsModule,InscriptionsModule,InvitationsModule,AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
