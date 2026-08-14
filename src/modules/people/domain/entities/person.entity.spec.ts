import { Person } from './person.entity';

describe('Person', () => {
  it('should create a person with the provided properties', () => {
    const createdAt = new Date('2026-08-14T00:00:00.000Z');
    const updatedAt = new Date('2026-08-14T00:00:00.000Z');

    const person = Person.create({
      id: 'person-1',
      identificationType: 'CC',
      identificationNumber: '123456789',
      fullName: 'Juan Carlos Pérez Gómez',
      email: 'juan@example.com',
      phone: '3001234567',
      status: 'ACTIVE',
      createdAt,
      updatedAt,
    });

    expect(person.id).toBe('person-1');
    expect(person.identificationType).toBe('CC');
    expect(person.identificationNumber).toBe('123456789');
    expect(person.fullName).toBe('Juan Carlos Pérez Gómez');
    expect(person.email).toBe('juan@example.com');
    expect(person.phone).toBe('3001234567');
    expect(person.status).toBe('ACTIVE');
    expect(person.createdAt).toBe(createdAt);
    expect(person.updatedAt).toBe(updatedAt);
  });

  it.each(['CC', 'TI', 'CE', 'PA', 'NIT', 'PPT', 'PEP'] as const)(
    'should create a person with identification type %s',
    (identificationType) => {
      const person = Person.create({
        id: 'person-1',
        identificationType,
        identificationNumber: '123456789',
        fullName: 'Juan Carlos Pérez Gómez',
        email: 'juan@example.com',
        phone: '3001234567',
        status: 'ACTIVE',
        createdAt: new Date('2026-08-14T00:00:00.000Z'),
        updatedAt: new Date('2026-08-14T00:00:00.000Z'),
      });

      expect(person.identificationType).toBe(identificationType);
    },
  );

  it('should create a person with email and without phone', () => {
    const person = Person.create({
      id: 'person-2',
      identificationType: 'CC',
      identificationNumber: '123456789',
      fullName: 'María Pérez',
      email: 'maria@example.com',
      phone: null,
      status: 'ACTIVE',
      createdAt: new Date('2026-08-14T00:00:00.000Z'),
      updatedAt: new Date('2026-08-14T00:00:00.000Z'),
    });

    expect(person.email).toBe('maria@example.com');
    expect(person.phone).toBeNull();
  });

  it('should create a person with phone and without email', () => {
    const person = Person.create({
      id: 'person-3',
      identificationType: 'CC',
      identificationNumber: '987654321',
      fullName: 'Pedro Gómez',
      email: null,
      phone: '3009876543',
      status: 'ACTIVE',
      createdAt: new Date('2026-08-14T00:00:00.000Z'),
      updatedAt: new Date('2026-08-14T00:00:00.000Z'),
    });

    expect(person.email).toBeNull();
    expect(person.phone).toBe('3009876543');
  });

  it('should create an inactive person', () => {
    const person = Person.create({
      id: 'person-4',
      identificationType: 'CC',
      identificationNumber: '456789123',
      fullName: 'Carlos Rodríguez',
      email: 'carlos@example.com',
      phone: null,
      status: 'INACTIVE',
      createdAt: new Date('2025-01-10T00:00:00.000Z'),
      updatedAt: new Date('2026-08-14T00:00:00.000Z'),
    });

    expect(person.status).toBe('INACTIVE');
  });
});
