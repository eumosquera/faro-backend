import { PersonAlreadyExistsError } from '../../errors/person-already-exists.error';
import { PersonContactRequiredError } from '../../errors/person-contact-required.error';
import type { PersonRepository } from '../../../domain/repositories/person.repository';
import type { IdGenerator } from '../../../../../shared/identity/id-generator';
import { CreatePersonUseCase } from './create-person.use-case';
import { Person } from '../../../domain/entities/person.entity';

describe('CreatePersonUseCase', () => {
  let personRepository: jest.Mocked<PersonRepository>;
  let idGenerator: jest.Mocked<IdGenerator>;
  let useCase: CreatePersonUseCase;

  let saveSpy: jest.SpiedFunction<PersonRepository['save']>;
  let generateSpy: jest.SpiedFunction<IdGenerator['generate']>;
  let findByIdentificationSpy: jest.SpiedFunction<PersonRepository['findByIdentification']>;

  beforeEach(() => {
    personRepository = {
      findById: jest.fn(),
      findByIdentification: jest.fn(),
      save: jest.fn(),
    };

    idGenerator = {
      generate: jest.fn().mockReturnValue('person-1'),
    };

    saveSpy = jest.spyOn(personRepository, 'save');
    generateSpy = jest.spyOn(idGenerator, 'generate');
    findByIdentificationSpy = jest.spyOn(personRepository, 'findByIdentification');

    useCase = new CreatePersonUseCase(personRepository, idGenerator);
  });

  it('should create and save a person with email and phone', async () => {
    personRepository.findByIdentification.mockResolvedValue(null);

    const result = await useCase.execute({
      identificationType: 'CC',
      identificationNumber: '123456789',
      fullName: 'Juan Carlos Pérez Gómez',
      email: 'juan@example.com',
      phone: '3001234567',
    });

    expect(result.id).toBe('person-1');
    expect(result.identificationType).toBe('CC');
    expect(result.identificationNumber).toBe('123456789');
    expect(result.fullName).toBe('Juan Carlos Pérez Gómez');
    expect(result.email).toBe('juan@example.com');
    expect(result.phone).toBe('3001234567');
    expect(result.status).toBe('ACTIVE');

    expect(generateSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(result);
  });

  it('should create a person with email and without phone', async () => {
    personRepository.findByIdentification.mockResolvedValue(null);

    const result = await useCase.execute({
      identificationType: 'CC',
      identificationNumber: '123456789',
      fullName: 'María Pérez',
      email: 'maria@example.com',
    });

    expect(result.email).toBe('maria@example.com');
    expect(result.phone).toBeNull();
    expect(result.status).toBe('ACTIVE');
  });

  it('should create a person with phone and without email', async () => {
    personRepository.findByIdentification.mockResolvedValue(null);

    const result = await useCase.execute({
      identificationType: 'CC',
      identificationNumber: '987654321',
      fullName: 'Pedro Gómez',
      phone: '3009876543',
    });

    expect(result.email).toBeNull();
    expect(result.phone).toBe('3009876543');
    expect(result.status).toBe('ACTIVE');
  });

  it('should throw when the person identification already exists', async () => {
    const existingPerson = Person.create({
      id: 'existing-person',
      identificationType: 'CC',
      identificationNumber: '123456789',
      fullName: 'Existing Person',
      email: 'existing@example.com',
      phone: null,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    personRepository.findByIdentification.mockResolvedValue(existingPerson);

    await expect(
      useCase.execute({
        identificationType: 'CC',
        identificationNumber: '123456789',
        fullName: 'Juan Carlos Pérez Gómez',
        email: 'juan@example.com',
      }),
    ).rejects.toBeInstanceOf(PersonAlreadyExistsError);

    expect(generateSpy).not.toHaveBeenCalled();
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('should throw when email and phone are missing', async () => {
    personRepository.findByIdentification.mockResolvedValue(null);

    await expect(
      useCase.execute({
        identificationType: 'CC',
        identificationNumber: '123456789',
        fullName: 'Juan Carlos Pérez Gómez',
      }),
    ).rejects.toBeInstanceOf(PersonContactRequiredError);

    expect(generateSpy).not.toHaveBeenCalled();
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('should use the identification type and number to check for duplicates', async () => {
    personRepository.findByIdentification.mockResolvedValue(null);

    await useCase.execute({
      identificationType: 'CE',
      identificationNumber: '987654321',
      fullName: 'Carlos Rodríguez',
      phone: '3001234567',
    });

    expect(findByIdentificationSpy).toHaveBeenCalledWith('CE', '987654321');
  });

  it('should generate the person id before saving', async () => {
    personRepository.findByIdentification.mockResolvedValue(null);

    await useCase.execute({
      identificationType: 'CC',
      identificationNumber: '123456789',
      fullName: 'Ana Pérez',
      email: 'ana@example.com',
    });

    expect(generateSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });

  it('should persist the person with null for the missing contact field', async () => {
    personRepository.findByIdentification.mockResolvedValue(null);

    const result = await useCase.execute({
      identificationType: 'CC',
      identificationNumber: '123456789',
      fullName: 'Luis Gómez',
      phone: '3001112233',
    });

    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        email: null,
        phone: '3001112233',
      }),
    );

    expect(result.email).toBeNull();
  });
});
