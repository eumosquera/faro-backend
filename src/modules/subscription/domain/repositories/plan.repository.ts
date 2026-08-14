import type { Plan } from '../entities/plan.entity';

export abstract class PlanRepository {
  abstract findById(id: string): Promise<Plan | null>;

  abstract findByCode(code: string): Promise<Plan | null>;

  abstract save(plan: Plan): Promise<void>;
}
