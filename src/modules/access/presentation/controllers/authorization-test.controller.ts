import { Controller, Get, UseGuards } from '@nestjs/common';

import { RequirePermission } from '../decorators/require-permission.decorator';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { AuthorizationGuard } from '../guards/authorization.guard';

@Controller('access/test')
@UseGuards(AuthenticationGuard, AuthorizationGuard)
export class AuthorizationTestController {
  @Get('residential-complexes/:residentialComplexId/resident-update')
  @RequirePermission('RESIDENT_UPDATE')
  testResidentUpdate() {
    return {
      authorized: true,
    };
  }
}
