import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UtilisateursService } from './utilisateurs.service';

@Controller('utilisateurs')
export class UtilisateursController {
  constructor(private utilisateursService: UtilisateursService) {}

  @Get()
  getAll() {
    return this.utilisateursService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: String) {
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
        throw new Error('Invalid ID format. ID must be a number.');
        }
    return this.utilisateursService.getById(idNumber);
  }

  @Get(':id/evenements')
  getByIdWithEvents(@Param('id') id: String) {
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
        throw new Error('Invalid ID format. ID must be a number.');
        }
    return this.utilisateursService.getByIdWithEvents(idNumber);
  }

  @Post()
  create(@Body() { email, mot_de_passe, nom, prenom, role, organization }: { 
    email: string; 
    mot_de_passe: string; 
    nom?: string; 
    prenom?: string;
    role?: string;           // ← NOUVEAU
    organization?: string;   // ← NOUVEAU
  }) {
    console.log('=== DEBUG CONTROLLER INSCRIPTION ===');
    console.log('Données reçues:', { email, mot_de_passe: '***', nom, prenom, role, organization });
    
    return this.utilisateursService.create(email, mot_de_passe, nom, prenom, role, organization);
  }
}