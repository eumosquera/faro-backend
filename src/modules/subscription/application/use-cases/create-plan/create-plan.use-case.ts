import { Plan } from '../../../domain/entities/plan.entity';
import type { PlanRepository } from '../../../domain/repositories/plan.repository';
import { PlanCodeAlreadyExistsError } from '../../errors/plan-code-already-exists.error';
import type { CreatePlanDto } from './create-plan.dto';
import type { IdGenerator } from '../../../../../shared/identity/id-generator';

import { InvalidPlanComplexesError } from '../../errors/invalid-plan-complexes.error';
import { InvalidPlanMonthlyPriceError } from '../../errors/invalid-plan-monthly-price.error';
import { InvalidPlanUnitsError } from '../../errors/invalid-plan-units.error';
import { InvalidPlanYearlyPriceError } from '../../errors/invalid-plan-yearly-price.error';

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

    const plan = Plan.create({
      id: this.idGenerator.generate(),
      code: dto.code,
      name: dto.name,
      maxComplexes: dto.maxComplexes,
      maxUnits: dto.maxUnits,
      monthlyPrice: dto.monthlyPrice,
      yearlyPrice: dto.yearlyPrice,
      status: 'ACTIVE',
    });

    await this.planRepository.save(plan);

    return plan;
  }
}
