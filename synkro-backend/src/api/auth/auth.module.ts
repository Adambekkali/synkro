// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UtilisateursModule } from '../utilisateurs/utilisateurs.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { UtilisateursService } from '../utilisateurs/utilisateurs.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    UtilisateursModule,
    PassportModule,
    JwtModule.register({
      secret: 'ADansParPourEnVersAvecDeSansSous',
      signOptions: { expiresIn: '300s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy,PrismaService, UtilisateursService],
  controllers: [AuthController],
})
export class AuthModule {}
