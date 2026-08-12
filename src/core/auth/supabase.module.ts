import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { createSupabaseClient } from './infrastructure/supabase-client';
import { SupabaseAuthService } from './infrastructure/supabase-auth.service';
import { SUPABASE_CLIENT } from './infrastructure/supabase.tokens';
import { SupabaseAuthGuard } from './presentation/supabase-auth.guard';
import { AuthController } from './presentation/auth.controller';

@Module({
  imports: [ConfigModule],
  controllers: [AuthController],
  providers: [
    {
      provide: SUPABASE_CLIENT,
      inject: [ConfigService],
      useFactory: createSupabaseClient,
    },
    SupabaseAuthService,
    SupabaseAuthGuard,
  ],
  exports: [SUPABASE_CLIENT, SupabaseAuthService, SupabaseAuthGuard],
})
export class SupabaseModule {}
