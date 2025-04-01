import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EvenementsService } from './evenements.service';
import { evenements_categorie } from '@prisma/client';

@Controller('evenements')
export class EvenementsController {
  constructor(private evenementsService: EvenementsService) {}

  @Get()
  getAll() {
    return this.evenementsService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: String) {
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
        throw new Error('Invalid ID format. ID must be a number.');
        }
    return this.evenementsService.getById(idNumber);
  }

  @Post()
  create(@Body() { titre, description, date_debut, date_fin, lieu, max_participants, date_limite_inscription, est_prive, proprietaire_id, categorie }: { titre: string; description: string; date_debut: Date; date_fin: Date; lieu: string; max_participants: number; date_limite_inscription: Date; est_prive: boolean; proprietaire_id: number; categorie: evenements_categorie }) {
    return this.evenementsService.create(titre, description, date_debut, date_fin, lieu, max_participants, date_limite_inscription, est_prive, proprietaire_id, categorie);
  }
}
