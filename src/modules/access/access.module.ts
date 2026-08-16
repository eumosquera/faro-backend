import { Module } from '@nestjs/common';

import { CreateAccessRoleUseCase } from './application/use-cases/create-access-role/create-access-role.use-case';
import { AccessRoleRepository } from './domain/repositories/access-role.repository';
import { PrismaAccessRoleRepository } from './infrastructure/persistence/repositories/prisma-access-role.repository';
import { AccessRoleController } from './presentation/controllers/access-role.controller';

@Module({
  controllers: [AccessRoleController],
  providers: [
    PrismaAccessRoleRepository,
    {
      provide: AccessRoleRepository,
      useExisting: PrismaAccessRoleRepository,
    },
    CreateAccessRoleUseCase,
  ],
  exports: [CreateAccessRoleUseCase],
})
export class AccessModule {}
