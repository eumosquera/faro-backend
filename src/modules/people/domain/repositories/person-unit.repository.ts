import type { PersonUnit } from '../entities/person-unit.entity';

export abstract class PersonUnitRepository {
  abstract findById(id: string): Promise<PersonUnit | null>;

  abstract save(personUnit: PersonUnit): Promise<void>;
}
