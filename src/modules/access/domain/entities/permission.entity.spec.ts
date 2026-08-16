import { Permission } from './permission.entity';

describe('Permission', () => {
  it('should create a permission with the provided properties', () => {
    const createdAt = new Date('2026-08-15T00:00:00.000Z');
    const updatedAt = new Date('2026-08-15T00:00:00.000Z');

    const permission = Permission.create({
      id: 'permission-1',
      code: 'VIEW_ACCESS_LOGS',
      name: 'Ver registros de acceso',
      description:
        'Permite consultar los registros históricos de entrada y salida de la copropiedad.',
      status: 'ACTIVE',
      createdAt,
      updatedAt,
    });

    expect(permission.id).toBe('permission-1');
    expect(permission.code).toBe('VIEW_ACCESS_LOGS');
    expect(permission.name).toBe('Ver registros de acceso');
    expect(permission.description).toBe(
      'Permite consultar los registros históricos de entrada y salida de la copropiedad.',
    );
    expect(permission.status).toBe('ACTIVE');
    expect(permission.createdAt).toBe(createdAt);
    expect(permission.updatedAt).toBe(updatedAt);
  });

  it('should create an inactive permission', () => {
    const permission = Permission.create({
      id: 'permission-2',
      code: 'VIEW_ACCESS_LOGS',
      name: 'Ver registros de acceso',
      description:
        'Permite consultar los registros históricos de entrada y salida de la copropiedad.',
      status: 'INACTIVE',
      createdAt: new Date('2025-01-10T00:00:00.000Z'),
      updatedAt: new Date('2026-08-15T00:00:00.000Z'),
    });

    expect(permission.status).toBe('INACTIVE');
  });
});
