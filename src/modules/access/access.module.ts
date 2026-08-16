import { Module } from '@nestjs/common';

import { CreateAccessRoleUseCase } from './application/use-cases/create-access-role/create-access-role.use-case';
import { AccessRoleRepository } from './domain/repositories/access-role.repository';
import { PrismaAccessRoleRepository } from './infrastructure/persistence/repositories/prisma-access-role.repository';
import { AccessRoleController } from './presentation/controllers/access-role.controller';

import { CreatePermissionUseCase } from './application/use-cases/create-permission/create-permission.use-case';
import { PermissionRepository } from './domain/repositories/permission.repository';
import { PrismaPermissionRepository } from './infrastructure/persistence/repositories/prisma-permission.repository';
import { PermissionController } from './presentation/controllers/permission.controller';

import { AssignPermissionToAccessRoleUseCase } from './application/use-cases/assign-permission-to-access-role/assign-permission-to-access-role.use-case';
import { RemovePermissionFromAccessRoleUseCase } from './application/use-cases/remove-permission-from-access-role/remove-permission-from-access-role.use-case';

import { AccessRolePermissionRepository } from './domain/repositories/access-role-permission.repository';
import { PrismaAccessRolePermissionRepository } from './infrastructure/persistence/repositories/prisma-access-role-permission.repository';

import { AccessRolePermissionController } from './presentation/controllers/access-role-permission.controller';

@Module({
  controllers: [AccessRoleController, PermissionController, AccessRolePermissionController],
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

    PrismaAccessRolePermissionRepository,
    {
      provide: AccessRolePermissionRepository,
      useExisting: PrismaAccessRolePermissionRepository,
    },
    AssignPermissionToAccessRoleUseCase,
    RemovePermissionFromAccessRoleUseCase,
  ],
  exports: [
    CreateAccessRoleUseCase,
    CreatePermissionUseCase,
    AssignPermissionToAccessRoleUseCase,
    RemovePermissionFromAccessRoleUseCase,
  ],
})
export class AccessModule {}
