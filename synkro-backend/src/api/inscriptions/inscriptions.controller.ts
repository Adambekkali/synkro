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

  @Get('user/:id')
  getInscriptionsByUser(@Param('id') id: string) {
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
        throw new Error('Invalid ID format. ID must be a number.');
        }
    return this.inscriptionsService.getInscriptionsByUser(idNumber);
  }
  

  @Post()
  create(@Body() { evenement_id,utilisateur_id,date_inscription,statut}: { evenement_id: number; utilisateur_id: number; date_inscription: Date; statut: inscriptions_statut }) {
    return this.inscriptionsService.create(
      { evenement_id, utilisateur_id, date_inscription,statut }
    );
  }
}
