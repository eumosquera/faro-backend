import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { AuthenticationGuard } from '../../../access/presentation/guards/authentication.guard';
import type { AuthenticatedUser } from '../../../access/presentation/authenticated-user';
import { ExternalAuthenticationGuard } from '../../../access/presentation/guards/external-authentication.guard';
import type { ExternallyAuthenticatedRequestUser } from '../../../access/presentation/guards/external-authentication.guard';

import { GetMyProfileUseCase } from '../../application/use-cases/get-my-profile/get-my-profile.use-case';
import type { GetMyProfileResult } from '../../application/use-cases/get-my-profile/get-my-profile.result';

import { GetMyApplicationAccessUseCase } from '../../application/use-cases/get-my-application-access/get-my-application-access.use-case';
import type { GetMyApplicationAccessResult } from '../../application/use-cases/get-my-application-access/get-my-application-access.result';

import { AddResidentialComplexUseCase } from '../../application/use-cases/add-residential-complex/add-residential-complex.use-case';
import { AddResidentialComplexRequest } from './add-residential-complex.request';

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

interface ExternallyAuthenticatedRequest extends Request {
  user: ExternallyAuthenticatedRequestUser;
}

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly getMyApplicationAccessUseCase: GetMyApplicationAccessUseCase,
    private readonly addResidentialComplexUseCase: AddResidentialComplexUseCase,
  ) {}

  @Get('me')
  @UseGuards(AuthenticationGuard)
  async getMyProfile(@Req() request: AuthenticatedRequest): Promise<GetMyProfileResult> {
    return this.getMyProfileUseCase.execute(request.user.personId);
  }

  // Guard permisivo a propósito: una cuenta sin acceso (desactivada, sin
  // membership) debe responder { hasApplicationAccess: false }, no un 401.
  @Get('me/access')
  @UseGuards(ExternalAuthenticationGuard)
  async getMyApplicationAccess(
    @Req() request: ExternallyAuthenticatedRequest,
  ): Promise<GetMyApplicationAccessResult> {
    return this.getMyApplicationAccessUseCase.execute(request.user.externalAuthId);
  }

  @Post('complexes')
  @UseGuards(AuthenticationGuard)
  async addComplex(
    @Req() request: AuthenticatedRequest,
    @Body() body: AddResidentialComplexRequest,
  ): Promise<{ residentialComplexId: string; membershipId: string }> {
    return this.addResidentialComplexUseCase.execute({
      personId: request.user.personId,
      name: body.name,
      address: body.address,
      city: body.city,
    });
  }
}
