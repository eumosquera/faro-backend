import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { CreatePlanUseCase } from '../../application/use-cases/create-plan/create-plan.use-case';
import { ListPlansUseCase } from '../../application/use-cases/list-plans/list-plans.use-case';
import { CreatePlanRequest } from './create-plan.request';
import { ListPlansQuery } from '../../application/use-cases/list-plans/list-plans.query';
import { PlanResponse, toPlanResponse } from './plan.response';

@Controller('plans')
export class PlanController {
  constructor(
    private readonly createPlanUseCase: CreatePlanUseCase,
    private readonly listPlansUseCase: ListPlansUseCase,
  ) {}

  @Get()
  async findAll(@Query() query: ListPlansQuery): Promise<PlanResponse[]> {
    const plans = await this.listPlansUseCase.execute({
      onlyActive: !query.includeInactive,
    });

    return plans.map(toPlanResponse);
  }

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
