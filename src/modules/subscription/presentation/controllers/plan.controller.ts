import { Body, Controller, Post } from '@nestjs/common';

import { CreatePlanUseCase } from '../../application/use-cases/create-plan/create-plan.use-case';
import { CreatePlanRequest } from './create-plan.request';
import { PlanResponse, toPlanResponse } from './plan.response';

@Controller('plans')
export class PlanController {
  constructor(private readonly createPlanUseCase: CreatePlanUseCase) {}

  @Post()
  async create(@Body() request: CreatePlanRequest): Promise<PlanResponse> {
    const plan = await this.createPlanUseCase.execute({
      code: request.code,
      name: request.name,
      maxComplexes: request.maxComplexes,
      maxUnits: request.maxUnits,
      monthlyPrice: request.monthlyPrice,
      quarterlyPrice: request.quarterlyPrice,
      yearlyPrice: request.yearlyPrice,
    });

    return toPlanResponse(plan);
  }
}
