import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';

import { AppModule } from '../../../../../app.module';
import { PrismaService } from '../../../../../core/database/prisma.service';
import { PrismaAuthenticatedUserRepository } from './prisma-authenticated-user.repository';

describe('PrismaAuthenticatedUserRepository', () => {
  let module: TestingModule;
  let prisma: PrismaService;
  let repository: PrismaAuthenticatedUserRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = module.get(PrismaService);

    repository = new PrismaAuthenticatedUserRepository(prisma);
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    await prisma.subscription.deleteMany();
    await prisma.personUnit.deleteMany();
    await prisma.membership.deleteMany();
    await prisma.accessAccount.deleteMany();
    await prisma.accessRolePermission.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.accessRole.deleteMany();
    await prisma.rolePersona.deleteMany();
    await prisma.privateUnit.deleteMany();
    await prisma.physicalGroup.deleteMany();
    await prisma.person.deleteMany();
    await prisma.residentialComplex.deleteMany();
    await prisma.plan.deleteMany();
  });

  it('should return the person id for an active access account', async () => {
    const uniqueId = `${Date.now()}${Math.floor(Math.random() * 1_000_000)}`;

    const person = await prisma.person.create({
      data: {
        identificationType: 'CC',
        identificationNumber: uniqueId,
        fullName: 'Usuario Test',
        email: `user-${uniqueId}@test.com`,
        status: 'ACTIVE',
      },
    });

    const externalAuthId = `auth-${uniqueId}`;

    await prisma.accessAccount.create({
      data: {
        personId: person.id,
        externalAuthId,
        status: 'ACTIVE',
      },
    });

    const result = await repository.findPersonIdByExternalAuthId(externalAuthId);

    expect(result).toBe(person.id);
  });

  it('should return null when the access account does not exist', async () => {
    const result = await repository.findPersonIdByExternalAuthId(`auth-${Date.now()}`);

    expect(result).toBeNull();
  });

  it('should return null when the access account is inactive', async () => {
    const uniqueId = `${Date.now()}${Math.floor(Math.random() * 1_000_000)}`;

    const person = await prisma.person.create({
      data: {
        identificationType: 'CC',
        identificationNumber: uniqueId,
        fullName: 'Usuario Inactivo Test',
        email: `inactive-${uniqueId}@test.com`,
        status: 'ACTIVE',
      },
    });

    const externalAuthId = `auth-inactive-${uniqueId}`;

    await prisma.accessAccount.create({
      data: {
        personId: person.id,
        externalAuthId,
        status: 'INACTIVE',
      },
    });

    const result = await repository.findPersonIdByExternalAuthId(externalAuthId);

    expect(result).toBeNull();
  });
});
