// If you have an import like this at the top, update or remove it:
// import { Event, Invitation, Inscription } from '@/types';

// If you need to use these interfaces elsewhere, export them:
export interface Event {
        id: number;
        max_participants: number;
        nb_participants: number;
        date_fin: string;
        date_creation: string;
        proprietaire_id: number;
        titre: string;
        description: string;
        date_debut: string;
        lieu: string;
        evenement_categorie: string;
        est_prive: boolean;
  }

export interface Invitation {
  id: number;
  evenements: Event;
  email_invite: string;
  code_invitation: string;
  date_envoi: string;
  invitations_statut: string;
  utilisateur_id: number;

 
}

export interface Inscription {
  evenements: Event;
  statut: string;
}