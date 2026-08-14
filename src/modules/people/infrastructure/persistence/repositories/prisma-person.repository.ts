import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../core/database/prisma.service';
import { Person } from '../../../domain/entities/person.entity';
import { PersonRepository } from '../../../domain/repositories/person.repository';

@Injectable()
export class PrismaPersonRepository implements PersonRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Person | null> {
    const record = await this.prisma.person.findUnique({
      where: {
        id,
      },
    });

    if (!record) {
      return null;
    }

    return Person.create({
      id: record.id,
      identificationType: record.identificationType,
      identificationNumber: record.identificationNumber,
      fullName: record.fullName,
      email: record.email,
      phone: record.phone,
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async findByIdentification(
    identificationType: Person['identificationType'],
    identificationNumber: string,
  ): Promise<Person | null> {
    const record = await this.prisma.person.findUnique({
      where: {
        identificationType_identificationNumber: {
          identificationType,
          identificationNumber,
        },
      },
    });

    if (!record) {
      return null;
    }

    return Person.create({
      id: record.id,
      identificationType: record.identificationType,
      identificationNumber: record.identificationNumber,
      fullName: record.fullName,
      email: record.email,
      phone: record.phone,
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async save(person: Person): Promise<void> {
    await this.prisma.person.upsert({
      where: {
        id: person.id,
      },
      create: {
        id: person.id,
        identificationType: person.identificationType,
        identificationNumber: person.identificationNumber,
        fullName: person.fullName,
        email: person.email,
        phone: person.phone,
        status: person.status,
        createdAt: person.createdAt,
        updatedAt: person.updatedAt,
      },
      update: {
        identificationType: person.identificationType,
        identificationNumber: person.identificationNumber,
        fullName: person.fullName,
        email: person.email,
        phone: person.phone,
        status: person.status,
        updatedAt: person.updatedAt,
      },
    });
  }
}
