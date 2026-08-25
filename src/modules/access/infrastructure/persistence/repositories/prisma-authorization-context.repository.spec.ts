import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../../app.module';
import { PrismaService } from '../../../../../core/database/prisma.service';
import { PrismaAuthorizationContextRepository } from './prisma-authorization-context.repository';

describe('PrismaAuthorizationContextRepository', () => {
  let repository: PrismaAuthorizationContextRepository;
  let prisma: PrismaService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = module.get(PrismaService);

    repository = new PrismaAuthorizationContextRepository(prisma);
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    await prisma.subscription.deleteMany();
    await prisma.personUnit.deleteMany();
    await prisma.accessRolePermission.deleteMany();

    // 2. Membership depende de Person, ResidentialComplex,
    await prisma.membership.deleteMany();

    // 3. Entidades hijas del ResidentialComplex
    await prisma.privateUnit.deleteMany();
    await prisma.physicalGroup.deleteMany();

    // 4. Entidades que ya no tienen Membership / relaciones
    await prisma.accessAccount.deleteMany();
    await prisma.rolePersona.deleteMany();
    await prisma.plan.deleteMany();
    await prisma.accessRole.deleteMany();
    await prisma.permission.deleteMany();

    // 5. Padre
    await prisma.residentialComplex.deleteMany();
    await prisma.person.deleteMany();
  });

  it('should return the authorization context for an active membership', async () => {
    const person = await prisma.person.create({
      data: {
        identificationType: 'CC',
        identificationNumber: '10009887001',
        fullName: 'Administrador Test',
        email: 'admin@test.com',
        status: 'ACTIVE',
      },
    });

    const residentialComplex = await prisma.residentialComplex.create({
      data: {
        name: 'Conjunto Test',
        address: 'Carrera 1 # 1-1',
        city: 'Cali',
        status: 'ACTIVE',
      },
    });

    const accessRole = await prisma.accessRole.create({
      data: {
        code: 'ADMIN_TEST',
        name: 'Administrador Test',
        description: 'Rol utilizado en pruebas.',
        status: 'ACTIVE',
      },
    });

    const permission = await prisma.permission.create({
      data: {
        code: 'RESIDENT_UPDATE',
        name: 'Actualizar residentes',
        description: 'Permite actualizar residentes.',
        status: 'ACTIVE',
      },
    });

    await prisma.accessRolePermission.create({
      data: {
        accessRoleId: accessRole.id,
        permissionId: permission.id,
      },
    });

    const membership = await prisma.membership.create({
      data: {
        personId: person.id,
        residentialComplexId: residentialComplex.id,
        accessRoleId: accessRole.id,
        status: 'ACTIVE',
        startDate: new Date(),
      },
    });

    const result = await repository.findContext(person.id, residentialComplex.id);

    expect(result).toEqual({
      personId: person.id,
      residentialComplexId: residentialComplex.id,
      membershipId: membership.id,
      roleId: accessRole.id,
      permissions: ['RESIDENT_UPDATE'],
    });
  });
});
