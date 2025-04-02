import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { invitations_statut } from '@prisma/client';

@Injectable()
export class InvitationsService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.invitations.findMany();
  }

  async getById(id: number) {
    return this.prisma.invitations.findUnique({
      where: { id },
    });
  }

  async create(data: { evenement_id: number; email_invite: string; code_invitation: string; date_envoi: Date; statut: invitations_statut; }) {
    return this.prisma.invitations.create({
      data: {
        evenement_id: data.evenement_id,
        email_invite: data.email_invite,
        code_invitation: data.code_invitation,
        date_envoi: data.date_envoi,
        statut: data.statut
      },
    });
  }
}
