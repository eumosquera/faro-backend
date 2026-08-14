import { Injectable } from '@nestjs/common';

import { IdGenerator } from '../../../../../shared/identity/id-generator';
import { Plan } from '../../../domain/entities/plan.entity';
import { PlanRepository } from '../../../domain/repositories/plan.repository';
import { PlanCodeAlreadyExistsError } from '../../errors/plan-code-already-exists.error';
import type { CreatePlanDto } from './create-plan.dto';

import { InvalidPlanComplexesError } from '../../errors/invalid-plan-complexes.error';
import { InvalidPlanMonthlyPriceError } from '../../errors/invalid-plan-monthly-price.error';
import { InvalidPlanUnitsError } from '../../errors/invalid-plan-units.error';
import { InvalidPlanYearlyPriceError } from '../../errors/invalid-plan-yearly-price.error';
import { InvalidPlanQuarterlyPriceError } from '../../errors/invalid-plan-quarterly-price.error';

@Injectable()
export class CreatePlanUseCase {
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(dto: CreatePlanDto): Promise<Plan> {
    const existingPlan = await this.planRepository.findByCode(dto.code);

    if (existingPlan) {
      throw new PlanCodeAlreadyExistsError(dto.code);
    }

    if (dto.maxComplexes <= 0) {
      throw new InvalidPlanComplexesError();
    }

    if (dto.maxUnits <= 0) {
      throw new InvalidPlanUnitsError();
    }

    if (dto.monthlyPrice < 0) {
      throw new InvalidPlanMonthlyPriceError();
    }

    if (dto.yearlyPrice < 0) {
      throw new InvalidPlanYearlyPriceError();
    }

    if (dto.quarterlyPrice < 0) {
      throw new InvalidPlanQuarterlyPriceError();
    }

    const plan = Plan.create({
      id: this.idGenerator.generate(),
      code: dto.code,
      name: dto.name,
      maxComplexes: dto.maxComplexes,
      maxUnits: dto.maxUnits,
      monthlyPrice: dto.monthlyPrice,
      yearlyPrice: dto.yearlyPrice,
      quarterlyPrice: dto.quarterlyPrice,
      status: 'ACTIVE',
    });

    await this.planRepository.save(plan);

    return plan;
  }
}
