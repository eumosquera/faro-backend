import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../core/database/prisma.service';

import { Membership } from '../../../domain/entities/membership.entity';

import { MembershipRepository } from '../../../domain/repositories/membership.repository';

@Injectable()
export class PrismaMembershipRepository implements MembershipRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(membership: Membership): Promise<Membership> {
    const record = await this.prisma.membership.upsert({
      where: {
        id: membership.id,
      },
      create: {
        id: membership.id,
        personId: membership.personId,
        accessAccountId: membership.accessAccountId,
        residentialComplexId: membership.residentialComplexId,
        accessRoleId: membership.accessRoleId,
        status: membership.status,
        startDate: membership.startDate,
        endDate: membership.endDate,
        createdAt: membership.createdAt,
        updatedAt: membership.updatedAt,
      },
      update: {
        accessAccountId: membership.accessAccountId,
        status: membership.status,
        startDate: membership.startDate,
        endDate: membership.endDate,
        updatedAt: membership.updatedAt,
      },
    });

    return this.toDomain(record);
  }

  async findById(id: string): Promise<Membership | null> {
    const record = await this.prisma.membership.findUnique({
      where: {
        id,
      },
    });

    return record ? this.toDomain(record) : null;
  }

  async findActiveByPersonId(personId: string): Promise<Membership[]> {
    const records = await this.prisma.membership.findMany({
      where: {
        personId,
        status: 'ACTIVE',
      },
      orderBy: { createdAt: 'asc' },
    });

    return records.map((record) => this.toDomain(record));
  }

  async findActiveByPersonAndResidentialComplex(
    personId: string,
    residentialComplexId: string,
  ): Promise<Membership | null> {
    const record = await this.prisma.membership.findFirst({
      where: {
        personId,
        residentialComplexId,
        status: 'ACTIVE',
      },
    });

    return record ? this.toDomain(record) : null;
  }

  async findActiveByAccessAccountAndResidentialComplex(
    accessAccountId: string,
    residentialComplexId: string,
  ): Promise<Membership | null> {
    const record = await this.prisma.membership.findFirst({
      where: {
        accessAccountId,
        residentialComplexId,
        status: 'ACTIVE',
      },
    });

    return record ? this.toDomain(record) : null;
  }

  private toDomain(record: {
    id: string;
    personId: string;
    accessAccountId: string | null;
    residentialComplexId: string;
    accessRoleId: string;
    status: 'ACTIVE' | 'INACTIVE';
    startDate: Date;
    endDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): Membership {
    return Membership.create({
      id: record.id,
      personId: record.personId,
      accessAccountId: record.accessAccountId,
      residentialComplexId: record.residentialComplexId,
      accessRoleId: record.accessRoleId,
      status: record.status,
      startDate: record.startDate,
      endDate: record.endDate,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
