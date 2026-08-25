import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { AuthenticationContextService } from './application/authorization/authentication-context.service';
import { AUTHENTICATED_USER_REPOSITORY } from './domain/repositories/authenticated-user.repository.token';
import { EXTERNAL_AUTHENTICATION_SERVICE } from './domain/services/external-authentication.token';
import type { SupabaseAuthClient } from './infrastructure/authentication/supabase-external-authentication.service';
import { SUPABASE_AUTH_CLIENT } from './infrastructure/authentication/supabase-auth-client.token';
import { PrismaAuthenticatedUserRepository } from './infrastructure/persistence/repositories/prisma-authenticated-user.repository';
import { SupabaseExternalAuthenticationService } from './infrastructure/authentication/supabase-external-authentication.service';
import { AuthenticationGuard } from './presentation/guards/authentication.guard';

describe('AccessModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(SUPABASE_AUTH_CLIENT)
      .useValue({
        auth: {
          getUser: jest.fn(),
        },
      } satisfies SupabaseAuthClient)
      .compile();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should resolve AuthenticationGuard', () => {
    const guard = module.get<AuthenticationGuard>(AuthenticationGuard);

    expect(guard).toBeInstanceOf(AuthenticationGuard);
  });

  it('should resolve AuthenticationContextService', () => {
    const service = module.get<AuthenticationContextService>(AuthenticationContextService);

    expect(service).toBeInstanceOf(AuthenticationContextService);
  });

  it('should resolve the external authentication service', () => {
    const service = module.get<SupabaseExternalAuthenticationService>(
      EXTERNAL_AUTHENTICATION_SERVICE,
    );

    expect(service).toBeInstanceOf(SupabaseExternalAuthenticationService);
  });

  it('should resolve the authenticated user repository', () => {
    const repository = module.get<PrismaAuthenticatedUserRepository>(AUTHENTICATED_USER_REPOSITORY);

    expect(repository).toBeInstanceOf(PrismaAuthenticatedUserRepository);
  });

  it('should resolve the Supabase authentication client', () => {
    const client = module.get<SupabaseAuthClient>(SUPABASE_AUTH_CLIENT);

    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
    expect(typeof client.auth.getUser).toBe('function');
  });
});
