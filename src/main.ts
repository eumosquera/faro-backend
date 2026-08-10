import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';

import { AppModule } from './app.module';
import type { EnvSchema } from './core/config/env.schema';
import { setupSwagger } from './core/documentation/swagger.config';
import { GlobalExceptionFilter } from './core/errors/global-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService<EnvSchema, true>>(ConfigService);

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  setupSwagger(app);

  const port = configService.get('PORT', { infer: true });

  await app.listen(port);
}

void bootstrap();
