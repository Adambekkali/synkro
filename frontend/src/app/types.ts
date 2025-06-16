// /src/app/types.ts - Version complète avec rôles

// Enum des rôles
export enum UserRole {
  CITIZEN = "CITIZEN",
  ORGANIZER = "ORGANIZER", 
  ADMIN = "ADMIN"
}

// Interface utilisateur complète
export interface User {
  id: number;
  email: string;
  nom: string | null;
  prenom: string | null;
  role: UserRole;
  organization: string | null;
  is_approved: boolean;
  date_creation: Date | null;
}

// Interface événement (ajout des champs manquants)
export interface Event {
  id: number;
  titre: string;
  description: string | null;
  lieu: string | null;
  date_debut: string;
  date_fin: string;
  date_creation: string | null;
  max_participants: number | null;
  nb_participants: number | null;
  date_limite_inscription: string | null;
  est_prive: boolean | null;
  code_partage: string | null;
  est_annule: boolean | null;
  proprietaire_id: number;
  categorie: string; 
  
  // Relations
  proprietaire?: User;
}

// Interface invitation complète
export interface Invitation {
  id: number;
  evenement_id: number;
  email_invite: string;
  code_invitation: string;
  date_envoi: string | null;
  statut: "en_attente" | "acceptee" | "refusee";
  
  // Relations
  evenements: Event;
}

// Interface inscription complète
export interface Inscription {
  id: number;
  evenement_id: number;
  utilisateur_id: number;
  date_inscription: string | null;
  statut: "en_attente" | "confirmee" | "annulee" | "present";
  
  // Relations
  evenements: Event;
  utilisateurs?: User;
}

// Interface pour le payload JWT
export interface JwtPayload {
  id: number;
  username: string;  // email
  role: UserRole;
  organization?: string;
  iat: number;
  exp: number;
}

// Interface pour les données d'inscription
export interface RegisterData {
  email: string;
  mot_de_passe: string;
  nom: string;
  prenom: string;
  role: UserRole;
  organization?: string;
}

// Interface pour les données de connexion
export interface LoginData {
  email: string;
  password: string;
}

// Interface pour la réponse de connexion
export interface LoginResponse {
  access_token: string;
  user: User;
}