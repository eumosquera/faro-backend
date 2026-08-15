import { PersonUnit } from './person-unit.entity';

describe('PersonUnit', () => {
  it('should create an active person-unit relationship', () => {
    const startDate = new Date('2024-01-15T00:00:00.000Z');

    const personUnit = PersonUnit.create({
      id: 'person-unit-1',
      personId: 'person-1',
      privateUnitId: 'private-unit-401',
      rolePersonaId: 'role-propietario',
      startDate,
      endDate: null,
      status: 'ACTIVE',
      observations: null,
    });

    expect(personUnit.id).toBe('person-unit-1');
    expect(personUnit.personId).toBe('person-1');
    expect(personUnit.privateUnitId).toBe('private-unit-401');
    expect(personUnit.rolePersonaId).toBe('role-propietario');
    expect(personUnit.startDate).toBe(startDate);
    expect(personUnit.endDate).toBeNull();
    expect(personUnit.status).toBe('ACTIVE');
    expect(personUnit.observations).toBeNull();
  });

  it('should create a finished person-unit relationship', () => {
    const startDate = new Date('2022-01-01T00:00:00.000Z');
    const endDate = new Date('2024-12-31T00:00:00.000Z');

    const personUnit = PersonUnit.create({
      id: 'person-unit-2',
      personId: 'person-2',
      privateUnitId: 'private-unit-401',
      rolePersonaId: 'role-arrendatario',
      startDate,
      endDate,
      status: 'FINISHED',
      observations: 'Contrato de arrendamiento finalizado.',
    });

    expect(personUnit.status).toBe('FINISHED');
    expect(personUnit.startDate).toBe(startDate);
    expect(personUnit.endDate).toBe(endDate);
    expect(personUnit.observations).toBe('Contrato de arrendamiento finalizado.');
  });
});
