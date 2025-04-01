import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InscriptionsService } from './inscriptions.service';
import { inscriptions_statut } from '@prisma/client';

@Controller('inscriptions')
export class InscriptionsController {
  constructor(private inscriptionsService: InscriptionsService) {}

  @Get()
  getAll() {
    return this.inscriptionsService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: String) {
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
        throw new Error('Invalid ID format. ID must be a number.');
        }
    return this.inscriptionsService.getById(idNumber);
  }

  @Post()
  create(@Body() { evenement_id,utilisateur_id,statut,date_inscription}: { evenement_id: number; utilisateur_id: number; statut: inscriptions_statut; date_inscription: Date }) {
    return this.inscriptionsService.create(
      evenement_id,
      utilisateur_id,
      statut,
      date_inscription,
      { evenement_id, utilisateur_id, date_inscription, statut }
    );
  }
}
