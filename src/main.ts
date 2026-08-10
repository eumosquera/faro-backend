import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

import type { EnvSchema } from './core/config/env.schema';

import { GlobalExceptionFilter } from './core/errors/global-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService<EnvSchema, true>>(ConfigService);

  app.useGlobalFilters(new GlobalExceptionFilter());

  const port = configService.get('PORT', { infer: true });

  await app.listen(port);
}

void bootstrap();
