import { Module } from '@nestjs/common';

import { CreateAccessRoleUseCase } from './application/use-cases/create-access-role/create-access-role.use-case';
import { AccessRoleRepository } from './domain/repositories/access-role.repository';
import { PrismaAccessRoleRepository } from './infrastructure/persistence/repositories/prisma-access-role.repository';
import { AccessRoleController } from './presentation/controllers/access-role.controller';

import { CreatePermissionUseCase } from './application/use-cases/create-permission/create-permission.use-case';
import { PermissionRepository } from './domain/repositories/permission.repository';
import { PrismaPermissionRepository } from './infrastructure/persistence/repositories/prisma-permission.repository';
import { PermissionController } from './presentation/controllers/permission.controller';

@Module({
  controllers: [AccessRoleController, PermissionController],
  providers: [
    PrismaAccessRoleRepository,
    {
      provide: AccessRoleRepository,
      useExisting: PrismaAccessRoleRepository,
    },
    CreateAccessRoleUseCase,

    PrismaPermissionRepository,
    {
      provide: PermissionRepository,
      useExisting: PrismaPermissionRepository,
    },
    CreatePermissionUseCase,
  ],
  exports: [CreateAccessRoleUseCase, CreatePermissionUseCase],
})
export class AccessModule {}
