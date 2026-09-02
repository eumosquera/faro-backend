import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { SupabaseAuthGuard } from '../../../../core/auth/presentation/supabase-auth.guard';
import type { AuthenticatedIdentity } from '../../../../core/auth/domain/authenticated-identity';

import { GetMyProfileUseCase } from '../../application/use-cases/get-my-profile/get-my-profile.use-case';
import type { GetMyProfileResult } from '../../application/use-cases/get-my-profile/get-my-profile.result';

import { GetMyApplicationAccessUseCase } from '../../application/use-cases/get-my-application-access/get-my-application-access.use-case';
import type { GetMyApplicationAccessResult } from '../../application/use-cases/get-my-application-access/get-my-application-access.result';

interface AuthenticatedRequest extends Request {
  user: AuthenticatedIdentity;
}

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly getMyApplicationAccessUseCase: GetMyApplicationAccessUseCase,
  ) {}

  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  async getMyProfile(@Req() request: AuthenticatedRequest): Promise<GetMyProfileResult> {
    return this.getMyProfileUseCase.execute(request.user.userId);
  }

  @Get('me/access')
  @UseGuards(SupabaseAuthGuard)
  async getMyApplicationAccess(
    @Req() request: AuthenticatedRequest,
  ): Promise<GetMyApplicationAccessResult> {
    return this.getMyApplicationAccessUseCase.execute(request.user.userId);
  }
}
