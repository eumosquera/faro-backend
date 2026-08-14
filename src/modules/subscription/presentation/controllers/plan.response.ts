import type { Plan } from '../../domain/entities/plan.entity';

export interface PlanResponse {
  id: string;
  code: string;
  name: string;
  maxComplexes: number;
  maxUnits: number;
  monthlyPrice: number;
  quarterlyPrice: number;
  yearlyPrice: number;
  status: Plan['status'];
}

export function toPlanResponse(plan: Plan): PlanResponse {
  return {
    id: plan.id,
    code: plan.code,
    name: plan.name,
    maxComplexes: plan.maxComplexes,
    maxUnits: plan.maxUnits,
    monthlyPrice: plan.monthlyPrice,
    quarterlyPrice: plan.quarterlyPrice,
    yearlyPrice: plan.yearlyPrice,
    status: plan.status,
  };
}
