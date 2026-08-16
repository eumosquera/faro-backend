import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../core/database/prisma.service';
import { AccessRole } from '../../../domain/entities/access-role.entity';
import { AccessRoleRepository } from '../../../domain/repositories/access-role.repository';

@Injectable()
export class PrismaAccessRoleRepository implements AccessRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<AccessRole | null> {
    const record = await this.prisma.accessRole.findUnique({
      where: {
        id,
      },
    });

    if (!record) {
      return null;
    }

    return AccessRole.create({
      id: record.id,
      code: record.code,
      name: record.name,
      description: record.description,
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async findByCode(code: string): Promise<AccessRole | null> {
    const record = await this.prisma.accessRole.findUnique({
      where: {
        code,
      },
    });

    if (!record) {
      return null;
    }

    return AccessRole.create({
      id: record.id,
      code: record.code,
      name: record.name,
      description: record.description,
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async findByName(name: string): Promise<AccessRole | null> {
    const record = await this.prisma.accessRole.findUnique({
      where: {
        name,
      },
    });

    if (!record) {
      return null;
    }

    return AccessRole.create({
      id: record.id,
      code: record.code,
      name: record.name,
      description: record.description,
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async save(accessRole: AccessRole): Promise<void> {
    await this.prisma.accessRole.upsert({
      where: {
        id: accessRole.id,
      },
      create: {
        id: accessRole.id,
        code: accessRole.code,
        name: accessRole.name,
        description: accessRole.description,
        status: accessRole.status,
        createdAt: accessRole.createdAt,
        updatedAt: accessRole.updatedAt,
      },
      update: {
        code: accessRole.code,
        name: accessRole.name,
        description: accessRole.description,
        status: accessRole.status,
        updatedAt: accessRole.updatedAt,
      },
    });
  }
}
