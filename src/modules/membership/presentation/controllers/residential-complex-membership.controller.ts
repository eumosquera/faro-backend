import { Controller, Param, Patch, UseGuards } from '@nestjs/common';

import { DeactivateMembershipUseCase } from '../../application/use-cases/deactivate-membership/deactivate-membership.use-case';

import { RequirePermission } from '../../../access/presentation/decorators/require-permission.decorator';
import { AuthenticationGuard } from '../../../access/presentation/guards/authentication.guard';
import { AuthorizationGuard } from '../../../access/presentation/guards/authorization.guard';

import { MembershipResponse } from './create-membership.response';

@Controller('residential-complexes/:residentialComplexId/memberships')
@UseGuards(AuthenticationGuard, AuthorizationGuard)
export class ResidentialComplexMembershipController {
  constructor(private readonly deactivateMembershipUseCase: DeactivateMembershipUseCase) {}

  @Patch(':membershipId/deactivate')
  @RequirePermission('MEMBERSHIP_DEACTIVATE')
  async deactivate(
    @Param('residentialComplexId') residentialComplexId: string,
    @Param('membershipId') membershipId: string,
  ): Promise<MembershipResponse> {
    const membership = await this.deactivateMembershipUseCase.execute({
      membershipId,
      residentialComplexId,
    });

    return new MembershipResponse(membership);
  }
}
