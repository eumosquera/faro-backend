import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../core/database/prisma.service';
import { ResidentialComplex } from '../../../domain/entities/residential-complex.entity';
import { ResidentialComplexRepository } from '../../../domain/repositories/residential-complex.repository';

@Injectable()
export class PrismaResidentialComplexRepository implements ResidentialComplexRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ResidentialComplex | null> {
    const record = await this.prisma.residentialComplex.findUnique({
      where: {
        id,
      },
    });

    if (!record) {
      return null;
    }

    return ResidentialComplex.create({
      id: record.id,
      name: record.name,
      address: record.address,
      city: record.city,
      status: record.status,
    });
  }

  async save(residentialComplex: ResidentialComplex): Promise<void> {
    await this.prisma.residentialComplex.upsert({
      where: {
        id: residentialComplex.id,
      },
      create: {
        id: residentialComplex.id,
        name: residentialComplex.name,
        address: residentialComplex.address,
        city: residentialComplex.city,
        status: residentialComplex.status,
      },
      update: {
        name: residentialComplex.name,
        address: residentialComplex.address,
        city: residentialComplex.city,
        status: residentialComplex.status,
      },
    });
  }
}
