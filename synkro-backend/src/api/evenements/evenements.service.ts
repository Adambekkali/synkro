import { Injectable } from "@nestjs/common";
import { evenements_categorie } from "@prisma/client";
import { PrismaService } from "src/api/prisma/prisma.service";

@Injectable()
export class EvenementsService {
    constructor(private prisma: PrismaService) {}
    
      async getAll() {
        return this.prisma.evenements.findMany();
      }
    
      async getById(id: number) {
        return this.prisma.evenements.findUnique({
          where: { id },
        });
      }
    
      async create(
  
        titre: string,
        description: string,
        date_debut: Date,
        date_fin: Date,
        lieu: string,
        max_participants: number,
        date_limite_inscription: Date,
        est_prive: boolean,
        proprietaire_id: number,
         categorie: evenements_categorie

        
      ) {
        return this.prisma.evenements.create({
          data: { titre, description,lieu, date_debut, date_fin, max_participants, date_limite_inscription,est_prive,proprietaire_id,categorie: categorie },
        });
      }

      getEvenementsWithParticipants(id) {
        return this.prisma.evenements.findUnique({
          where: { id }, 
          include: {
            inscriptions: {include : { utilisateurs: true }}, 
          },
        });
      }

      getEventsByOrganizer(id: number) {
        return this.prisma.evenements.findMany({
          where: { proprietaire_id: id }, 
        });
      }
      
    }

   