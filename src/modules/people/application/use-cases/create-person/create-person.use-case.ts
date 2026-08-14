import { Injectable } from '@nestjs/common';

import { Person } from '../../../domain/entities/person.entity';
import { PersonRepository } from '../../../domain/repositories/person.repository';
import { IdGenerator } from '../../../../../shared/identity/id-generator';
import { PersonAlreadyExistsError } from '../../errors/person-already-exists.error';
import { PersonContactRequiredError } from '../../errors/person-contact-required.error';
import type { CreatePersonDto } from './create-person.dto';

@Injectable()
export class CreatePersonUseCase {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(dto: CreatePersonDto): Promise<Person> {
    const existingPerson = await this.personRepository.findByIdentification(
      dto.identificationType,
      dto.identificationNumber,
    );

    if (existingPerson) {
      throw new PersonAlreadyExistsError(dto.identificationType, dto.identificationNumber);
    }

    if (!dto.email && !dto.phone) {
      throw new PersonContactRequiredError();
    }

    const now = new Date();

    const person = Person.create({
      id: this.idGenerator.generate(),
      identificationType: dto.identificationType,
      identificationNumber: dto.identificationNumber,
      fullName: dto.fullName,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    });

    await this.personRepository.save(person);

    return person;
  }
}
