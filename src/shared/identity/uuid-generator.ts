import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { IdGenerator } from './id-generator';

@Injectable()
export class UuidGenerator implements IdGenerator {
  generate(): string {
    return randomUUID();
  }
}
