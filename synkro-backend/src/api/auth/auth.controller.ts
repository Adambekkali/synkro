// src/auth/auth.controller.ts
import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    console.log(`Login attempt with email: ${req.user.email}`); // Log pour vérifier l'email reçu
    return this.authService.login(req.user);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('verify')
  getProfile(@Request() req) {
  return req.user;
}

}
