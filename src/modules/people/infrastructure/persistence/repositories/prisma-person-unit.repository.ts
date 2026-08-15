import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../core/database/prisma.service';
import { PersonUnit } from '../../../domain/entities/person-unit.entity';
import { PersonUnitRepository } from '../../../domain/repositories/person-unit.repository';

@Injectable()
export class PrismaPersonUnitRepository implements PersonUnitRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<PersonUnit | null> {
    const record = await this.prisma.personUnit.findUnique({
      where: {
        id,
      },
    });

    if (!record) {
      return null;
    }

    return PersonUnit.create({
      id: record.id,
      personId: record.personId,
      privateUnitId: record.privateUnitId,
      rolePersonaId: record.rolePersonaId,
      startDate: record.startDate,
      endDate: record.endDate,
      status: record.status,
      observations: record.observations,
    });
  }

  async save(personUnit: PersonUnit): Promise<void> {
    await this.prisma.personUnit.upsert({
      where: {
        id: personUnit.id,
      },
      create: {
        id: personUnit.id,
        personId: personUnit.personId,
        privateUnitId: personUnit.privateUnitId,
        rolePersonaId: personUnit.rolePersonaId,
        startDate: personUnit.startDate,
        endDate: personUnit.endDate,
        status: personUnit.status,
        observations: personUnit.observations,
      },
      update: {
        personId: personUnit.personId,
        privateUnitId: personUnit.privateUnitId,
        rolePersonaId: personUnit.rolePersonaId,
        startDate: personUnit.startDate,
        endDate: personUnit.endDate,
        status: personUnit.status,
        observations: personUnit.observations,
      },
    });
  }
}
