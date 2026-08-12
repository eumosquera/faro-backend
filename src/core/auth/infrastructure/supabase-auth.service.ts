import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { AuthenticatedIdentity } from '../domain/authenticated-identity';
import { SUPABASE_CLIENT } from './supabase.tokens';

@Injectable()
export class SupabaseAuthService {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient,
  ) {}

  async authenticate(accessToken: string): Promise<AuthenticatedIdentity> {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.getUser(accessToken);

    if (error || !user) {
      throw new UnauthorizedException('Invalid authentication token');
    }

    return {
      userId: user.id,
      email: user.email ?? null,
    };
  }
}
