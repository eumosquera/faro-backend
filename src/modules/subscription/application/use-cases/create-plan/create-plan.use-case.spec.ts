import { Plan } from '../../../domain/entities/plan.entity';
import type { PlanRepository } from '../../../domain/repositories/plan.repository';
import { InvalidPlanComplexesError } from '../../errors/invalid-plan-complexes.error';
import { InvalidPlanUnitsError } from '../../errors/invalid-plan-units.error';
import { PlanCodeAlreadyExistsError } from '../../errors/plan-code-already-exists.error';
import type { IdGenerator } from '../../../../../shared/identity/id-generator';
import { CreatePlanUseCase } from './create-plan.use-case';
import { InvalidPlanMonthlyPriceError } from '../../errors/invalid-plan-monthly-price.error';
import { InvalidPlanYearlyPriceError } from '../../errors/invalid-plan-yearly-price.error';

describe('CreatePlanUseCase', () => {
  let useCase: CreatePlanUseCase;
  let planRepository: jest.Mocked<PlanRepository>;
  let idGenerator: jest.Mocked<IdGenerator>;

  let saveSpy: jest.SpiedFunction<PlanRepository['save']>;
  let generateSpy: jest.SpiedFunction<IdGenerator['generate']>;

  beforeEach(() => {
    planRepository = {
      findById: jest.fn(),
      findByCode: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
    };

    idGenerator = {
      generate: jest.fn().mockReturnValue('plan-1'),
    };

    saveSpy = jest.spyOn(planRepository, 'save');
    generateSpy = jest.spyOn(idGenerator, 'generate');

    useCase = new CreatePlanUseCase(planRepository, idGenerator);
  });

  it('should create and save a plan', async () => {
    planRepository.findByCode.mockResolvedValue(null);

    const result = await useCase.execute({
      code: 'STARTER',
      name: 'Starter',
      maxComplexes: 1,
      maxUnits: 100,
      monthlyPrice: 50000,
      yearlyPrice: 500000,
      quarterlyPrice: 150000,
    });

    expect(result).toBeInstanceOf(Plan);
    expect(result.id).toBe('plan-1');
    expect(result.code).toBe('STARTER');
    expect(result.name).toBe('Starter');
    expect(result.maxComplexes).toBe(1);
    expect(result.maxUnits).toBe(100);
    expect(result.monthlyPrice).toBe(50000);
    expect(result.yearlyPrice).toBe(500000);
    expect(result.quarterlyPrice).toBe(150000);
    expect(result.status).toBe('ACTIVE');

    const generateSpy = jest.spyOn(idGenerator, 'generate');
    expect(generateSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw when the plan code already exists', async () => {
    const existingPlan = Plan.create({
      id: 'existing-plan',
      code: 'STARTER',
      name: 'Starter',
      maxComplexes: 1,
      maxUnits: 100,
      monthlyPrice: 50000,
      yearlyPrice: 500000,
      quarterlyPrice: 150000,
      status: 'ACTIVE',
    });

    planRepository.findByCode.mockResolvedValue(existingPlan);

    await expect(
      useCase.execute({
        code: 'STARTER',
        name: 'Another Starter',
        maxComplexes: 1,
        maxUnits: 100,
        monthlyPrice: 50000,
        yearlyPrice: 500000,
        quarterlyPrice: 150000,
      }),
    ).rejects.toBeInstanceOf(PlanCodeAlreadyExistsError);

    const generateSpy = jest.spyOn(idGenerator, 'generate');
    expect(generateSpy).not.toHaveBeenCalled();
  });

  it('should throw when maxComplexes is zero', async () => {
    planRepository.findByCode.mockResolvedValue(null);

    await expect(
      useCase.execute({
        code: 'STARTER',
        name: 'Starter',
        maxComplexes: 0,
        maxUnits: 100,
        monthlyPrice: 50000,
        yearlyPrice: 500000,
        quarterlyPrice: 150000,
      }),
    ).rejects.toBeInstanceOf(InvalidPlanComplexesError);

    const generateSpy = jest.spyOn(idGenerator, 'generate');
    expect(generateSpy).not.toHaveBeenCalled();
  });
  it('should throw when maxComplexes is negative', async () => {
    planRepository.findByCode.mockResolvedValue(null);

    await expect(
      useCase.execute({
        code: 'STARTER',
        name: 'Starter',
        maxComplexes: -1,
        maxUnits: 100,
        monthlyPrice: 50000,
        yearlyPrice: 500000,
        quarterlyPrice: 150000,
      }),
    ).rejects.toBeInstanceOf(InvalidPlanComplexesError);

    const generateSpy = jest.spyOn(idGenerator, 'generate');
    expect(generateSpy).not.toHaveBeenCalled();
  });

  it('should throw when maxUnits is zero', async () => {
    planRepository.findByCode.mockResolvedValue(null);

    await expect(
      useCase.execute({
        code: 'STARTER',
        name: 'Starter',
        maxComplexes: 1,
        maxUnits: 0,
        monthlyPrice: 50000,
        yearlyPrice: 500000,
        quarterlyPrice: 150000,
      }),
    ).rejects.toBeInstanceOf(InvalidPlanUnitsError);

    const generateSpy = jest.spyOn(idGenerator, 'generate');
    expect(generateSpy).not.toHaveBeenCalled();
  });

  it('should throw when maxUnits is negative', async () => {
    planRepository.findByCode.mockResolvedValue(null);

    await expect(
      useCase.execute({
        code: 'STARTER',
        name: 'Starter',
        maxComplexes: 1,
        maxUnits: -1,
        monthlyPrice: 50000,
        yearlyPrice: 500000,
        quarterlyPrice: 150000,
      }),
    ).rejects.toBeInstanceOf(InvalidPlanUnitsError);

    const generateSpy = jest.spyOn(idGenerator, 'generate');
    expect(generateSpy).not.toHaveBeenCalled();
  });

  it('should throw when monthlyPrice is negative', async () => {
    planRepository.findByCode.mockResolvedValue(null);

    await expect(
      useCase.execute({
        code: 'STARTER',
        name: 'Starter',
        maxComplexes: 1,
        maxUnits: 100,
        monthlyPrice: -1,
        yearlyPrice: 500000,
        quarterlyPrice: 150000,
      }),
    ).rejects.toBeInstanceOf(InvalidPlanMonthlyPriceError);

    expect(saveSpy).not.toHaveBeenCalled();
    expect(generateSpy).not.toHaveBeenCalled();
  });

  it('should throw when yearlyPrice is negative', async () => {
    planRepository.findByCode.mockResolvedValue(null);

    await expect(
      useCase.execute({
        code: 'STARTER',
        name: 'Starter',
        maxComplexes: 1,
        maxUnits: 100,
        monthlyPrice: 50000,
        quarterlyPrice: 150000,
        yearlyPrice: -1,
      }),
    ).rejects.toBeInstanceOf(InvalidPlanYearlyPriceError);

    expect(saveSpy).not.toHaveBeenCalled();
    expect(generateSpy).not.toHaveBeenCalled();
  });
});
