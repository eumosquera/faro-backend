import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validateEnv } from './core/config/env.validation';
import { HealthController } from './core/health/health.controller';
import { PrismaModule } from './core/database/prisma.module';
import { createLoggerModule } from './core/logging/logger.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    createLoggerModule(),
    PrismaModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
