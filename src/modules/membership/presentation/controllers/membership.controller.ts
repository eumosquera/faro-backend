import { Body, Controller, Post } from '@nestjs/common';

import { CreateMembershipUseCase } from '../../application/use-cases/create-membership/create-membership.use-case';

import { MembershipResponse } from './create-membership.response';
import { CreateMembershipRequest } from './create-membership.request';

@Controller('memberships')
export class MembershipController {
  constructor(private readonly createMembershipUseCase: CreateMembershipUseCase) {}

  @Post()
  async create(@Body() request: CreateMembershipRequest): Promise<MembershipResponse> {
    const membership = await this.createMembershipUseCase.execute({
      personId: request.personId,
      accessAccountId: request.accessAccountId ?? null,
      residentialComplexId: request.residentialComplexId,
      accessRoleId: request.accessRoleId,
      startDate: new Date(request.startDate),
      endDate: request.endDate ? new Date(request.endDate) : null,
    });

    return new MembershipResponse(membership);
  }
}
