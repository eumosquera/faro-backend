import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../core/database/prisma.service';
import { AccessRolePermission } from '../../../domain/entities/access-role-permission.entity';
import { AccessRolePermissionRepository } from '../../../domain/repositories/access-role-permission.repository';

@Injectable()
export class PrismaAccessRolePermissionRepository implements AccessRolePermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<AccessRolePermission | null> {
    const record = await this.prisma.accessRolePermission.findUnique({
      where: {
        id,
      },
    });

    if (!record) {
      return null;
    }

    return AccessRolePermission.create({
      id: record.id,
      accessRoleId: record.accessRoleId,
      permissionId: record.permissionId,
      createdAt: record.createdAt,
    });
  }

  async findByRoleAndPermission(
    accessRoleId: string,
    permissionId: string,
  ): Promise<AccessRolePermission | null> {
    const record = await this.prisma.accessRolePermission.findUnique({
      where: {
        accessRoleId_permissionId: {
          accessRoleId,
          permissionId,
        },
      },
    });

    if (!record) {
      return null;
    }

    return AccessRolePermission.create({
      id: record.id,
      accessRoleId: record.accessRoleId,
      permissionId: record.permissionId,
      createdAt: record.createdAt,
    });
  }

  async save(accessRolePermission: AccessRolePermission): Promise<void> {
    await this.prisma.accessRolePermission.upsert({
      where: {
        id: accessRolePermission.id,
      },
      create: {
        id: accessRolePermission.id,
        accessRoleId: accessRolePermission.accessRoleId,
        permissionId: accessRolePermission.permissionId,
        createdAt: accessRolePermission.createdAt,
      },
      update: {
        accessRoleId: accessRolePermission.accessRoleId,
        permissionId: accessRolePermission.permissionId,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.accessRolePermission.delete({
      where: {
        id,
      },
    });
  }
}
