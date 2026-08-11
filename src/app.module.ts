import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validateEnv } from './core/config/env.validation';
import { HealthController } from './core/health/health.controller';
import { createLoggerModule } from './core/logging/logger.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    createLoggerModule(),
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
