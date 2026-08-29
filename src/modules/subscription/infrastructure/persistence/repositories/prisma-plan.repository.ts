import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../core/database/prisma.service';
import { Plan } from '../../../domain/entities/plan.entity';
import type { PlanStatus } from '../../../domain/entities/plan.entity';
import { PlanRepository } from '../../../domain/repositories/plan.repository';

@Injectable()
export class PrismaPlanRepository implements PlanRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Plan | null> {
    const record = await this.prisma.plan.findUnique({
      where: {
        id,
      },
    });

    if (!record) {
      return null;
    }

    return Plan.create({
      id: record.id,
      code: record.code,
      name: record.name,
      maxComplexes: record.maxComplexes,
      maxUnits: record.maxUnits,
      monthlyPrice: Number(record.monthlyPrice),
      yearlyPrice: Number(record.yearlyPrice),
      quarterlyPrice: Number(record.quarterlyPrice),
      status: record.status,
    });
  }

  async findByCode(code: string): Promise<Plan | null> {
    const record = await this.prisma.plan.findUnique({
      where: {
        code,
      },
    });

    if (!record) {
      return null;
    }

    return Plan.create({
      id: record.id,
      code: record.code,
      name: record.name,
      maxComplexes: record.maxComplexes,
      maxUnits: record.maxUnits,
      monthlyPrice: Number(record.monthlyPrice),
      yearlyPrice: Number(record.yearlyPrice),
      quarterlyPrice: Number(record.quarterlyPrice),
      status: record.status,
    });
  }

  async findAll(status?: PlanStatus): Promise<Plan[]> {
    const records = await this.prisma.plan.findMany({
      where: status ? { status } : undefined,
      orderBy: { monthlyPrice: 'asc' },
    });

    return records.map((record) =>
      Plan.create({
        id: record.id,
        code: record.code,
        name: record.name,
        maxComplexes: record.maxComplexes,
        maxUnits: record.maxUnits,
        monthlyPrice: Number(record.monthlyPrice),
        yearlyPrice: Number(record.yearlyPrice),
        quarterlyPrice: Number(record.quarterlyPrice),
        status: record.status,
      }),
    );
  }

  async save(plan: Plan): Promise<void> {
    await this.prisma.plan.upsert({
      where: {
        id: plan.id,
      },
      create: {
        id: plan.id,
        code: plan.code,
        name: plan.name,
        maxComplexes: plan.maxComplexes,
        maxUnits: plan.maxUnits,
        monthlyPrice: plan.monthlyPrice,
        yearlyPrice: plan.yearlyPrice,
        quarterlyPrice: plan.quarterlyPrice,
        status: plan.status,
      },
      update: {
        code: plan.code,
        name: plan.name,
        maxComplexes: plan.maxComplexes,
        maxUnits: plan.maxUnits,
        monthlyPrice: plan.monthlyPrice,
        yearlyPrice: plan.yearlyPrice,
        quarterlyPrice: plan.quarterlyPrice,
        status: plan.status,
      },
    });
  }
}
