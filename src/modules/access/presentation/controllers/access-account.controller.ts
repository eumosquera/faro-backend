import { Body, Controller, Param, Patch, Post } from '@nestjs/common';

import { ActivateAccessAccountUseCase } from '../../application/use-cases/activate-access-account/activate-access-account.use-case';
import { CreateAccessAccountUseCase } from '../../application/use-cases/create-access-account/create-access-account.use-case';
import { DeactivateAccessAccountUseCase } from '../../application/use-cases/deactivate-access-account/deactivate-access-account.use-case';

import { AccessAccountResponse } from './access-account.response';
import { CreateAccessAccountRequest } from './create-access-account.request';

@Controller('access-accounts')
export class AccessAccountController {
  constructor(
    private readonly createAccessAccountUseCase: CreateAccessAccountUseCase,
    private readonly activateAccessAccountUseCase: ActivateAccessAccountUseCase,
    private readonly deactivateAccessAccountUseCase: DeactivateAccessAccountUseCase,
  ) {}

  @Post()
  async create(@Body() request: CreateAccessAccountRequest): Promise<AccessAccountResponse> {
    const accessAccount = await this.createAccessAccountUseCase.execute({
      personId: request.personId,
      externalAuthId: request.externalAuthId,
    });

    return new AccessAccountResponse(accessAccount);
  }

  @Patch(':id/activate')
  async activate(@Param('id') id: string): Promise<void> {
    await this.activateAccessAccountUseCase.execute({
      accessAccountId: id,
    });
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string): Promise<void> {
    await this.deactivateAccessAccountUseCase.execute({
      accessAccountId: id,
    });
  }
}
