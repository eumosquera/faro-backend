import { RolePersona } from './role-persona.entity';

describe('RolePersona', () => {
  it('should create a role persona with the provided properties', () => {
    const createdAt = new Date('2026-08-14T00:00:00.000Z');
    const updatedAt = new Date('2026-08-14T00:00:00.000Z');

    const rolePersona = RolePersona.create({
      id: 'role-persona-1',
      code: 'PROPIETARIO',
      name: 'Propietario',
      description: 'Persona titular de una unidad privada.',
      status: 'ACTIVE',
      createdAt,
      updatedAt,
    });

    expect(rolePersona.id).toBe('role-persona-1');
    expect(rolePersona.code).toBe('PROPIETARIO');
    expect(rolePersona.name).toBe('Propietario');
    expect(rolePersona.description).toBe('Persona titular de una unidad privada.');
    expect(rolePersona.status).toBe('ACTIVE');
    expect(rolePersona.createdAt).toBe(createdAt);
    expect(rolePersona.updatedAt).toBe(updatedAt);
  });

  it('should create an inactive role persona', () => {
    const rolePersona = RolePersona.create({
      id: 'role-persona-2',
      code: 'ARRENDATARIO',
      name: 'Arrendatario',
      description: 'Persona que ocupa una unidad privada mediante arrendamiento.',
      status: 'INACTIVE',
      createdAt: new Date('2025-01-10T00:00:00.000Z'),
      updatedAt: new Date('2026-08-14T00:00:00.000Z'),
    });

    expect(rolePersona.status).toBe('INACTIVE');
  });
});
