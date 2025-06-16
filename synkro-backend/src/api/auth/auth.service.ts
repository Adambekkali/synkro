import { Injectable } from '@nestjs/common';
import { UtilisateursService } from '../utilisateurs/utilisateurs.service';
import { JwtService } from '@nestjs/jwt';

export interface LoginResponse {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private utilisateursService: UtilisateursService) {}

  async validateUser(email: string, password: string) {
    const user = await this.utilisateursService.findByUsername(email);
    if (user && user.mot_de_passe === password) {
      const { mot_de_passe, ...rest } = user;
      return rest; // Ceci inclut maintenant role et organization
    }
    return null;
  }

  async login(user: any) {
    // AJOUT DU RÔLE ET ORGANISATION DANS LE PAYLOAD
    const payload = { 
      username: user.email, 
      id: user.id,
      role: user.role,           // ← NOUVEAU
      organization: user.organization  // ← NOUVEAU
    };
    
    console.log('=== DEBUG BACKEND AUTH ===');
    console.log('User complet:', user);
    console.log('Payload créé:', payload);
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}