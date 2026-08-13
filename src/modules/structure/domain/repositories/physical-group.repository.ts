import type { PhysicalGroup } from '../entities/physical-group.entity';

export abstract class PhysicalGroupRepository {
  abstract findById(id: string): Promise<PhysicalGroup | null>;

  abstract save(physicalGroup: PhysicalGroup): Promise<void>;
}
