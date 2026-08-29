import type { Plan, PlanStatus } from '../entities/plan.entity';

export abstract class PlanRepository {
  abstract findById(id: string): Promise<Plan | null>;

  abstract findByCode(code: string): Promise<Plan | null>;

  abstract findAll(status?: PlanStatus): Promise<Plan[]>;

  abstract save(plan: Plan): Promise<void>;
}
