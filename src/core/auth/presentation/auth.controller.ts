import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import type { AuthenticatedIdentity } from '../domain/authenticated-identity';
import { SupabaseAuthGuard } from './supabase-auth.guard';

interface AuthenticatedRequest extends Request {
  user: AuthenticatedIdentity;
}

@Controller('auth')
export class AuthController {
  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  getCurrentUser(@Req() request: AuthenticatedRequest): AuthenticatedIdentity {
    return request.user;
  }
}
