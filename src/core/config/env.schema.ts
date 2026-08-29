import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  PORT: z.coerce.number().int().min(1).max(65535).default(3000),

  DATABASE_URL: z.string().url(),

  SUPABASE_URL: z.string().url(),
  SUPABASE_PUBLISHABLE_KEY: z.string().min(1),

  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
});

export type EnvSchema = z.infer<typeof envSchema>;
