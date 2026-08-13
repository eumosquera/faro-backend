import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../core/database/prisma.service';
import { PhysicalGroup } from '../../../domain/entities/physical-group.entity';
import { PhysicalGroupRepository } from '../../../domain/repositories/physical-group.repository';

@Injectable()
export class PrismaPhysicalGroupRepository implements PhysicalGroupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<PhysicalGroup | null> {
    const record = await this.prisma.physicalGroup.findUnique({
      where: {
        id,
      },
    });

    if (!record) {
      return null;
    }

    return PhysicalGroup.create({
      id: record.id,
      residentialComplexId: record.residentialComplexId,
      name: record.name,
      type: record.type,
    });
  }

  async save(physicalGroup: PhysicalGroup): Promise<void> {
    await this.prisma.physicalGroup.upsert({
      where: {
        id: physicalGroup.id,
      },
      create: {
        id: physicalGroup.id,
        residentialComplexId: physicalGroup.residentialComplexId,
        name: physicalGroup.name,
        type: physicalGroup.type,
      },
      update: {
        residentialComplexId: physicalGroup.residentialComplexId,
        name: physicalGroup.name,
        type: physicalGroup.type,
      },
    });
  }
}
