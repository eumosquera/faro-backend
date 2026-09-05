import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { SupabaseAuthGuard } from '../../../../core/auth/presentation/supabase-auth.guard';
import type { AuthenticatedIdentity } from '../../../../core/auth/domain/authenticated-identity';

import { GetMyProfileUseCase } from '../../application/use-cases/get-my-profile/get-my-profile.use-case';
import type { GetMyProfileResult } from '../../application/use-cases/get-my-profile/get-my-profile.result';

import { GetMyApplicationAccessUseCase } from '../../application/use-cases/get-my-application-access/get-my-application-access.use-case';
import type { GetMyApplicationAccessResult } from '../../application/use-cases/get-my-application-access/get-my-application-access.result';

import { AddResidentialComplexUseCase } from '../../application/use-cases/add-residential-complex/add-residential-complex.use-case';
import { AddResidentialComplexRequest } from './add-residential-complex.request';

interface AuthenticatedRequest extends Request {
  user: AuthenticatedIdentity;
}

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly getMyApplicationAccessUseCase: GetMyApplicationAccessUseCase,
    private readonly addResidentialComplexUseCase: AddResidentialComplexUseCase,
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

  @Post('complexes')
  @UseGuards(SupabaseAuthGuard)
  async addComplex(
    @Req() request: AuthenticatedRequest,
    @Body() body: AddResidentialComplexRequest,
  ): Promise<{ residentialComplexId: string; membershipId: string }> {
    return this.addResidentialComplexUseCase.execute({
      externalAuthId: request.user.userId,
      name: body.name,
      address: body.address,
      city: body.city,
    });
  }
}
