import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { inscriptions_statut } from '@prisma/client';

@Injectable()
export class InscriptionsService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.inscriptions.findMany();
  }

  async getById(id: number) {
    return this.prisma.inscriptions.findUnique({
      where: { id },
    });
  }

  async create(evenement_id: number, utilisateur_id: number, statut: string, date_inscription: Date, data: { evenement_id: number; utilisateur_id: number; date_inscription: Date; statut: inscriptions_statut; }) {
    return this.prisma.inscriptions.create({
      data: {
        evenement_id: data.evenement_id,
        utilisateur_id: data.utilisateur_id,
        date_inscription: data.date_inscription,
        statut: data.statut,
      },
    });
  }
  }
  

