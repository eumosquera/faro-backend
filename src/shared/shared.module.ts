import { Global, Module } from '@nestjs/common';

import { IdGenerator } from './identity/id-generator';
import { UuidGenerator } from './identity/uuid-generator';

@Global()
@Module({
  providers: [
    UuidGenerator,
    {
      provide: IdGenerator,
      useExisting: UuidGenerator,
    },
  ],
  exports: [IdGenerator],
})
export class SharedModule {}
