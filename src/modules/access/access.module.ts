import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createSupabaseClient } from '../../core/auth/infrastructure/supabase-client';
import { SUPABASE_AUTH_CLIENT } from './infrastructure/authentication/supabase-auth-client.token';

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

import { ActivateAccessAccountUseCase } from './application/use-cases/activate-access-account/activate-access-account.use-case';
import { CreateAccessAccountUseCase } from './application/use-cases/create-access-account/create-access-account.use-case';
import { DeactivateAccessAccountUseCase } from './application/use-cases/deactivate-access-account/deactivate-access-account.use-case';
import { AccessAccountRepository } from './domain/repositories/access-account.repository';
import { PrismaAccessAccountRepository } from './infrastructure/persistence/repositories/prisma-access-account.repository';
import { AccessAccountController } from './presentation/controllers/access-account.controller';
import { PeopleModule } from '../people/people.module';

import { AuthenticationContextService } from './application/authorization/authentication-context.service';
import { EXTERNAL_AUTHENTICATION_SERVICE } from './domain/services/external-authentication.token';
import { SupabaseExternalAuthenticationService } from './infrastructure/authentication/supabase-external-authentication.service';
import { PrismaAuthenticatedUserRepository } from './infrastructure/persistence/repositories/prisma-authenticated-user.repository';
import { AUTHENTICATED_USER_REPOSITORY } from './domain/repositories/authenticated-user.repository.token';
import { AuthenticationGuard } from './presentation/guards/authentication.guard';
import { AuthorizationGuard } from './presentation/guards/authorization.guard';

import { AuthorizationTestController } from './presentation/controllers/authorization-test.controller';
import { AuthorizationService } from './application/authorization/authorization.service';
import { AUTHORIZATION_CONTEXT_REPOSITORY } from './domain/repositories/authorization-context.repository.token';
import { PrismaAuthorizationContextRepository } from './infrastructure/persistence/repositories/prisma-authorization-context.repository';

@Module({
  imports: [PeopleModule],
  controllers: [
    AccessRoleController,
    PermissionController,
    AccessRolePermissionController,
    AccessAccountController,
    AuthorizationTestController,
  ],
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

    PrismaAccessAccountRepository,
    {
      provide: AccessAccountRepository,
      useExisting: PrismaAccessAccountRepository,
    },

    AuthenticationContextService,
    {
      provide: AUTHENTICATED_USER_REPOSITORY,
      useClass: PrismaAuthenticatedUserRepository,
    },

    AuthenticationGuard,
    AuthorizationGuard,
    {
      provide: EXTERNAL_AUTHENTICATION_SERVICE,
      useClass: SupabaseExternalAuthenticationService,
    },
    AuthorizationService,

    {
      provide: SUPABASE_AUTH_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => createSupabaseClient(configService),
    },

    {
      provide: AUTHORIZATION_CONTEXT_REPOSITORY,
      useClass: PrismaAuthorizationContextRepository,
    },

    CreateAccessAccountUseCase,
    ActivateAccessAccountUseCase,
    DeactivateAccessAccountUseCase,
  ],
  exports: [
    CreateAccessRoleUseCase,
    CreatePermissionUseCase,
    AssignPermissionToAccessRoleUseCase,
    RemovePermissionFromAccessRoleUseCase,
    AccessRoleRepository,
    AccessAccountRepository,
  ],
})
export class AccessModule {}
