import { Plan } from './plan.entity';

describe('Plan', () => {
  it('should create a plan with the provided properties', () => {
    const plan = Plan.create({
      id: 'plan-1',
      code: 'STARTER',
      name: 'Starter',
      maxComplexes: 1,
      maxUnits: 100,
      monthlyPrice: 50000,
      yearlyPrice: 500000,
      status: 'ACTIVE',
    });

    expect(plan.id).toBe('plan-1');
    expect(plan.code).toBe('STARTER');
    expect(plan.name).toBe('Starter');
    expect(plan.maxComplexes).toBe(1);
    expect(plan.maxUnits).toBe(100);
    expect(plan.monthlyPrice).toBe(50000);
    expect(plan.yearlyPrice).toBe(500000);
    expect(plan.status).toBe('ACTIVE');
  });
});
