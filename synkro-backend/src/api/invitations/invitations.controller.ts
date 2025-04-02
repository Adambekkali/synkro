import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { invitations_statut } from '@prisma/client';

@Controller('invitations')
export class InvitationsController {
  constructor(private invitationsService: InvitationsService) {}

  @Get()
  getAll() {
    return this.invitationsService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
      throw new Error('Invalid ID format. ID must be a number.');
    }
    return this.invitationsService.getById(idNumber);
  }

  @Post()
  create(@Body() { evenement_id,email_invite,code_invitation, utilisateur_id, statut, date_envoi }: { evenement_id: number;email_invite:string;code_invitation:string; utilisateur_id: number; statut: invitations_statut; date_envoi: Date }) {
     // Example value for date_envoi
    return this.invitationsService.create(
      { evenement_id, email_invite, code_invitation, statut, date_envoi }
    );
  }     

}
