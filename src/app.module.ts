import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validateEnv } from './core/config/env.validation';
import { HealthController } from './core/health/health.controller';
import { PrismaModule } from './core/database/prisma.module';
import { createLoggerModule } from './core/logging/logger.config';
import { StructureModule } from './modules/structure/structure.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    createLoggerModule(),
    PrismaModule,
    StructureModule,
    SharedModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
