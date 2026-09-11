import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { createSupabaseClient } from './infrastructure/supabase-client';
import { SUPABASE_CLIENT } from './infrastructure/supabase.tokens';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: SUPABASE_CLIENT,
      inject: [ConfigService],
      useFactory: createSupabaseClient,
    },
  ],
  exports: [SUPABASE_CLIENT],
})
export class SupabaseModule {}
