import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../core/database/prisma.service';
import { PrivateUnit } from '../../../domain/entities/private-unit.entity';
import { PrivateUnitRepository } from '../../../domain/repositories/private-unit.repository';

@Injectable()
export class PrismaPrivateUnitRepository implements PrivateUnitRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<PrivateUnit | null> {
    const record = await this.prisma.privateUnit.findUnique({
      where: {
        id,
      },
    });

    if (!record) {
      return null;
    }

    return PrivateUnit.create({
      id: record.id,
      residentialComplexId: record.residentialComplexId,
      physicalGroupId: record.physicalGroupId,
      identifier: record.identifier,
      type: record.type,
      status: record.status,
    });
  }

  async save(privateUnit: PrivateUnit): Promise<void> {
    await this.prisma.privateUnit.upsert({
      where: {
        id: privateUnit.id,
      },
      create: {
        id: privateUnit.id,
        residentialComplexId: privateUnit.residentialComplexId,
        physicalGroupId: privateUnit.physicalGroupId,
        identifier: privateUnit.identifier,
        type: privateUnit.type,
        status: privateUnit.status,
      },
      update: {
        residentialComplexId: privateUnit.residentialComplexId,
        physicalGroupId: privateUnit.physicalGroupId,
        identifier: privateUnit.identifier,
        type: privateUnit.type,
        status: privateUnit.status,
      },
    });
  }
}
