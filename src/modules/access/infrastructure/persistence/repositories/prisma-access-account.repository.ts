import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../core/database/prisma.service';
import { AccessAccount } from '../../../domain/entities/access-account.entity';
import { AccessAccountRepository } from '../../../domain/repositories/access-account.repository';

@Injectable()
export class PrismaAccessAccountRepository implements AccessAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<AccessAccount | null> {
    const record = await this.prisma.accessAccount.findUnique({
      where: {
        id,
      },
    });

    if (!record) {
      return null;
    }

    return AccessAccount.create({
      id: record.id,
      personId: record.personId,
      externalAuthId: record.externalAuthId,
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async findByPersonId(personId: string): Promise<AccessAccount | null> {
    const record = await this.prisma.accessAccount.findUnique({
      where: {
        personId,
      },
    });

    if (!record) {
      return null;
    }

    return AccessAccount.create({
      id: record.id,
      personId: record.personId,
      externalAuthId: record.externalAuthId,
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async findByExternalAuthId(externalAuthId: string): Promise<AccessAccount | null> {
    const record = await this.prisma.accessAccount.findUnique({
      where: {
        externalAuthId,
      },
    });

    if (!record) {
      return null;
    }

    return AccessAccount.create({
      id: record.id,
      personId: record.personId,
      externalAuthId: record.externalAuthId,
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async save(accessAccount: AccessAccount): Promise<void> {
    await this.prisma.accessAccount.upsert({
      where: {
        id: accessAccount.id,
      },
      create: {
        id: accessAccount.id,
        personId: accessAccount.personId,
        externalAuthId: accessAccount.externalAuthId,
        status: accessAccount.status,
        createdAt: accessAccount.createdAt,
      },
      update: {
        personId: accessAccount.personId,
        externalAuthId: accessAccount.externalAuthId,
        status: accessAccount.status,
      },
    });
  }
}
