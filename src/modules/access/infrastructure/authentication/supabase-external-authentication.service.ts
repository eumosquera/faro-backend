import { Inject, Injectable } from '@nestjs/common';

import type { ExternalAuthenticationService } from '../../domain/services/external-authentication.service';
import { InvalidAuthenticationError } from '../../application/errors/invalid-authentication.error';
import { SUPABASE_AUTH_CLIENT } from './supabase-auth-client.token';

export interface SupabaseAuthClient {
  auth: {
    getUser(accessToken: string): Promise<{
      data: {
        user: {
          id: string;
        } | null;
      };
      error: unknown;
    }>;
  };
}

@Injectable()
export class SupabaseExternalAuthenticationService implements ExternalAuthenticationService {
  constructor(
    @Inject(SUPABASE_AUTH_CLIENT)
    private readonly supabase: SupabaseAuthClient,
  ) {}

  async getAuthenticatedUser(
    authorizationHeader: string | undefined,
  ): Promise<{ externalAuthId: string }> {
    if (!authorizationHeader) {
      throw new InvalidAuthenticationError();
    }

    const [scheme, token] = authorizationHeader.split(' ');

    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      throw new InvalidAuthenticationError();
    }

    const { data, error } = await this.supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new InvalidAuthenticationError();
    }

    return {
      externalAuthId: data.user.id,
    };
  }
}
