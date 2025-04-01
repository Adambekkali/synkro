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

  @Post()
  create(@Body() { email, mot_de_passe, nom, prenom }: { email: string; mot_de_passe: string; nom?: string; prenom?: string }) {
    return this.utilisateursService.create(email, mot_de_passe, nom, prenom);
  }
}
