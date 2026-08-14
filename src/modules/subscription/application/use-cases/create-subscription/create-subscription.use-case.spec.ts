import { Person } from '../../../../people/domain/entities/person.entity';
import type { PersonRepository } from '../../../../people/domain/repositories/person.repository';
import { Plan } from '../../../domain/entities/plan.entity';
import type { PlanRepository } from '../../../domain/repositories/plan.repository';
import { Subscription } from '../../../domain/entities/subscription.entity';
import type { SubscriptionRepository } from '../../../domain/repositories/subscription.repository';
import type { IdGenerator } from '../../../../../shared/identity/id-generator';
import { PersonNotFoundError } from '../../errors/person-not-found.error';
import { PlanNotFoundError } from '../../errors/plan-not-found.error';
import { PlanInactiveError } from '../../errors/plan-inactive.error';
import { ActiveSubscriptionAlreadyExistsError } from '../../errors/active-subscription-already-exists.error';
import { CreateSubscriptionUseCase } from './create-subscription.use-case';

describe('CreateSubscriptionUseCase', () => {
  let useCase: CreateSubscriptionUseCase;
  let personRepository: jest.Mocked<PersonRepository>;
  let planRepository: jest.Mocked<PlanRepository>;
  let subscriptionRepository: jest.Mocked<SubscriptionRepository>;
  let idGenerator: jest.Mocked<IdGenerator>;

  let saveSpy: jest.SpiedFunction<SubscriptionRepository['save']>;
  let generateSpy: jest.SpiedFunction<IdGenerator['generate']>;

  const person = Person.create({
    id: 'person-1',
    identificationType: 'CC',
    identificationNumber: '123456789',
    fullName: 'Juan Pérez',
    email: 'juan@example.com',
    phone: null,
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const plan = Plan.create({
    id: 'plan-1',
    code: 'STARTER',
    name: 'Starter',
    maxComplexes: 1,
    maxUnits: 100,
    monthlyPrice: 50000,
    quarterlyPrice: 140000,
    yearlyPrice: 500000,
    status: 'ACTIVE',
  });

  beforeEach(() => {
    personRepository = {
      findById: jest.fn(),
      findByIdentification: jest.fn(),
      save: jest.fn(),
    };

    planRepository = {
      findById: jest.fn(),
      findByCode: jest.fn(),
      save: jest.fn(),
    };

    subscriptionRepository = {
      findById: jest.fn(),
      findActiveByPersonId: jest.fn(),
      save: jest.fn(),
    };

    idGenerator = {
      generate: jest.fn().mockReturnValue('subscription-1'),
    };

    saveSpy = jest.spyOn(subscriptionRepository, 'save');
    generateSpy = jest.spyOn(idGenerator, 'generate');

    useCase = new CreateSubscriptionUseCase(
      personRepository,
      planRepository,
      subscriptionRepository,
      idGenerator,
    );
  });

  it('should create and save a monthly subscription', async () => {
    const startDate = new Date('2026-01-15T00:00:00.000Z');

    personRepository.findById.mockResolvedValue(person);
    planRepository.findById.mockResolvedValue(plan);
    subscriptionRepository.findActiveByPersonId.mockResolvedValue(null);

    const result = await useCase.execute({
      personId: 'person-1',
      planId: 'plan-1',
      billingCycle: 'MONTHLY',
      startDate,
    });

    expect(result).toBeInstanceOf(Subscription);
    expect(result.id).toBe('subscription-1');
    expect(result.personId).toBe('person-1');
    expect(result.planId).toBe('plan-1');
    expect(result.billingCycle).toBe('MONTHLY');
    expect(result.price).toBe(50000);
    expect(result.startDate).toEqual(startDate);
    expect(result.endDate).toBeNull();
    expect(result.nextBillingDate).toEqual(new Date('2026-02-15T00:00:00.000Z'));
    expect(result.status).toBe('ACTIVE');

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(generateSpy).toHaveBeenCalledTimes(1);
  });

  it('should create a quarterly subscription using the quarterly plan price', async () => {
    const startDate = new Date('2026-01-15T00:00:00.000Z');

    personRepository.findById.mockResolvedValue(person);
    planRepository.findById.mockResolvedValue(plan);
    subscriptionRepository.findActiveByPersonId.mockResolvedValue(null);

    const result = await useCase.execute({
      personId: 'person-1',
      planId: 'plan-1',
      billingCycle: 'QUARTERLY',
      startDate,
    });

    expect(result.price).toBe(140000);
    expect(result.nextBillingDate).toEqual(new Date('2026-04-15T00:00:00.000Z'));
    expect(result.billingCycle).toBe('QUARTERLY');
  });

  it('should create a yearly subscription using the yearly plan price', async () => {
    const startDate = new Date('2026-01-15T00:00:00.000Z');

    personRepository.findById.mockResolvedValue(person);
    planRepository.findById.mockResolvedValue(plan);
    subscriptionRepository.findActiveByPersonId.mockResolvedValue(null);

    const result = await useCase.execute({
      personId: 'person-1',
      planId: 'plan-1',
      billingCycle: 'YEARLY',
      startDate,
    });

    expect(result.price).toBe(500000);
    expect(result.nextBillingDate).toEqual(new Date('2027-01-15T00:00:00.000Z'));
    expect(result.billingCycle).toBe('YEARLY');
  });

  it('should throw when the person does not exist', async () => {
    personRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        personId: 'person-1',
        planId: 'plan-1',
        billingCycle: 'MONTHLY',
        startDate: new Date('2026-01-15T00:00:00.000Z'),
      }),
    ).rejects.toBeInstanceOf(PersonNotFoundError);

    expect(saveSpy).not.toHaveBeenCalled();
    expect(generateSpy).not.toHaveBeenCalled();
  });

  it('should throw when the plan does not exist', async () => {
    personRepository.findById.mockResolvedValue(person);
    planRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        personId: 'person-1',
        planId: 'plan-1',
        billingCycle: 'MONTHLY',
        startDate: new Date('2026-01-15T00:00:00.000Z'),
      }),
    ).rejects.toBeInstanceOf(PlanNotFoundError);

    expect(saveSpy).not.toHaveBeenCalled();
    expect(generateSpy).not.toHaveBeenCalled();
  });

  it('should throw when the plan is inactive', async () => {
    const inactivePlan = Plan.create({
      id: 'plan-1',
      code: 'STARTER',
      name: 'Starter',
      maxComplexes: 1,
      maxUnits: 100,
      monthlyPrice: 50000,
      quarterlyPrice: 140000,
      yearlyPrice: 500000,
      status: 'INACTIVE',
    });

    personRepository.findById.mockResolvedValue(person);
    planRepository.findById.mockResolvedValue(inactivePlan);

    await expect(
      useCase.execute({
        personId: 'person-1',
        planId: 'plan-1',
        billingCycle: 'MONTHLY',
        startDate: new Date('2026-01-15T00:00:00.000Z'),
      }),
    ).rejects.toBeInstanceOf(PlanInactiveError);

    expect(saveSpy).not.toHaveBeenCalled();
    expect(generateSpy).not.toHaveBeenCalled();
  });

  it('should throw when the person already has an active subscription', async () => {
    const activeSubscription = Subscription.create({
      id: 'existing-subscription',
      personId: 'person-1',
      planId: 'plan-1',
      billingCycle: 'MONTHLY',
      price: 50000,
      startDate: new Date('2025-01-15T00:00:00.000Z'),
      endDate: null,
      nextBillingDate: new Date('2025-02-15T00:00:00.000Z'),
      status: 'ACTIVE',
    });

    personRepository.findById.mockResolvedValue(person);
    planRepository.findById.mockResolvedValue(plan);
    subscriptionRepository.findActiveByPersonId.mockResolvedValue(activeSubscription);

    await expect(
      useCase.execute({
        personId: 'person-1',
        planId: 'plan-1',
        billingCycle: 'MONTHLY',
        startDate: new Date('2026-01-15T00:00:00.000Z'),
      }),
    ).rejects.toBeInstanceOf(ActiveSubscriptionAlreadyExistsError);

    expect(saveSpy).not.toHaveBeenCalled();
    expect(generateSpy).not.toHaveBeenCalled();
  });

  it('should freeze the plan price in the subscription', async () => {
    const startDate = new Date('2026-01-15T00:00:00.000Z');

    personRepository.findById.mockResolvedValue(person);
    planRepository.findById.mockResolvedValue(plan);
    subscriptionRepository.findActiveByPersonId.mockResolvedValue(null);

    const result = await useCase.execute({
      personId: 'person-1',
      planId: 'plan-1',
      billingCycle: 'MONTHLY',
      startDate,
    });

    expect(result.price).toBe(plan.monthlyPrice);
    expect(result.price).toBe(50000);

    const savedSubscription = saveSpy.mock.calls[0][0];

    expect(savedSubscription.price).toBe(50000);
  });
});
