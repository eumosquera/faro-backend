import type { PrivateUnit } from '../entities/private-unit.entity';

export abstract class PrivateUnitRepository {
  abstract findById(id: string): Promise<PrivateUnit | null>;

  abstract save(privateUnit: PrivateUnit): Promise<void>;
}
