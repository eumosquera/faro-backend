import { AccessRole } from './access-role.entity';

describe('AccessRole', () => {
  it('should create an access role with the provided properties', () => {
    const createdAt = new Date('2026-08-15T00:00:00.000Z');
    const updatedAt = new Date('2026-08-15T00:00:00.000Z');

    const accessRole = AccessRole.create({
      id: 'access-role-1',
      code: 'PORTERO',
      name: 'Portero',
      description: 'Rol de acceso para usuarios responsables de la operación de portería.',
      status: 'ACTIVE',
      createdAt,
      updatedAt,
    });

    expect(accessRole.id).toBe('access-role-1');
    expect(accessRole.code).toBe('PORTERO');
    expect(accessRole.name).toBe('Portero');
    expect(accessRole.description).toBe(
      'Rol de acceso para usuarios responsables de la operación de portería.',
    );
    expect(accessRole.status).toBe('ACTIVE');
    expect(accessRole.createdAt).toBe(createdAt);
    expect(accessRole.updatedAt).toBe(updatedAt);
  });

  it('should create an inactive access role', () => {
    const accessRole = AccessRole.create({
      id: 'access-role-2',
      code: 'CONSULTA',
      name: 'Consulta',
      description: 'Rol de acceso limitado a funcionalidades de consulta.',
      status: 'INACTIVE',
      createdAt: new Date('2025-01-10T00:00:00.000Z'),
      updatedAt: new Date('2026-08-15T00:00:00.000Z'),
    });

    expect(accessRole.status).toBe('INACTIVE');
  });
});
