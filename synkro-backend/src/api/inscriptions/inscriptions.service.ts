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

  async create(data: { evenement_id: number; utilisateur_id: number; date_inscription?: Date; statut?: inscriptions_statut; }) {
    // Vérifier si déjà inscrit
    const existing = await this.prisma.inscriptions.findFirst({
      where: {
        evenement_id: data.evenement_id, 
        utilisateur_id: data.utilisateur_id 
      }
    });
    
    if (existing) {
      throw new Error('Déjà inscrit à cet événement');
    }
    
    // Vérifier si l'événement existe et n'est pas complet
    const event = await this.prisma.evenements.findUnique({
      where: { id: data.evenement_id },
      include: { inscriptions: true }
    });
    
    if (!event) {
      throw new Error('Événement non trouvé');
    }
    
    if (event.max_participants && event.inscriptions.length >= event.max_participants) {
      throw new Error('Événement complet');
    }
    
    return this.prisma.inscriptions.create({
      data: {
        evenement_id: data.evenement_id,
        utilisateur_id: data.utilisateur_id,
        date_inscription: data.date_inscription || new Date(),
        statut: data.statut || 'confirmee',
      },
    });
  }

  async getInscriptionsByUser(id: number) {
    return this.prisma.inscriptions.findMany({
      where: { utilisateur_id: id },
      include: {
        evenements: {
          include: {
            utilisateurs: {
              select: { id: true, prenom: true, nom: true, email: true }
            }
          }
        },
        utilisateurs: true
      },
      orderBy: { date_inscription: 'desc' }
    });
  }

  // ======= NOUVELLES MÉTHODES POUR LE FRONTEND =======

  async checkSubscription(eventId: number, userId: number) {
    const inscription = await this.prisma.inscriptions.findFirst({
      where: {
        evenement_id: eventId,
        utilisateur_id: userId
      }
    });
    
    return { 
      isSubscribed: !!inscription,
      statut: inscription?.statut || null 
    };
  }

  async remove(eventId: number, userId: number) {
    const inscription = await this.prisma.inscriptions.findFirst({
      where: {
        evenement_id: eventId,
        utilisateur_id: userId
      }
    });
    
    if (!inscription) {
      throw new Error('Inscription non trouvée');
    }
    
    return this.prisma.inscriptions.delete({
      where: {
        id: inscription.id
      }
    });
  }
}