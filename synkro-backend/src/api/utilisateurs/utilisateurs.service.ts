import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { user_role } from '@prisma/client'; // ← AJOUTEZ CETTE IMPORT

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

  async getByIdWithEvents(id: number) {
    return this.prisma.utilisateurs.findUnique({
      where: { id },
      include: {
        evenements: true, 
        inscriptions: true
      },
    });
  }

  async findByUsername(email: string) {
    return this.prisma.utilisateurs.findUnique({
      where: { email },
    });
  }
  
  async create(email: string, mot_de_passe: string, nom?: string, prenom?: string, role?: string, organization?: string) {
    console.log('=== DEBUG SERVICE INSCRIPTION ===');
    console.log('Paramètres reçus:', { email, mot_de_passe: '***', nom, prenom, role, organization });
    
    // ← CONVERSION DU STRING EN ENUM
    let userRole: user_role;
    switch (role?.toUpperCase()) {
      case 'ORGANIZER':
        userRole = user_role.ORGANIZER;
        break;
      case 'ADMIN':
        userRole = user_role.ADMIN;
        break;
      default:
        userRole = user_role.CITIZEN;
    }
    
    const userData = {
      email, 
      mot_de_passe, 
      nom, 
      prenom,
      role: userRole,                                    // ← ENUM AU LIEU DE STRING
      organization: organization || null,
      is_approved: userRole === user_role.ORGANIZER ? false : true
    };
    
    console.log('Données à insérer:', userData);
    
    const result = await this.prisma.utilisateurs.create({
      data: userData,
    });
    
    console.log('Utilisateur créé:', result);
    return result;
  }
}