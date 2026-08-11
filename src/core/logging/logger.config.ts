import { ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import type { EnvSchema } from '../config/env.schema';

export function createLoggerModule() {
  return LoggerModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService<EnvSchema, true>) => ({
      pinoHttp: {
        level: configService.get('NODE_ENV', { infer: true }) === 'production' ? 'info' : 'debug',
      },
    }),
  });
}
