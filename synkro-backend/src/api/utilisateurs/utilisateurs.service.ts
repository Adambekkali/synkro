import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UtilisateursService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.utilisateurs.findMany();
  }

  async getById(id: number) {
    return this.prisma.utilisateurs.findUnique({
      where: { id },
    });
  }

  async create(email: string, mot_de_passe: string, nom?: string, prenom?: string) {
    return this.prisma.utilisateurs.create({
      data: { email, mot_de_passe, nom, prenom },
    });
  }
}
