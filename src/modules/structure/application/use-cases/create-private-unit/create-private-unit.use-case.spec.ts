import { CreatePrivateUnitUseCase } from './create-private-unit.use-case';

import type { PhysicalGroup } from '../../../domain/entities/physical-group.entity';
import type { PhysicalGroupRepository } from '../../../domain/repositories/physical-group.repository';
import type { PrivateUnitRepository } from '../../../domain/repositories/private-unit.repository';
import type { ResidentialComplex } from '../../../domain/entities/residential-complex.entity';
import type { ResidentialComplexRepository } from '../../../domain/repositories/residential-complex.repository';
import type { IdGenerator } from '../../../../../shared/identity/id-generator';

describe('CreatePrivateUnitUseCase', () => {
  let useCase: CreatePrivateUnitUseCase;

  let privateUnitRepository: jest.Mocked<PrivateUnitRepository>;
  let residentialComplexRepository: jest.Mocked<ResidentialComplexRepository>;
  let physicalGroupRepository: jest.Mocked<PhysicalGroupRepository>;
  let idGenerator: jest.Mocked<IdGenerator>;

  let privateUnitSave: jest.Mock;
  let residentialComplexFindById: jest.Mock;
  let physicalGroupFindById: jest.Mock;

  const residentialComplex = {
    id: 'complex-1',
  } as ResidentialComplex;

  const physicalGroup = {
    id: 'group-1',
    residentialComplexId: 'complex-1',
  } as PhysicalGroup;

  beforeEach(() => {
    privateUnitSave = jest.fn();
    residentialComplexFindById = jest.fn();
    physicalGroupFindById = jest.fn();

    privateUnitRepository = {
      findById: jest.fn(),
      save: privateUnitSave,
    };

    residentialComplexRepository = {
      findById: residentialComplexFindById,
      save: jest.fn(),
    };

    physicalGroupRepository = {
      findById: physicalGroupFindById,
      save: jest.fn(),
    };

    idGenerator = {
      generate: jest.fn().mockReturnValue('unit-1'),
    };

    useCase = new CreatePrivateUnitUseCase(
      privateUnitRepository,
      residentialComplexRepository,
      physicalGroupRepository,
      idGenerator,
    );
  });

  it('creates a private unit without a physical group', async () => {
    residentialComplexFindById.mockResolvedValue(residentialComplex);
    privateUnitSave.mockResolvedValue(undefined);

    const result = await useCase.execute({
      residentialComplexId: 'complex-1',
      identifier: '101',
      type: 'APARTMENT',
    });

    expect(result.id).toBe('unit-1');
    expect(result.residentialComplexId).toBe('complex-1');
    expect(result.physicalGroupId).toBeNull();
    expect(result.identifier).toBe('101');
    expect(result.type).toBe('APARTMENT');
    expect(result.status).toBe('ACTIVE');

    expect(privateUnitSave).toHaveBeenCalledTimes(1);
  });

  it('creates a private unit with a physical group', async () => {
    residentialComplexFindById.mockResolvedValue(residentialComplex);
    physicalGroupFindById.mockResolvedValue(physicalGroup);
    privateUnitSave.mockResolvedValue(undefined);

    const result = await useCase.execute({
      residentialComplexId: 'complex-1',
      physicalGroupId: 'group-1',
      identifier: '401',
      type: 'APARTMENT',
    });

    expect(result.physicalGroupId).toBe('group-1');

    expect(physicalGroupFindById).toHaveBeenCalledWith('group-1');
    expect(privateUnitSave).toHaveBeenCalledTimes(1);
  });

  it('throws when the residential complex does not exist', async () => {
    residentialComplexFindById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        residentialComplexId: 'complex-1',
        identifier: '101',
        type: 'APARTMENT',
      }),
    ).rejects.toMatchObject({
      code: 'RESIDENTIAL_COMPLEX_NOT_FOUND',
      statusCode: 404,
    });

    expect(privateUnitSave).not.toHaveBeenCalled();
  });

  it('throws when the physical group does not exist', async () => {
    residentialComplexFindById.mockResolvedValue(residentialComplex);
    physicalGroupFindById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        residentialComplexId: 'complex-1',
        physicalGroupId: 'group-1',
        identifier: '101',
        type: 'APARTMENT',
      }),
    ).rejects.toMatchObject({
      code: 'PHYSICAL_GROUP_NOT_FOUND',
      statusCode: 404,
    });

    expect(privateUnitSave).not.toHaveBeenCalled();
  });

  it('throws when the physical group belongs to another residential complex', async () => {
    residentialComplexFindById.mockResolvedValue(residentialComplex);

    physicalGroupFindById.mockResolvedValue({
      id: 'group-1',
      residentialComplexId: 'complex-2',
    });

    await expect(
      useCase.execute({
        residentialComplexId: 'complex-1',
        physicalGroupId: 'group-1',
        identifier: '101',
        type: 'APARTMENT',
      }),
    ).rejects.toMatchObject({
      code: 'PHYSICAL_GROUP_RESIDENTIAL_COMPLEX_MISMATCH',
      statusCode: 400,
    });

    expect(privateUnitSave).not.toHaveBeenCalled();
  });
});
