import { createClient } from '@supabase/supabase-js';

import type { ConfigService } from '@nestjs/config';

export function createSupabaseClient(configService: ConfigService) {
  const supabaseUrl = configService.getOrThrow<string>('SUPABASE_URL');
  const supabasePublishableKey = configService.getOrThrow<string>('SUPABASE_PUBLISHABLE_KEY');

  return createClient(supabaseUrl, supabasePublishableKey);
}
