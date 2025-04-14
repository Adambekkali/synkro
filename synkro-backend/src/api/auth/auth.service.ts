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
      return rest;
    }
    return null;
  }
  async login(user: any) {
    const payload = { username: user.email, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
    
}
