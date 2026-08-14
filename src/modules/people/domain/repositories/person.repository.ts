import type { Person } from '../entities/person.entity';

export abstract class PersonRepository {
  abstract findById(id: string): Promise<Person | null>;

  abstract findByIdentification(
    identificationType: Person['identificationType'],
    identificationNumber: string,
  ): Promise<Person | null>;

  abstract save(person: Person): Promise<void>;
}
