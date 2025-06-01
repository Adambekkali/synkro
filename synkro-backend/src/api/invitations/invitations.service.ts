import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { invitations_statut } from '@prisma/client';
const nodemailer = require('nodemailer');

@Injectable()
export class InvitationsService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.invitations.findMany();
  }

  async getById(id: number) {
    return this.prisma.invitations.findUnique({
      where: { id },
    });
  }

  async getInvitationsByUser (email_invite : string) {
    return this.prisma.invitations.findMany({
      where: { email_invite },
      include: {
        evenements: true,
      }
    });
  }
  async create(data: { evenement_id: number; email_invite: string; code_invitation: string; date_envoi: Date; statut: invitations_statut; }) {
    const invitation = await this.prisma.invitations.create({
      data: {
        evenement_id: data.evenement_id,
        email_invite: data.email_invite,
        code_invitation: data.code_invitation,
        date_envoi: data.date_envoi,
        statut: data.statut
      },
    });

    // Send email (using nodemailer as an example)
    // You should configure your transporter elsewhere and inject it for production code
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your email provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: data.email_invite,
      subject: 'You are invited!',
      text: `You have been invited to an event. Your invitation code is: ${data.code_invitation}`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      // Handle email sending error (log or throw as needed)
      console.error('Failed to send invitation email:', error);
    }

    return invitation;
  }

}
