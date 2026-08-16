import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../core/database/prisma.service';
import { Permission } from '../../../domain/entities/permission.entity';
import { PermissionRepository } from '../../../domain/repositories/permission.repository';

@Injectable()
export class PrismaPermissionRepository implements PermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Permission | null> {
    const record = await this.prisma.permission.findUnique({
      where: {
        id,
      },
    });

    if (!record) {
      return null;
    }

    return Permission.create({
      id: record.id,
      code: record.code,
      name: record.name,
      description: record.description,
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async findByCode(code: string): Promise<Permission | null> {
    const record = await this.prisma.permission.findUnique({
      where: {
        code,
      },
    });

    if (!record) {
      return null;
    }

    return Permission.create({
      id: record.id,
      code: record.code,
      name: record.name,
      description: record.description,
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async findByName(name: string): Promise<Permission | null> {
    const record = await this.prisma.permission.findUnique({
      where: {
        name,
      },
    });

    if (!record) {
      return null;
    }

    return Permission.create({
      id: record.id,
      code: record.code,
      name: record.name,
      description: record.description,
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async save(permission: Permission): Promise<void> {
    await this.prisma.permission.upsert({
      where: {
        id: permission.id,
      },
      create: {
        id: permission.id,
        code: permission.code,
        name: permission.name,
        description: permission.description,
        status: permission.status,
        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt,
      },
      update: {
        code: permission.code,
        name: permission.name,
        description: permission.description,
        status: permission.status,
        updatedAt: permission.updatedAt,
      },
    });
  }
}
