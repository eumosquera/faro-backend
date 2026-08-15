import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../core/database/prisma.service';
import { RolePersona } from '../../../domain/entities/role-persona.entity';
import { RolePersonaRepository } from '../../../domain/repositories/role-persona.repository';

@Injectable()
export class PrismaRolePersonaRepository implements RolePersonaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<RolePersona | null> {
    const record = await this.prisma.rolePersona.findUnique({
      where: {
        id,
      },
    });

    if (!record) {
      return null;
    }

    return RolePersona.create({
      id: record.id,
      code: record.code,
      name: record.name,
      description: record.description,
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async findByCode(code: string): Promise<RolePersona | null> {
    const record = await this.prisma.rolePersona.findUnique({
      where: {
        code,
      },
    });

    if (!record) {
      return null;
    }

    return RolePersona.create({
      id: record.id,
      code: record.code,
      name: record.name,
      description: record.description,
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
  async findByName(name: string): Promise<RolePersona | null> {
    const record = await this.prisma.rolePersona.findUnique({
      where: {
        name,
      },
    });

    if (!record) {
      return null;
    }

    return RolePersona.create({
      id: record.id,
      code: record.code,
      name: record.name,
      description: record.description,
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async save(rolePersona: RolePersona): Promise<void> {
    await this.prisma.rolePersona.upsert({
      where: {
        id: rolePersona.id,
      },
      create: {
        id: rolePersona.id,
        code: rolePersona.code,
        name: rolePersona.name,
        description: rolePersona.description,
        status: rolePersona.status,
        createdAt: rolePersona.createdAt,
        updatedAt: rolePersona.updatedAt,
      },
      update: {
        code: rolePersona.code,
        name: rolePersona.name,
        description: rolePersona.description,
        status: rolePersona.status,
        updatedAt: rolePersona.updatedAt,
      },
    });
  }
}
