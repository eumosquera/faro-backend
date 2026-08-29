import { Injectable } from '@nestjs/common';

import { Plan, PlanStatus } from '../../../domain/entities/plan.entity';
import { PlanRepository } from '../../../domain/repositories/plan.repository';
import type { ListPlansDto } from './list-plans.dto';

@Injectable()
export class ListPlansUseCase {
  constructor(private readonly planRepository: PlanRepository) {}

  async execute(dto: ListPlansDto): Promise<Plan[]> {
    const status: PlanStatus | undefined = dto.onlyActive ? 'ACTIVE' : undefined;

    return this.planRepository.findAll(status);
  }
}
