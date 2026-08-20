import { ValidationPipe, VersioningType } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { createClient } from '@supabase/supabase-js';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/core/database/prisma.service';
import { GlobalExceptionFilter } from './../src/core/errors/global-exception.filter';
import { CreateResidentialComplexUseCase } from './../src/modules/structure/application/use-cases/create-residential-complex/create-residential-complex.use-case';
import { CreatePlanUseCase } from './../src/modules/subscription/application/use-cases/create-plan/create-plan.use-case';

describe('Application (e2e)', () => {
  let app: INestApplication;
  let residentialComplexId: string;

  function getResponseId(response: { body: unknown }): string {
    const body = response.body as Record<string, unknown>;

    if (typeof body.id !== 'string') {
      throw new Error('Expected a string id in the response body');
    }

    return body.id;
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api');

    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    app.useGlobalFilters(new GlobalExceptionFilter());

    await app.init();

    const prisma = app.get(PrismaService);

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

    const createResidentialComplexUseCase = app.get(CreateResidentialComplexUseCase);

    const residentialComplex = await createResidentialComplexUseCase.execute({
      name: 'E2E Residential Complex',
      address: 'E2E Test Address',
      city: 'Cali',
    });

    residentialComplexId = residentialComplex.id;
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/api/v1/unknown-route (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/unknown-route')
      .expect(404)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 404,
            code: 'NOT_FOUND',
            message: 'Cannot GET /api/v1/unknown-route',
            path: '/api/v1/unknown-route',
          }),
        );

        expect(typeof body.timestamp).toBe('string');
      });
  });

  it('/api/v1/health/validate (POST) validates request body', () => {
    return request(app.getHttpServer())
      .post('/api/v1/health/validate')
      .send({
        name: '',
        email: 'invalid-email',
      })
      .expect(400)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            code: 'BAD_REQUEST',
            path: '/api/v1/health/validate',
          }),
        );

        expect(typeof body.message).toBe('string');
      });
  });

  it('/api/v1/health/validate (POST) rejects unknown properties', () => {
    return request(app.getHttpServer())
      .post('/api/v1/health/validate')
      .send({
        name: 'Project Faro',
        email: 'admin@faro.local',
        unauthorizedField: 'not allowed',
      })
      .expect(400)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            code: 'BAD_REQUEST',
            path: '/api/v1/health/validate',
          }),
        );
      });
  });

  it('/api/v1/health/validate (POST) accepts valid data', () => {
    return request(app.getHttpServer())
      .post('/api/v1/health/validate')
      .send({
        name: 'Project Faro',
        email: 'admin@faro.local',
      })
      .expect(200)
      .expect({
        name: 'Project Faro',
        email: 'admin@faro.local',
      });
  });

  it('/api/v1/physical-groups (POST) creates a TOWER', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/physical-groups')
      .send({
        residentialComplexId: residentialComplexId,
        name: 'Torre 1',
        type: 'TOWER',
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        residentialComplexId: residentialComplexId,
        name: 'Torre 1',
        type: 'TOWER',
      }),
    );

    const body = response.body as Record<string, unknown>;

    expect(typeof body.id).toBe('string');
  });

  it('/api/v1/physical-groups (POST) creates a BLOCK', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/physical-groups')
      .send({
        residentialComplexId: residentialComplexId,
        name: 'Bloque A',
        type: 'BLOCK',
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        residentialComplexId: residentialComplexId,
        name: 'Bloque A',
        type: 'BLOCK',
      }),
    );

    const body = response.body as Record<string, unknown>;
    expect(typeof body.id).toBe('string');
  });

  it('/api/v1/physical-groups (POST) rejects invalid type', () => {
    return request(app.getHttpServer())
      .post('/api/v1/physical-groups')
      .send({
        residentialComplexId: residentialComplexId,
        name: 'Torre inválida',
        type: 'INVALID',
      })
      .expect(400)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            code: 'BAD_REQUEST',
            path: '/api/v1/physical-groups',
          }),
        );

        expect(typeof body.message).toBe('string');
      });
  });

  it('/api/v1/physical-groups (POST) rejects invalid residential complex id', () => {
    return request(app.getHttpServer())
      .post('/api/v1/physical-groups')
      .send({
        residentialComplexId: '123',
        name: 'Torre inválida',
        type: 'TOWER',
      })
      .expect(400)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            code: 'BAD_REQUEST',
            path: '/api/v1/physical-groups',
          }),
        );
      });
  });

  it('/api/v1/physical-groups (POST) returns 404 when residential complex does not exist', () => {
    return request(app.getHttpServer())
      .post('/api/v1/physical-groups')
      .send({
        residentialComplexId: '00000000-0000-0000-0000-000000000000',
        name: 'Torre inexistente',
        type: 'TOWER',
      })
      .expect(404)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 404,
            code: 'RESIDENTIAL_COMPLEX_NOT_FOUND',
            path: '/api/v1/physical-groups',
          }),
        );

        expect(typeof body.message).toBe('string');
        expect(typeof body.timestamp).toBe('string');
      });
  });

  it('/api/v1/private-units (POST) creates a private unit without a physical group', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/private-units')
      .send({
        residentialComplexId,
        identifier: '101',
        type: 'APARTMENT',
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        residentialComplexId,
        physicalGroupId: null,
        identifier: '101',
        type: 'APARTMENT',
        status: 'ACTIVE',
      }),
    );

    const body = response.body as Record<string, unknown>;

    expect(typeof body.id).toBe('string');
  });

  it('/api/v1/private-units (POST) creates a private unit with a physical group', async () => {
    const physicalGroupResponse = await request(app.getHttpServer())
      .post('/api/v1/physical-groups')
      .send({
        residentialComplexId,
        name: 'Torre E2E',
        type: 'TOWER',
      })
      .expect(201);

    const physicalGroupBody = physicalGroupResponse.body as Record<string, unknown>;

    const physicalGroupId = physicalGroupBody.id;

    expect(typeof physicalGroupId).toBe('string');

    const response = await request(app.getHttpServer())
      .post('/api/v1/private-units')
      .send({
        residentialComplexId,
        physicalGroupId,
        identifier: '201',
        type: 'APARTMENT',
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        residentialComplexId,
        physicalGroupId,
        identifier: '201',
        type: 'APARTMENT',
        status: 'ACTIVE',
      }),
    );
  });

  it('/api/v1/private-units (POST) rejects invalid type', () => {
    return request(app.getHttpServer())
      .post('/api/v1/private-units')
      .send({
        residentialComplexId,
        identifier: '301',
        type: 'INVALID',
      })
      .expect(400)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            code: 'BAD_REQUEST',
            path: '/api/v1/private-units',
          }),
        );

        expect(typeof body.message).toBe('string');
      });
  });

  it('/api/v1/private-units (POST) rejects invalid residential complex id', () => {
    return request(app.getHttpServer())
      .post('/api/v1/private-units')
      .send({
        residentialComplexId: '123',
        identifier: '401',
        type: 'APARTMENT',
      })
      .expect(400)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            code: 'BAD_REQUEST',
            path: '/api/v1/private-units',
          }),
        );
      });
  });

  it('/api/v1/private-units (POST) returns 404 when residential complex does not exist', () => {
    return request(app.getHttpServer())
      .post('/api/v1/private-units')
      .send({
        residentialComplexId: '00000000-0000-0000-0000-000000000000',
        identifier: '501',
        type: 'APARTMENT',
      })
      .expect(404)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 404,
            code: 'RESIDENTIAL_COMPLEX_NOT_FOUND',
            path: '/api/v1/private-units',
          }),
        );

        expect(typeof body.message).toBe('string');
        expect(typeof body.timestamp).toBe('string');
      });
  });

  it('/api/v1/private-units (POST) returns 404 when physical group does not exist', () => {
    return request(app.getHttpServer())
      .post('/api/v1/private-units')
      .send({
        residentialComplexId,
        physicalGroupId: '00000000-0000-0000-0000-000000000000',
        identifier: '601',
        type: 'APARTMENT',
      })
      .expect(404)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 404,
            code: 'PHYSICAL_GROUP_NOT_FOUND',
            path: '/api/v1/private-units',
          }),
        );

        expect(typeof body.message).toBe('string');
        expect(typeof body.timestamp).toBe('string');
      });
  });

  it('/api/v1/private-units (POST) rejects physical group from another residential complex', async () => {
    const anotherComplex = await app.get(CreateResidentialComplexUseCase).execute({
      name: 'Another E2E Complex',
      address: 'Another E2E Address',
      city: 'Cali',
    });

    const physicalGroupResponse = await request(app.getHttpServer())
      .post('/api/v1/physical-groups')
      .send({
        residentialComplexId: anotherComplex.id,
        name: 'Torre Otro Conjunto',
        type: 'TOWER',
      })
      .expect(201);

    const physicalGroupBody = physicalGroupResponse.body as Record<string, unknown>;

    const physicalGroupId = physicalGroupBody.id;

    expect(typeof physicalGroupId).toBe('string');

    await request(app.getHttpServer())
      .post('/api/v1/private-units')
      .send({
        residentialComplexId,
        physicalGroupId,
        identifier: '701',
        type: 'APARTMENT',
      })
      .expect(400)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            code: 'PHYSICAL_GROUP_RESIDENTIAL_COMPLEX_MISMATCH',
            path: '/api/v1/private-units',
          }),
        );
      });
  });

  it('/api/v1/plans (POST) creates a plan', async () => {
    const planCode = `E2E-STARTER-${Date.now()}`;

    const response = await request(app.getHttpServer())
      .post('/api/v1/plans')
      .send({
        code: planCode,
        name: 'Starter',
        maxComplexes: 1,
        maxUnits: 100,
        monthlyPrice: 50000,
        quarterlyPrice: 140000,
        yearlyPrice: 500000,
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        code: planCode,
        name: 'Starter',
        maxComplexes: 1,
        maxUnits: 100,
        monthlyPrice: 50000,
        quarterlyPrice: 140000,
        yearlyPrice: 500000,
        status: 'ACTIVE',
      }),
    );

    const body = response.body as Record<string, unknown>;

    expect(typeof body.id).toBe('string');
  });

  it('/api/v1/plans (POST) rejects duplicate code', async () => {
    const createPlanUseCase = app.get(CreatePlanUseCase);
    const planCode = `E2E-DUPLICATE-${Date.now()}`;

    await createPlanUseCase.execute({
      code: planCode,
      name: 'Existing Plan',
      maxComplexes: 1,
      maxUnits: 100,
      monthlyPrice: 50000,
      quarterlyPrice: 140000,
      yearlyPrice: 500000,
    });

    await request(app.getHttpServer())
      .post('/api/v1/plans')
      .send({
        code: planCode,
        name: 'Duplicate Plan',
        maxComplexes: 1,
        maxUnits: 100,
        monthlyPrice: 50000,
        quarterlyPrice: 140000,
        yearlyPrice: 500000,
      })
      .expect(409)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 409,
            code: 'PLAN_CODE_ALREADY_EXISTS',
            path: '/api/v1/plans',
          }),
        );

        expect(typeof body.message).toBe('string');
        expect(typeof body.timestamp).toBe('string');
      });
  });

  it('/api/v1/plans (POST) rejects maxComplexes equal to zero', () => {
    return request(app.getHttpServer())
      .post('/api/v1/plans')
      .send({
        code: `E2E-COMPLEXES-${Date.now()}`,
        name: 'Invalid Plan',
        maxComplexes: 0,
        maxUnits: 100,
        monthlyPrice: 50000,
        quarterlyPrice: 140000,
        yearlyPrice: 500000,
      })
      .expect(400)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            code: 'BAD_REQUEST',
            path: '/api/v1/plans',
          }),
        );

        expect(typeof body.message).toBe('string');
      });
  });

  it('/api/v1/plans (POST) rejects maxUnits equal to zero', () => {
    return request(app.getHttpServer())
      .post('/api/v1/plans')
      .send({
        code: `E2E-UNITS-${Date.now()}`,
        name: 'Invalid Plan',
        maxComplexes: 1,
        maxUnits: 0,
        monthlyPrice: 50000,
        quarterlyPrice: 140000,
        yearlyPrice: 500000,
      })
      .expect(400)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            code: 'BAD_REQUEST',
            path: '/api/v1/plans',
          }),
        );
      });
  });

  it('/api/v1/plans (POST) rejects negative monthlyPrice', () => {
    return request(app.getHttpServer())
      .post('/api/v1/plans')
      .send({
        code: `E2E-MONTHLY-${Date.now()}`,
        name: 'Invalid Plan',
        maxComplexes: 1,
        maxUnits: 100,
        monthlyPrice: -1,
        quarterlyPrice: 140000,
        yearlyPrice: 500000,
      })
      .expect(400)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            code: 'BAD_REQUEST',
            path: '/api/v1/plans',
          }),
        );
      });
  });

  it('/api/v1/plans (POST) rejects negative quarterlyPrice', () => {
    return request(app.getHttpServer())
      .post('/api/v1/plans')
      .send({
        code: `E2E-QUARTERLY-${Date.now()}`,
        name: 'Invalid Plan',
        maxComplexes: 1,
        maxUnits: 100,
        monthlyPrice: 50000,
        quarterlyPrice: -1,
        yearlyPrice: 500000,
      })
      .expect(400)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            code: 'BAD_REQUEST',
            path: '/api/v1/plans',
          }),
        );
      });
  });

  it('/api/v1/plans (POST) rejects negative yearlyPrice', () => {
    return request(app.getHttpServer())
      .post('/api/v1/plans')
      .send({
        code: `E2E-YEARLY-${Date.now()}`,
        name: 'Invalid Plan',
        maxComplexes: 1,
        maxUnits: 100,
        monthlyPrice: 50000,
        quarterlyPrice: 140000,
        yearlyPrice: -1,
      })
      .expect(400)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            code: 'BAD_REQUEST',
            path: '/api/v1/plans',
          }),
        );
      });
  });

  it('/api/v1/plans (POST) rejects unknown properties', () => {
    return request(app.getHttpServer())
      .post('/api/v1/plans')
      .send({
        code: `E2E-UNKNOWN-${Date.now()}`,
        name: 'Starter',
        maxComplexes: 1,
        maxUnits: 100,
        monthlyPrice: 50000,
        quarterlyPrice: 140000,
        yearlyPrice: 500000,
        unauthorizedField: 'not allowed',
      })
      .expect(400)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            code: 'BAD_REQUEST',
            path: '/api/v1/plans',
          }),
        );
      });
  });

  it('/api/v1/people (POST) creates a person with email and phone', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '123456789',
        fullName: 'Juan Carlos Pérez Gómez',
        email: 'juan@example.com',
        phone: '3001234567',
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        identificationType: 'CC',
        identificationNumber: '123456789',
        fullName: 'Juan Carlos Pérez Gómez',
        email: 'juan@example.com',
        phone: '3001234567',
        status: 'ACTIVE',
      }),
    );

    const body = response.body as Record<string, unknown>;

    expect(typeof body.id).toBe('string');
    expect(typeof body.createdAt).toBe('string');
    expect(typeof body.updatedAt).toBe('string');
  });

  it('/api/v1/people (POST) creates a person with email without phone', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CE',
        identificationNumber: '987654321',
        fullName: 'María Pérez',
        email: 'maria@example.com',
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        identificationType: 'CE',
        identificationNumber: '987654321',
        fullName: 'María Pérez',
        email: 'maria@example.com',
        phone: null,
        status: 'ACTIVE',
      }),
    );
  });

  it('/api/v1/people (POST) creates a person with phone without email', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'TI',
        identificationNumber: '456789123',
        fullName: 'Pedro Gómez',
        phone: '3009876543',
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        identificationType: 'TI',
        identificationNumber: '456789123',
        fullName: 'Pedro Gómez',
        email: null,
        phone: '3009876543',
        status: 'ACTIVE',
      }),
    );
  });

  it('/api/v1/people (POST) rejects person without email and phone', () => {
    return request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '111222333',
        fullName: 'Persona Sin Contacto',
      })
      .expect(400)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            code: 'PERSON_CONTACT_REQUIRED',
            path: '/api/v1/people',
          }),
        );

        expect(typeof body.message).toBe('string');
        expect(typeof body.timestamp).toBe('string');
      });
  });

  it('/api/v1/people (POST) rejects duplicate identification', async () => {
    const person = {
      identificationType: 'CC',
      identificationNumber: '555666777',
      fullName: 'Persona Original',
      email: 'original@example.com',
    };

    await request(app.getHttpServer()).post('/api/v1/people').send(person).expect(201);

    await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        ...person,
        fullName: 'Persona Duplicada',
        email: 'duplicate@example.com',
      })
      .expect(409)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 409,
            code: 'PERSON_ALREADY_EXISTS',
            path: '/api/v1/people',
          }),
        );

        expect(typeof body.message).toBe('string');
        expect(typeof body.timestamp).toBe('string');
      });
  });

  it('/api/v1/role-personas (POST) creates a role persona', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/role-personas')
      .send({
        code: 'E2E-ROLE-PROPIETARIO',
        name: 'Propietario',
        description: 'Persona titular de una unidad privada.',
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        code: 'E2E-ROLE-PROPIETARIO',
        name: 'Propietario',
        description: 'Persona titular de una unidad privada.',
        status: 'ACTIVE',
      }),
    );

    const body = response.body as Record<string, unknown>;

    expect(typeof body.id).toBe('string');
    expect(typeof body.createdAt).toBe('string');
    expect(typeof body.updatedAt).toBe('string');
  });

  it('/api/v1/role-personas (POST) rejects duplicate code', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/role-personas')
      .send({
        code: 'E2E-ROLE-DUPLICATE-CODE',
        name: 'Propietario',
        description: 'Persona titular de una unidad privada.',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/v1/role-personas')
      .send({
        code: 'E2E-ROLE-DUPLICATE-CODE',
        name: 'Otro nombre',
        description: 'Otra descripción.',
      })
      .expect(409)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 409,
            code: 'ROLE_PERSONA_CODE_ALREADY_EXISTS',
            path: '/api/v1/role-personas',
          }),
        );

        expect(typeof body.message).toBe('string');
        expect(typeof body.timestamp).toBe('string');
      });
  });

  it('/api/v1/role-personas (POST) rejects duplicate name', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/role-personas')
      .send({
        code: 'E2E-ROLE-FIRST-NAME',
        name: 'Propietario',
        description: 'Persona titular de una unidad privada.',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/v1/role-personas')
      .send({
        code: 'E2E-ROLE-SECOND-NAME',
        name: 'Propietario',
        description: 'Otra descripción.',
      })
      .expect(409)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 409,
            code: 'ROLE_PERSONA_NAME_ALREADY_EXISTS',
            path: '/api/v1/role-personas',
          }),
        );

        expect(typeof body.message).toBe('string');
        expect(typeof body.timestamp).toBe('string');
      });
  });

  it('/api/v1/role-personas (POST) rejects empty code', () => {
    return request(app.getHttpServer())
      .post('/api/v1/role-personas')
      .send({
        code: '',
        name: 'Propietario',
        description: 'Persona titular de una unidad privada.',
      })
      .expect(400)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            code: 'BAD_REQUEST',
            path: '/api/v1/role-personas',
          }),
        );

        expect(typeof body.message).toBe('string');
      });
  });

  it('/api/v1/role-personas (POST) rejects empty name', () => {
    return request(app.getHttpServer())
      .post('/api/v1/role-personas')
      .send({
        code: 'E2E-ROLE-EMPTY-NAME',
        name: '',
        description: 'Persona titular de una unidad privada.',
      })
      .expect(400)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            code: 'BAD_REQUEST',
            path: '/api/v1/role-personas',
          }),
        );

        expect(typeof body.message).toBe('string');
      });
  });

  it('/api/v1/role-personas (POST) rejects empty description', () => {
    return request(app.getHttpServer())
      .post('/api/v1/role-personas')
      .send({
        code: 'E2E-ROLE-EMPTY-DESCRIPTION',
        name: 'Residente',
        description: '',
      })
      .expect(400)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            code: 'BAD_REQUEST',
            path: '/api/v1/role-personas',
          }),
        );

        expect(typeof body.message).toBe('string');
      });
  });

  it('/api/v1/role-personas (POST) rejects unknown properties', () => {
    return request(app.getHttpServer())
      .post('/api/v1/role-personas')
      .send({
        code: 'E2E-ROLE-UNKNOWN',
        name: 'Arrendatario',
        description: 'Persona que ocupa una unidad privada mediante arrendamiento.',
        unauthorizedField: 'not allowed',
      })
      .expect(400)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            code: 'BAD_REQUEST',
            path: '/api/v1/role-personas',
          }),
        );

        expect(typeof body.message).toBe('string');
      });
  });

  it('/api/v1/access-roles (POST) creates an access role', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/access-roles')
      .send({
        code: 'E2E-PORTERO',
        name: 'Portero',
        description: 'Rol de acceso para usuarios responsables de la operación de portería.',
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        code: 'E2E-PORTERO',
        name: 'Portero',
        description: 'Rol de acceso para usuarios responsables de la operación de portería.',
        status: 'ACTIVE',
      }),
    );

    const body = response.body as Record<string, unknown>;

    expect(typeof body.id).toBe('string');
    expect(typeof body.createdAt).toBe('string');
    expect(typeof body.updatedAt).toBe('string');
  });

  it('/api/v1/access-roles (POST) rejects duplicate code', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/access-roles')
      .send({
        code: 'E2E-DUPLICATE-CODE',
        name: 'Portero',
        description: 'Primer rol.',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/v1/access-roles')
      .send({
        code: 'E2E-DUPLICATE-CODE',
        name: 'Otro Portero',
        description: 'Segundo rol.',
      })
      .expect(409)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 409,
            code: 'ACCESS_ROLE_CODE_ALREADY_EXISTS',
            path: '/api/v1/access-roles',
          }),
        );
      });
  });

  it('/api/v1/access-roles (POST) rejects duplicate name', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/access-roles')
      .send({
        code: 'E2E-DUPLICATE-NAME-1',
        name: 'E2E Portero',
        description: 'Primer rol.',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/v1/access-roles')
      .send({
        code: 'E2E-DUPLICATE-NAME-2',
        name: 'E2E Portero',
        description: 'Segundo rol.',
      })
      .expect(409)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 409,
            code: 'ACCESS_ROLE_NAME_ALREADY_EXISTS',
            path: '/api/v1/access-roles',
          }),
        );
      });
  });
  it('/api/v1/access-roles (POST) rejects empty code', () => {
    return request(app.getHttpServer())
      .post('/api/v1/access-roles')
      .send({
        code: '',
        name: 'Portero',
        description: 'Rol de acceso.',
      })
      .expect(400);
  });

  it('/api/v1/access-roles (POST) rejects empty name', () => {
    return request(app.getHttpServer())
      .post('/api/v1/access-roles')
      .send({
        code: 'E2E-PORTERO',
        name: '',
        description: 'Rol de acceso.',
      })
      .expect(400);
  });

  it('/api/v1/access-roles (POST) rejects empty description', () => {
    return request(app.getHttpServer())
      .post('/api/v1/access-roles')
      .send({
        code: 'E2E-PORTERO',
        name: 'Portero',
        description: '',
      })
      .expect(400);
  });

  it('/api/v1/access-roles (POST) rejects unknown properties', () => {
    return request(app.getHttpServer())
      .post('/api/v1/access-roles')
      .send({
        code: 'E2E-PORTERO',
        name: 'Portero',
        description: 'Rol de acceso.',
        unauthorizedField: 'not allowed',
      })
      .expect(400)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            code: 'BAD_REQUEST',
            path: '/api/v1/access-roles',
          }),
        );
      });
  });

  it('/api/v1/permissions (POST) creates a permission', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/permissions')
      .send({
        code: 'E2E-VIEW-ACCESS-LOGS',
        name: 'E2E Ver registros de acceso',
        description:
          'Permite consultar los registros históricos de entrada y salida de la copropiedad.',
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        code: 'E2E-VIEW-ACCESS-LOGS',
        name: 'E2E Ver registros de acceso',
        description:
          'Permite consultar los registros históricos de entrada y salida de la copropiedad.',
        status: 'ACTIVE',
      }),
    );

    const body = response.body as Record<string, unknown>;

    expect(typeof body.id).toBe('string');
    expect(typeof body.createdAt).toBe('string');
    expect(typeof body.updatedAt).toBe('string');
  });

  it('/api/v1/permissions (POST) rejects duplicate code', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/permissions')
      .send({
        code: 'E2E-DUPLICATE-PERMISSION-CODE',
        name: 'E2E Permission One',
        description: 'Primer permiso.',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/v1/permissions')
      .send({
        code: 'E2E-DUPLICATE-PERMISSION-CODE',
        name: 'E2E Permission Two',
        description: 'Segundo permiso.',
      })
      .expect(409)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 409,
            code: 'PERMISSION_CODE_ALREADY_EXISTS',
            path: '/api/v1/permissions',
          }),
        );
      });
  });

  it('/api/v1/permissions (POST) rejects duplicate name', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/permissions')
      .send({
        code: 'E2E-DUPLICATE-PERMISSION-NAME-1',
        name: 'E2E Permission Duplicate Name',
        description: 'Primer permiso.',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/v1/permissions')
      .send({
        code: 'E2E-DUPLICATE-PERMISSION-NAME-2',
        name: 'E2E Permission Duplicate Name',
        description: 'Segundo permiso.',
      })
      .expect(409)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 409,
            code: 'PERMISSION_NAME_ALREADY_EXISTS',
            path: '/api/v1/permissions',
          }),
        );
      });
  });

  it('/api/v1/permissions (POST) rejects empty code', () => {
    return request(app.getHttpServer())
      .post('/api/v1/permissions')
      .send({
        code: '',
        name: 'E2E Permission',
        description: 'Permiso de prueba.',
      })
      .expect(400);
  });

  it('/api/v1/permissions (POST) rejects empty name', () => {
    return request(app.getHttpServer())
      .post('/api/v1/permissions')
      .send({
        code: 'E2E-PERMISSION',
        name: '',
        description: 'Permiso de prueba.',
      })
      .expect(400);
  });

  it('/api/v1/permissions (POST) rejects empty description', () => {
    return request(app.getHttpServer())
      .post('/api/v1/permissions')
      .send({
        code: 'E2E-PERMISSION',
        name: 'E2E Permission',
        description: '',
      })
      .expect(400);
  });

  it('/api/v1/permissions (POST) rejects unknown properties', () => {
    return request(app.getHttpServer())
      .post('/api/v1/permissions')
      .send({
        code: 'E2E-PERMISSION',
        name: 'E2E Permission',
        description: 'Permiso de prueba.',
        unauthorizedField: 'not allowed',
      })
      .expect(400)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            code: 'BAD_REQUEST',
            path: '/api/v1/permissions',
          }),
        );
      });
  });

  it('/api/v1/access-roles/:accessRoleId/permissions (POST) assigns a permission', async () => {
    const accessRoleResponse = await request(app.getHttpServer())
      .post('/api/v1/access-roles')
      .send({
        code: 'E2E-PORTER',
        name: 'E2E Portero',
        description: 'Rol de acceso para portería.',
      })
      .expect(201);

    const permissionResponse = await request(app.getHttpServer())
      .post('/api/v1/permissions')
      .send({
        code: 'E2E-VIEW-ACCESS-LOGS',
        name: 'E2E Ver registros de acceso',
        description: 'Permite consultar registros de acceso.',
      })
      .expect(201);

    const accessRoleId = getResponseId(accessRoleResponse);
    const permissionId = getResponseId(permissionResponse);

    const response = await request(app.getHttpServer())
      .post(`/api/v1/access-roles/${accessRoleId}/permissions`)
      .send({
        permissionId,
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        accessRoleId,
        permissionId,
      }),
    );

    const body = response.body as Record<string, unknown>;

    expect(typeof body.id).toBe('string');
    expect(typeof body.createdAt).toBe('string');
  });

  it('/api/v1/access-roles/:accessRoleId/permissions (POST) rejects duplicate permission assignment', async () => {
    const accessRoleResponse = await request(app.getHttpServer())
      .post('/api/v1/access-roles')
      .send({
        code: 'E2E-DUPLICATE-ROLE',
        name: 'E2E Duplicate Role',
        description: 'Rol para prueba de duplicidad.',
      })
      .expect(201);

    const permissionResponse = await request(app.getHttpServer())
      .post('/api/v1/permissions')
      .send({
        code: 'E2E-DUPLICATE-PERMISSION',
        name: 'E2E Duplicate Permission',
        description: 'Permiso para prueba de duplicidad.',
      })
      .expect(201);

    const accessRoleId = getResponseId(accessRoleResponse);
    const permissionId = getResponseId(permissionResponse);

    await request(app.getHttpServer())
      .post(`/api/v1/access-roles/${accessRoleId}/permissions`)
      .send({ permissionId })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/api/v1/access-roles/${accessRoleId}/permissions`)
      .send({ permissionId })
      .expect(409)
      .expect((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: 409,
            code: 'ACCESS_ROLE_PERMISSION_ALREADY_EXISTS',
            path: `/api/v1/access-roles/${accessRoleId}/permissions`,
          }),
        );
      });
  });

  it('/api/v1/access-roles/:accessRoleId/permissions (POST) returns 404 when access role does not exist', async () => {
    const permissionResponse = await request(app.getHttpServer())
      .post('/api/v1/permissions')
      .send({
        code: 'E2E-MISSING-ROLE-PERMISSION',
        name: 'E2E Missing Role Permission',
        description: 'Permiso de prueba.',
      })
      .expect(201);

    const permissionId = getResponseId(permissionResponse);
    await request(app.getHttpServer())
      .post('/api/v1/access-roles/00000000-0000-0000-0000-000000000000/permissions')
      .send({ permissionId })
      .expect(404)
      .expect((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: 404,
            code: 'ACCESS_ROLE_NOT_FOUND',
          }),
        );
      });
  });

  it('/api/v1/access-roles/:accessRoleId/permissions (POST) returns 404 when permission does not exist', async () => {
    const accessRoleResponse = await request(app.getHttpServer())
      .post('/api/v1/access-roles')
      .send({
        code: 'E2E-MISSING-PERMISSION-ROLE',
        name: 'E2E Missing Permission Role',
        description: 'Rol de prueba.',
      })
      .expect(201);

    const accessRoleId = getResponseId(accessRoleResponse);

    await request(app.getHttpServer())
      .post(`/api/v1/access-roles/${accessRoleId}/permissions`)
      .send({
        permissionId: '00000000-0000-0000-0000-000000000000',
      })
      .expect(404)
      .expect((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: 404,
            code: 'PERMISSION_NOT_FOUND',
          }),
        );
      });
  });

  it('/api/v1/access-roles/:accessRoleId/permissions/:permissionId (DELETE) removes a permission assignment', async () => {
    const accessRoleResponse = await request(app.getHttpServer())
      .post('/api/v1/access-roles')
      .send({
        code: 'E2E-REMOVE-ROLE',
        name: 'E2E Remove Role',
        description: 'Rol para prueba de revocación.',
      })
      .expect(201);

    const permissionResponse = await request(app.getHttpServer())
      .post('/api/v1/permissions')
      .send({
        code: 'E2E-REMOVE-PERMISSION',
        name: 'E2E Remove Permission',
        description: 'Permiso para prueba de revocación.',
      })
      .expect(201);

    const accessRoleId = getResponseId(accessRoleResponse);
    const permissionId = getResponseId(permissionResponse);

    await request(app.getHttpServer())
      .post(`/api/v1/access-roles/${accessRoleId}/permissions`)
      .send({ permissionId })
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/api/v1/access-roles/${accessRoleId}/permissions/${permissionId}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/api/v1/access-roles/${accessRoleId}/permissions/${permissionId}`)
      .expect(404)
      .expect((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: 404,
            code: 'ACCESS_ROLE_PERMISSION_NOT_FOUND',
          }),
        );
      });
  });

  it('/api/v1/access-roles/:accessRoleId/permissions (POST) rejects unknown properties', async () => {
    const accessRoleResponse = await request(app.getHttpServer())
      .post('/api/v1/access-roles')
      .send({
        code: 'E2E-UNKNOWN-PROPERTY-ROLE',
        name: 'E2E Unknown Property Role',
        description: 'Rol de prueba.',
      })
      .expect(201);

    const permissionResponse = await request(app.getHttpServer())
      .post('/api/v1/permissions')
      .send({
        code: 'E2E-UNKNOWN-PROPERTY-PERMISSION',
        name: 'E2E Unknown Property Permission',
        description: 'Permiso de prueba.',
      })
      .expect(201);

    const accessRoleId = getResponseId(accessRoleResponse);
    const permissionId = getResponseId(permissionResponse);

    await request(app.getHttpServer())
      .post(`/api/v1/access-roles/${accessRoleId}/permissions`)
      .send({
        permissionId,
        unauthorizedField: 'not allowed',
      })
      .expect(400)
      .expect((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            code: 'BAD_REQUEST',
            path: `/api/v1/access-roles/${accessRoleId}/permissions`,
          }),
        );
      });
  });

  it('/api/v1/access-accounts (POST) creates an access account', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '697095',
        fullName: 'Juan Pérez',
        email: 'dbatt0@wired.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    const response = await request(app.getHttpServer())
      .post('/api/v1/access-accounts')
      .send({
        personId,
        externalAuthId: 'E2E-SUPABASE-USER-001',
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        personId,
        externalAuthId: 'E2E-SUPABASE-USER-001',
        status: 'ACTIVE',
      }),
    );

    const body = response.body as Record<string, unknown>;

    expect(typeof body.id).toBe('string');
    expect(typeof body.createdAt).toBe('string');
    expect(typeof body.updatedAt).toBe('string');
  });

  it('/api/v1/access-accounts (POST) returns 404 when person does not exist', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/access-accounts')
      .send({
        personId: '00000000-0000-0000-0000-000000000000',
        externalAuthId: 'E2E-SUPABASE-MISSING-PERSON',
      })
      .expect(404)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 404,
            code: 'PERSON_NOT_FOUND',
            path: '/api/v1/access-accounts',
          }),
        );

        expect(typeof body.message).toBe('string');
        expect(typeof body.timestamp).toBe('string');
      });
  });

  it('/api/v1/access-accounts (POST) rejects person with existing access account', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '987654321',
        fullName: 'María Pérez',
        email: 'smulliner1@usnews.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    await request(app.getHttpServer())
      .post('/api/v1/access-accounts')
      .send({
        personId,
        externalAuthId: 'E2E-SUPABASE-USER-002',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/v1/access-accounts')
      .send({
        personId,
        externalAuthId: 'E2E-SUPABASE-USER-003',
      })
      .expect(409)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 409,
            code: 'ACCESS_ACCOUNT_ALREADY_EXISTS_FOR_PERSON',
            path: '/api/v1/access-accounts',
          }),
        );

        expect(typeof body.message).toBe('string');
        expect(typeof body.timestamp).toBe('string');
      });
  });

  it('/api/v1/access-accounts (POST) rejects duplicate external auth identity', async () => {
    const firstPersonResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '456789123',
        fullName: 'Carlos Primera Persona',
        email: 'achristophle3@ft.com',
      })
      .expect(201);

    const secondPersonResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '111222333',
        fullName: 'Carlos Segunda Persona',
        email: 'nshorey4@sogou.com',
      })
      .expect(201);

    const firstPersonId = getResponseId(firstPersonResponse);
    const secondPersonId = getResponseId(secondPersonResponse);

    const externalAuthId = 'E2E-SUPABASE-DUPLICATE-001';

    await request(app.getHttpServer())
      .post('/api/v1/access-accounts')
      .send({
        personId: firstPersonId,
        externalAuthId,
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/v1/access-accounts')
      .send({
        personId: secondPersonId,
        externalAuthId,
      })
      .expect(409)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 409,
            code: 'EXTERNAL_AUTH_IDENTITY_ALREADY_LINKED',
            path: '/api/v1/access-accounts',
          }),
        );

        expect(typeof body.message).toBe('string');
        expect(typeof body.timestamp).toBe('string');
      });
  });

  it('/api/v1/access-accounts (POST) rejects unknown properties', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'TI',
        identificationNumber: '555666777',
        fullName: 'Persona Access Account',
        email: 'rvalentim8@ehow.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    await request(app.getHttpServer())
      .post('/api/v1/access-accounts')
      .send({
        personId,
        externalAuthId: 'E2E-SUPABASE-UNKNOWN-001',
        unauthorizedField: 'not allowed',
      })
      .expect(400)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            code: 'BAD_REQUEST',
            path: '/api/v1/access-accounts',
          }),
        );
      });
  });

  it('/api/v1/access-accounts (POST) persists the person relationship', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CE',
        identificationNumber: '323784',
        fullName: 'Persona Persistencia',
        email: 'aspriggin0@weebly.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    const response = await request(app.getHttpServer())
      .post('/api/v1/access-accounts')
      .send({
        personId,
        externalAuthId: 'E2E-SUPABASE-PERSISTENCE-001',
      })
      .expect(201);

    const accessAccountId = getResponseId(response);

    const prisma = app.get(PrismaService);

    const accessAccount = await prisma.accessAccount.findUnique({
      where: {
        id: accessAccountId,
      },
    });

    expect(accessAccount).not.toBeNull();
    expect(accessAccount?.personId).toBe(personId);
    expect(accessAccount?.externalAuthId).toBe('E2E-SUPABASE-PERSISTENCE-001');
  });

  it('/api/v1/access-accounts/:id/deactivate (PATCH) deactivates an access account', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '500418',
        fullName: 'E2E Access Deactivate',
        email: 'bgreenlies5@oakley.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    const accountResponse = await request(app.getHttpServer())
      .post('/api/v1/access-accounts')
      .send({
        personId,
        externalAuthId: 'E2E-ACCESS-DEACTIVATE-001',
      })
      .expect(201);

    const accessAccountId = getResponseId(accountResponse);

    await request(app.getHttpServer())
      .patch(`/api/v1/access-accounts/${accessAccountId}/deactivate`)
      .expect(200);

    const prisma = app.get(PrismaService);

    const accessAccount = await prisma.accessAccount.findUnique({
      where: {
        id: accessAccountId,
      },
    });

    expect(accessAccount).not.toBeNull();
    expect(accessAccount?.status).toBe('INACTIVE');
  });

  it('/api/v1/access-accounts/:id/activate (PATCH) activates an access account', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '289489',
        fullName: 'E2E Access Activate',
        email: 'gduxbarryg@com.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    const accountResponse = await request(app.getHttpServer())
      .post('/api/v1/access-accounts')
      .send({
        personId,
        externalAuthId: 'E2E-ACCESS-ACTIVATE-001',
      })
      .expect(201);

    const accessAccountId = getResponseId(accountResponse);

    await request(app.getHttpServer())
      .patch(`/api/v1/access-accounts/${accessAccountId}/deactivate`)
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/api/v1/access-accounts/${accessAccountId}/activate`)
      .expect(200);

    const prisma = app.get(PrismaService);

    const accessAccount = await prisma.accessAccount.findUnique({
      where: {
        id: accessAccountId,
      },
    });

    expect(accessAccount).not.toBeNull();
    expect(accessAccount?.status).toBe('ACTIVE');
  });

  it('/api/v1/memberships (POST) creates a membership', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '212397',
        fullName: 'Persona Membership',
        email: 'egerami@about.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    const accessRoleResponse = await request(app.getHttpServer())
      .post('/api/v1/access-roles')
      .send({
        code: 'E2E-MEMBERSHIPPORTERO',
        name: 'Portero Membership',
        description: 'Rol de acceso para prueba de membresía.',
      })
      .expect(201);

    const accessRoleId = getResponseId(accessRoleResponse);

    const accessAccountResponse = await request(app.getHttpServer())
      .post('/api/v1/access-accounts')
      .send({
        personId,
        externalAuthId: 'E2E-MEMBERSHIP-ACCOUNT-001',
      })
      .expect(201);

    const accessAccountId = getResponseId(accessAccountResponse);

    const response = await request(app.getHttpServer())
      .post('/api/v1/memberships')
      .send({
        personId,
        residentialComplexId,
        accessAccountId,
        accessRoleId,
        startDate: '2026-08-18',
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        personId,
        residentialComplexId,
        accessAccountId,
        accessRoleId,
        status: 'ACTIVE',
        endDate: null,
      }),
    );

    const body = response.body as Record<string, unknown>;

    expect(typeof body.id).toBe('string');
    expect(typeof body.startDate).toBe('string');
    expect(typeof body.createdAt).toBe('string');
    expect(typeof body.updatedAt).toBe('string');
  });

  it('/api/v1/memberships (POST) creates a membership without an access account', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '225788',
        fullName: 'Membership Without Account',
        email: 'dfullunj@istockphoto.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    const accessRoleResponse = await request(app.getHttpServer())
      .post('/api/v1/access-roles')
      .send({
        code: 'E2E-MEMBERSHIP-NO-ACCOUNT',
        name: 'Membership No Account',
        description: 'Rol para prueba sin cuenta.',
      })
      .expect(201);

    const accessRoleId = getResponseId(accessRoleResponse);

    const response = await request(app.getHttpServer())
      .post('/api/v1/memberships')
      .send({
        personId,
        residentialComplexId,
        accessAccountId: null,
        accessRoleId,
        startDate: '2026-08-18',
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        personId,
        residentialComplexId,
        accessAccountId: null,
        accessRoleId,
        status: 'ACTIVE',
        endDate: null,
      }),
    );
  });

  it('/api/v1/memberships (POST) returns 404 when person does not exist', async () => {
    const accessRoleResponse = await request(app.getHttpServer())
      .post('/api/v1/access-roles')
      .send({
        code: 'E2E-MEMBERSHIP-NO-PERSON',
        name: 'Membership No Person',
        description: 'Rol para prueba.',
      })
      .expect(201);

    const accessRoleId = getResponseId(accessRoleResponse);

    await request(app.getHttpServer())
      .post('/api/v1/memberships')
      .send({
        personId: '00000000-0000-0000-0000-000000000000',
        residentialComplexId,
        accessAccountId: null,
        accessRoleId,
        startDate: '2026-08-18',
      })
      .expect(404)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 404,
            code: 'PERSON_NOT_FOUND',
            path: '/api/v1/memberships',
          }),
        );
      });
  });

  it('/api/v1/memberships (POST) returns 404 when residential complex does not exist', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '803266',
        fullName: 'Membership No Complex',
        email: 'ehallinl@nydailynews.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    const accessRoleResponse = await request(app.getHttpServer())
      .post('/api/v1/access-roles')
      .send({
        code: 'E2E-MEMBERSHIP-NO-COMPLEX',
        name: 'Membership No Complex',
        description: 'Rol para prueba.',
      })
      .expect(201);

    const accessRoleId = getResponseId(accessRoleResponse);

    await request(app.getHttpServer())
      .post('/api/v1/memberships')
      .send({
        personId,
        residentialComplexId: '00000000-0000-0000-0000-000000000000',
        accessAccountId: null,
        accessRoleId,
        startDate: '2026-08-18',
      })
      .expect(404)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 404,
            code: 'RESIDENTIAL_COMPLEX_NOT_FOUND',
            path: '/api/v1/memberships',
          }),
        );
      });
  });

  it('/api/v1/memberships (POST) returns 404 when access role does not exist', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '759901',
        fullName: 'Membership No Role',
        email: 'jheinekenn@phpbb.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    await request(app.getHttpServer())
      .post('/api/v1/memberships')
      .send({
        personId,
        residentialComplexId,
        accessAccountId: null,
        accessRoleId: '00000000-0000-0000-0000-000000000000',
        startDate: '2026-08-18',
      })
      .expect(404)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 404,
            code: 'ACCESS_ROLE_NOT_FOUND',
            path: '/api/v1/memberships',
          }),
        );
      });
  });

  it('/api/v1/memberships (POST) returns 409 when access role is inactive', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '877125',
        fullName: 'Membership Inactive Role',
        email: 'cdevericko@yellowbook.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    const accessRoleResponse = await request(app.getHttpServer())
      .post('/api/v1/access-roles')
      .send({
        code: 'E2E-MEMBERSHIP-INACTIVE-ROLE',
        name: 'Membership Inactive Role',
        description: 'Rol inactivo para prueba E2E.',
      })
      .expect(201);

    const accessRoleId = getResponseId(accessRoleResponse);

    const prisma = app.get(PrismaService);

    await prisma.accessRole.update({
      where: {
        id: accessRoleId,
      },
      data: {
        status: 'INACTIVE',
      },
    });

    await request(app.getHttpServer())
      .post('/api/v1/memberships')
      .send({
        personId,
        residentialComplexId,
        accessAccountId: null,
        accessRoleId,
        startDate: '2026-08-18',
      })
      .expect(409)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 409,
            code: 'ACCESS_ROLE_INACTIVE',
            path: '/api/v1/memberships',
          }),
        );
      });
  });

  it('/api/v1/memberships (POST) returns 404 when access account does not exist', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '372142',
        fullName: 'Membership No Account',
        email: 'echilderhouser@jimdo.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    const accessRoleResponse = await request(app.getHttpServer())
      .post('/api/v1/access-roles')
      .send({
        code: 'E2E-MEMBERSHIP-NO-ACCOUNT-ROLE',
        name: 'Membership No Account Role',
        description: 'Rol para prueba.',
      })
      .expect(201);

    const accessRoleId = getResponseId(accessRoleResponse);

    await request(app.getHttpServer())
      .post('/api/v1/memberships')
      .send({
        personId,
        residentialComplexId,
        accessAccountId: '00000000-0000-0000-0000-000000000000',
        accessRoleId,
        startDate: '2026-08-18',
      })
      .expect(404)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 404,
            code: 'ACCESS_ACCOUNT_NOT_FOUND',
            path: '/api/v1/memberships',
          }),
        );
      });
  });

  it('/api/v1/memberships (POST) rejects access account belonging to another person', async () => {
    const firstPersonResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '822748',
        fullName: 'Membership First Person',
        email: 'cmickleborought@yolasite.com',
      })
      .expect(201);

    const secondPersonResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '358091',
        fullName: 'Membership Second Person',
        email: 'abarszczewskiu@answers.com',
      })
      .expect(201);

    const firstPersonId = getResponseId(firstPersonResponse);
    const secondPersonId = getResponseId(secondPersonResponse);

    const accountResponse = await request(app.getHttpServer())
      .post('/api/v1/access-accounts')
      .send({
        personId: firstPersonId,
        externalAuthId: 'E2E-MEMBERSHIP-ACCOUNT-007',
      })
      .expect(201);

    const accessAccountId = getResponseId(accountResponse);

    const roleResponse = await request(app.getHttpServer())
      .post('/api/v1/access-roles')
      .send({
        code: 'E2E-MEMBERSHIP-MISMATCH',
        name: 'Membership Account Mismatch',
        description: 'Rol para prueba.',
      })
      .expect(201);

    const accessRoleId = getResponseId(roleResponse);

    await request(app.getHttpServer())
      .post('/api/v1/memberships')
      .send({
        personId: secondPersonId,
        residentialComplexId,
        accessAccountId,
        accessRoleId,
        startDate: '2026-08-18',
      })
      .expect(409)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 409,
            path: '/api/v1/memberships',
          }),
        );

        expect(typeof body.message).toBe('string');
        expect(typeof body.timestamp).toBe('string');
      });
  });

  it('/api/v1/memberships (POST) rejects duplicate active membership for the same person and residential complex', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '995173',
        fullName: 'Membership Duplicate',
        email: 'ldaniaudx@hao123.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    const firstRoleResponse = await request(app.getHttpServer())
      .post('/api/v1/access-roles')
      .send({
        code: 'E2E-MEMBERSHIP-DUPLICATE-1',
        name: 'Membership Duplicate One',
        description: 'Primer rol.',
      })
      .expect(201);

    const secondRoleResponse = await request(app.getHttpServer())
      .post('/api/v1/access-roles')
      .send({
        code: 'E2E-MEMBERSHIP-DUPLICATE-2',
        name: 'Membership Duplicate Two',
        description: 'Segundo rol.',
      })
      .expect(201);

    const firstRoleId = getResponseId(firstRoleResponse);
    const secondRoleId = getResponseId(secondRoleResponse);

    await request(app.getHttpServer())
      .post('/api/v1/memberships')
      .send({
        personId,
        residentialComplexId,
        accessAccountId: null,
        accessRoleId: firstRoleId,
        startDate: '2026-08-18',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/v1/memberships')
      .send({
        personId,
        residentialComplexId,
        accessAccountId: null,
        accessRoleId: secondRoleId,
        startDate: '2026-08-18',
      })
      .expect(409)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 409,
            path: '/api/v1/memberships',
          }),
        );

        expect(typeof body.message).toBe('string');
        expect(typeof body.timestamp).toBe('string');
      });
  });

  it('/api/v1/memberships (POST) creates a membership with an end date', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '968488',
        fullName: 'Membership End Date',
        email: 'ahillan11@reference.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    const roleResponse = await request(app.getHttpServer())
      .post('/api/v1/access-roles')
      .send({
        code: 'E2E-MEMBERSHIP-END-DATE-ROLE',
        name: 'Membership End Date Role',
        description: 'Rol para prueba.',
      })
      .expect(201);

    const accessRoleId = getResponseId(roleResponse);

    const response = await request(app.getHttpServer())
      .post('/api/v1/memberships')
      .send({
        personId,
        residentialComplexId,
        accessAccountId: null,
        accessRoleId,
        startDate: '2026-08-18',
        endDate: '2026-12-31',
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        personId,
        residentialComplexId,
        accessAccountId: null,
        accessRoleId,
        status: 'ACTIVE',
        endDate: '2026-12-31T00:00:00.000Z',
      }),
    );
  });

  it('/api/v1/memberships (POST) rejects endDate before startDate', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '964624',
        fullName: 'Membership Date Range',
        email: 'cmacdunleavy14@aol.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    const roleResponse = await request(app.getHttpServer())
      .post('/api/v1/access-roles')
      .send({
        code: 'E2E-MEMBERSHIP-DATE-RANGE-ROLE',
        name: 'Membership Date Range Role',
        description: 'Rol para prueba.',
      })
      .expect(201);

    const accessRoleId = getResponseId(roleResponse);

    await request(app.getHttpServer())
      .post('/api/v1/memberships')
      .send({
        personId,
        residentialComplexId,
        accessAccountId: null,
        accessRoleId,
        startDate: '2026-08-18',
        endDate: '2026-08-17',
      })
      .expect(400)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            path: '/api/v1/memberships',
          }),
        );
      });
  });

  it('/api/v1/memberships (POST) rejects unknown properties', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/memberships')
      .send({
        personId: '00000000-0000-0000-0000-000000000000',
        residentialComplexId,
        accessAccountId: null,
        accessRoleId: '00000000-0000-0000-0000-000000000001',
        startDate: '2026-08-18',
        unauthorizedField: 'not allowed',
      })
      .expect(400)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            code: 'BAD_REQUEST',
            path: '/api/v1/memberships',
          }),
        );
      });
  });

  it('/api/v1/memberships (POST) persists the membership relationship', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CE',
        identificationNumber: '261021',
        fullName: 'Membership Persistence',
        email: 'mskey1e@hao123.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    const roleResponse = await request(app.getHttpServer())
      .post('/api/v1/access-roles')
      .send({
        code: 'E2E-MEMBERSHIP-PERSISTENCE-ROLE',
        name: 'Membership Persistence Role',
        description: 'Rol para prueba de persistencia.',
      })
      .expect(201);

    const accessRoleId = getResponseId(roleResponse);

    const response = await request(app.getHttpServer())
      .post('/api/v1/memberships')
      .send({
        personId,
        residentialComplexId,
        accessAccountId: null,
        accessRoleId,
        startDate: '2026-08-18',
      })
      .expect(201);

    const membershipId = getResponseId(response);

    const prisma = app.get(PrismaService);

    const membership = await prisma.membership.findUnique({
      where: {
        id: membershipId,
      },
    });

    expect(membership).not.toBeNull();
    expect(membership?.personId).toBe(personId);
    expect(membership?.residentialComplexId).toBe(residentialComplexId);
    expect(membership?.accessRoleId).toBe(accessRoleId);
    expect(membership?.accessAccountId).toBeNull();
    expect(membership?.status).toBe('ACTIVE');
  });

  it('/api/v1/person-units (POST) creates a person-unit relationship', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '123456789',
        fullName: 'Juan Pérez',
        email: 'juan.e2e@example.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    const privateUnitResponse = await request(app.getHttpServer())
      .post('/api/v1/private-units')
      .send({
        residentialComplexId,
        identifier: 'E2E-UNIT-401',
        type: 'APARTMENT',
      })
      .expect(201);

    const privateUnitId = getResponseId(privateUnitResponse);

    const roleResponse = await request(app.getHttpServer())
      .post('/api/v1/role-personas')
      .send({
        code: 'E2E-ROLE-PROPIETARIO',
        name: 'Propietario',
        description: 'Persona titular de una unidad privada.',
      })
      .expect(201);

    const rolePersonaId = getResponseId(roleResponse);

    const response = await request(app.getHttpServer())
      .post('/api/v1/person-units')
      .send({
        personId,
        privateUnitId,
        rolePersonaId,
        startDate: '2024-01-15',
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        personId,
        privateUnitId,
        rolePersonaId,
        status: 'ACTIVE',
        endDate: null,
        observations: null,
      }),
    );

    const body = response.body as Record<string, unknown>;

    expect(typeof body.id).toBe('string');
    expect(typeof body.startDate).toBe('string');
  });

  it('/api/v1/person-units (POST) allows multiple active roles for the same person and unit', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '123456789',
        fullName: 'Juan Pérez',
        email: 'juan.e2e@example.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    const privateUnitResponse = await request(app.getHttpServer())
      .post('/api/v1/private-units')
      .send({
        residentialComplexId,
        identifier: 'E2E-UNIT-402',
        type: 'APARTMENT',
      })
      .expect(201);

    const privateUnitId = getResponseId(privateUnitResponse);

    const ownerRoleResponse = await request(app.getHttpServer())
      .post('/api/v1/role-personas')
      .send({
        code: 'E2E-ROLE-PROPIETARIO',
        name: 'Propietario',
        description: 'Persona titular de una unidad privada.',
      })
      .expect(201);

    const ownerRoleId = getResponseId(ownerRoleResponse);

    const residentRoleResponse = await request(app.getHttpServer())
      .post('/api/v1/role-personas')
      .send({
        code: 'E2E-ROLE-RESIDENTE',
        name: 'Residente',
        description: 'Persona que reside en una unidad privada.',
      })
      .expect(201);

    const residentRoleId = getResponseId(residentRoleResponse);

    await request(app.getHttpServer())
      .post('/api/v1/person-units')
      .send({
        personId,
        privateUnitId,
        rolePersonaId: ownerRoleId,
        startDate: '2024-01-01',
      })
      .expect(201);

    const secondResponse = await request(app.getHttpServer())
      .post('/api/v1/person-units')
      .send({
        personId,
        privateUnitId,
        rolePersonaId: residentRoleId,
        startDate: '2025-01-01',
      })
      .expect(201);

    expect(secondResponse.body).toEqual(
      expect.objectContaining({
        personId,
        privateUnitId,
        rolePersonaId: residentRoleId,
        status: 'ACTIVE',
      }),
    );
  });

  it('/api/v1/person-units (POST) returns 404 when person does not exist', async () => {
    const privateUnitResponse = await request(app.getHttpServer())
      .post('/api/v1/private-units')
      .send({
        residentialComplexId,
        identifier: 'E2E-UNIT-403',
        type: 'APARTMENT',
      })
      .expect(201);

    const privateUnitId = getResponseId(privateUnitResponse);

    const roleResponse = await request(app.getHttpServer())
      .post('/api/v1/role-personas')
      .send({
        code: 'E2E-ROLE-PROPIETARIO',
        name: 'Propietario',
        description: 'Persona titular de una unidad privada.',
      })
      .expect(201);

    const rolePersonaId = getResponseId(roleResponse);

    await request(app.getHttpServer())
      .post('/api/v1/person-units')
      .send({
        personId: '00000000-0000-0000-0000-000000000000',
        privateUnitId,
        rolePersonaId,
        startDate: '2024-01-01',
      })
      .expect(404)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 404,
            code: 'PERSON_NOT_FOUND',
            path: '/api/v1/person-units',
          }),
        );
      });
  });

  it('/api/v1/person-units (POST) returns 404 when private unit does not exist', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '123456789',
        fullName: 'Juan Pérez',
        email: 'juan.e2e@example.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    const roleResponse = await request(app.getHttpServer())
      .post('/api/v1/role-personas')
      .send({
        code: 'E2E-ROLE-PROPIETARIO',
        name: 'Propietario',
        description: 'Persona titular de una unidad privada.',
      })
      .expect(201);

    const rolePersonaId = getResponseId(roleResponse);

    await request(app.getHttpServer())
      .post('/api/v1/person-units')
      .send({
        personId,
        privateUnitId: '00000000-0000-0000-0000-000000000000',
        rolePersonaId,
        startDate: '2024-01-01',
      })
      .expect(404)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 404,
            code: 'PRIVATE_UNIT_NOT_FOUND',
            path: '/api/v1/person-units',
          }),
        );
      });
  });

  it('/api/v1/person-units (POST) returns 404 when role persona does not exist', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '123456789',
        fullName: 'Juan Pérez',
        email: 'juan.e2e@example.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    const privateUnitResponse = await request(app.getHttpServer())
      .post('/api/v1/private-units')
      .send({
        residentialComplexId,
        identifier: 'E2E-UNIT-404',
        type: 'APARTMENT',
      })
      .expect(201);

    const privateUnitId = getResponseId(privateUnitResponse);

    await request(app.getHttpServer())
      .post('/api/v1/person-units')
      .send({
        personId,
        privateUnitId,
        rolePersonaId: '00000000-0000-0000-0000-000000000000',
        startDate: '2024-01-01',
      })
      .expect(404)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 404,
            code: 'ROLE_PERSONA_NOT_FOUND',
            path: '/api/v1/person-units',
          }),
        );
      });
  });

  it('/api/v1/person-units (POST) returns 409 when role persona is inactive', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '123456789',
        fullName: 'Juan Pérez',
        email: 'juan.e2e@example.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    const privateUnitResponse = await request(app.getHttpServer())
      .post('/api/v1/private-units')
      .send({
        residentialComplexId,
        identifier: 'E2E-UNIT-405',
        type: 'APARTMENT',
      })
      .expect(201);

    const privateUnitId = getResponseId(privateUnitResponse);

    const roleResponse = await request(app.getHttpServer())
      .post('/api/v1/role-personas')
      .send({
        code: 'E2E-ROLE-INACTIVE',
        name: 'Rol Inactivo',
        description: 'Rol utilizado para prueba E2E.',
      })
      .expect(201);

    const rolePersonaId = getResponseId(roleResponse);

    const prisma = app.get(PrismaService);

    await prisma.rolePersona.update({
      where: {
        id: rolePersonaId,
      },
      data: {
        status: 'INACTIVE',
      },
    });

    await request(app.getHttpServer())
      .post('/api/v1/person-units')
      .send({
        personId,
        privateUnitId,
        rolePersonaId,
        startDate: '2024-01-01',
      })
      .expect(409)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 409,
            code: 'ROLE_PERSONA_INACTIVE',
            path: '/api/v1/person-units',
          }),
        );
      });
  });

  it('/api/v1/person-units (POST) rejects endDate before startDate', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '123456789',
        fullName: 'Juan Pérez',
        email: 'juan.e2e@example.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    const privateUnitResponse = await request(app.getHttpServer())
      .post('/api/v1/private-units')
      .send({
        residentialComplexId,
        identifier: 'E2E-UNIT-406',
        type: 'APARTMENT',
      })
      .expect(201);

    const privateUnitId = getResponseId(privateUnitResponse);

    const roleResponse = await request(app.getHttpServer())
      .post('/api/v1/role-personas')
      .send({
        code: 'E2E-ROLE-ARRENDATARIO',
        name: 'Arrendatario',
        description: 'Persona que ocupa una unidad mediante arrendamiento.',
      })
      .expect(201);

    const rolePersonaId = getResponseId(roleResponse);

    await request(app.getHttpServer())
      .post('/api/v1/person-units')
      .send({
        personId,
        privateUnitId,
        rolePersonaId,
        startDate: '2025-01-01',
        endDate: '2024-12-31',
      })
      .expect(400)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            code: 'INVALID_PERSON_UNIT_DATE_RANGE',
            path: '/api/v1/person-units',
          }),
        );
      });
  });

  it('/api/v1/person-units (POST) creates a finished-dated relationship with observations', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '123456789',
        fullName: 'Carlos Ruiz',
        email: 'carlos.e2e@example.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    const privateUnitResponse = await request(app.getHttpServer())
      .post('/api/v1/private-units')
      .send({
        residentialComplexId,
        identifier: 'E2E-UNIT-407',
        type: 'APARTMENT',
      })
      .expect(201);

    const privateUnitId = getResponseId(privateUnitResponse);

    const roleResponse = await request(app.getHttpServer())
      .post('/api/v1/role-personas')
      .send({
        code: 'E2E-ROLE-ARRENDATARIO',
        name: 'Arrendatario',
        description: 'Persona que ocupa una unidad mediante arrendamiento.',
      })
      .expect(201);

    const rolePersonaId = getResponseId(roleResponse);

    const response = await request(app.getHttpServer())
      .post('/api/v1/person-units')
      .send({
        personId,
        privateUnitId,
        rolePersonaId,
        startDate: '2022-01-01',
        endDate: '2024-12-31',
        observations: 'Contrato de arrendamiento finalizado.',
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        personId,
        privateUnitId,
        rolePersonaId,
        status: 'ACTIVE',
        observations: 'Contrato de arrendamiento finalizado.',
      }),
    );
  });

  it('/api/v1/person-units (POST) rejects unknown properties', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/person-units')
      .send({
        personId: '00000000-0000-0000-0000-000000000000',
        privateUnitId: '00000000-0000-0000-0000-000000000001',
        rolePersonaId: '00000000-0000-0000-0000-000000000002',
        startDate: '2024-01-01',
        unauthorizedField: 'not allowed',
      })
      .expect(400);

    const body = response.body as Record<string, unknown>;

    expect(body).toEqual(
      expect.objectContaining({
        statusCode: 400,
        code: 'BAD_REQUEST',
        path: '/api/v1/person-units',
      }),
    );
  });

  it('/api/v1/subscriptions (POST) creates a monthly subscription', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '123456789',
        fullName: 'Subscription Monthly Person',
        email: 'subscription-monthly@example.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    const planCode = `E2E-SUB-MONTHLY-${Date.now()}`;

    const planResponse = await request(app.getHttpServer())
      .post('/api/v1/plans')
      .send({
        code: planCode,
        name: 'Subscription Monthly Plan',
        maxComplexes: 1,
        maxUnits: 100,
        monthlyPrice: 50000,
        quarterlyPrice: 140000,
        yearlyPrice: 500000,
      })
      .expect(201);

    const planId = getResponseId(planResponse);

    const response = await request(app.getHttpServer())
      .post('/api/v1/subscriptions')
      .send({
        personId,
        planId,
        billingCycle: 'MONTHLY',
        startDate: '2026-08-14T00:00:00.000Z',
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        personId,
        planId,
        billingCycle: 'MONTHLY',
        price: 50000,
        startDate: '2026-08-14T00:00:00.000Z',
        endDate: null,
        nextBillingDate: '2026-09-14T00:00:00.000Z',
        status: 'ACTIVE',
      }),
    );

    expect(typeof getResponseId(response)).toBe('string');
  });

  it('/api/v1/subscriptions (POST) creates a quarterly subscription', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '987654321',
        fullName: 'Subscription Quarterly Person',
        phone: '3001234567',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    const planResponse = await request(app.getHttpServer())
      .post('/api/v1/plans')
      .send({
        code: `E2E-SUB-QUARTERLY-${Date.now()}`,
        name: 'Subscription Quarterly Plan',
        maxComplexes: 1,
        maxUnits: 100,
        monthlyPrice: 50000,
        quarterlyPrice: 140000,
        yearlyPrice: 500000,
      })
      .expect(201);

    const planId = getResponseId(planResponse);

    const response = await request(app.getHttpServer())
      .post('/api/v1/subscriptions')
      .send({
        personId,
        planId,
        billingCycle: 'QUARTERLY',
        startDate: '2026-08-14T00:00:00.000Z',
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        personId,
        planId,
        billingCycle: 'QUARTERLY',
        price: 140000,
        startDate: '2026-08-14T00:00:00.000Z',
        endDate: null,
        nextBillingDate: '2026-11-14T00:00:00.000Z',
        status: 'ACTIVE',
      }),
    );
  });

  it('/api/v1/subscriptions (POST) creates a yearly subscription', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'TI',
        identificationNumber: '456789123',
        fullName: 'Subscription Yearly Person',
        email: 'subscription-yearly@example.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    const planResponse = await request(app.getHttpServer())
      .post('/api/v1/plans')
      .send({
        code: `E2E-SUB-YEARLY-${Date.now()}`,
        name: 'Subscription Yearly Plan',
        maxComplexes: 1,
        maxUnits: 100,
        monthlyPrice: 50000,
        quarterlyPrice: 140000,
        yearlyPrice: 500000,
      })
      .expect(201);

    const planId = getResponseId(planResponse);

    const response = await request(app.getHttpServer())
      .post('/api/v1/subscriptions')
      .send({
        personId,
        planId,
        billingCycle: 'YEARLY',
        startDate: '2026-08-14T00:00:00.000Z',
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        personId,
        planId,
        billingCycle: 'YEARLY',
        price: 500000,
        startDate: '2026-08-14T00:00:00.000Z',
        endDate: null,
        nextBillingDate: '2027-08-14T00:00:00.000Z',
        status: 'ACTIVE',
      }),
    );
  });

  it('/api/v1/subscriptions (POST) returns 404 when person does not exist', async () => {
    const planResponse = await request(app.getHttpServer())
      .post('/api/v1/plans')
      .send({
        code: `E2E-SUB-NO-PERSON-${Date.now()}`,
        name: 'Subscription Plan',
        maxComplexes: 1,
        maxUnits: 100,
        monthlyPrice: 50000,
        quarterlyPrice: 140000,
        yearlyPrice: 500000,
      })
      .expect(201);

    const planId = getResponseId(planResponse);

    await request(app.getHttpServer())
      .post('/api/v1/subscriptions')
      .send({
        personId: '00000000-0000-0000-0000-000000000000',
        planId,
        billingCycle: 'MONTHLY',
        startDate: '2026-08-14T00:00:00.000Z',
      })
      .expect(404)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 404,
            code: 'PERSON_NOT_FOUND',
            path: '/api/v1/subscriptions',
          }),
        );

        expect(typeof body.message).toBe('string');
        expect(typeof body.timestamp).toBe('string');
      });
  });

  it('/api/v1/subscriptions (POST) returns 404 when plan does not exist', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '111222333',
        fullName: 'Subscription No Plan Person',
        email: 'subscription-no-plan@example.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    await request(app.getHttpServer())
      .post('/api/v1/subscriptions')
      .send({
        personId,
        planId: '00000000-0000-0000-0000-000000000000',
        billingCycle: 'MONTHLY',
        startDate: '2026-08-14T00:00:00.000Z',
      })
      .expect(404)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 404,
            code: 'PLAN_NOT_FOUND',
            path: '/api/v1/subscriptions',
          }),
        );

        expect(typeof body.message).toBe('string');
        expect(typeof body.timestamp).toBe('string');
      });
  });

  it('/api/v1/subscriptions (POST) returns 400 when plan is inactive', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '555666777',
        fullName: 'Subscription Inactive Plan Person',
        email: 'subscription-inactive@example.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    const planResponse = await request(app.getHttpServer())
      .post('/api/v1/plans')
      .send({
        code: `E2E-SUB-INACTIVE-${Date.now()}`,
        name: 'Inactive Subscription Plan',
        maxComplexes: 1,
        maxUnits: 100,
        monthlyPrice: 50000,
        quarterlyPrice: 140000,
        yearlyPrice: 500000,
      })
      .expect(201);

    const planId = getResponseId(planResponse);

    const prisma = app.get(PrismaService);

    await prisma.plan.update({
      where: {
        id: planId,
      },
      data: {
        status: 'INACTIVE',
      },
    });

    await request(app.getHttpServer())
      .post('/api/v1/subscriptions')
      .send({
        personId,
        planId,
        billingCycle: 'MONTHLY',
        startDate: '2026-08-14T00:00:00.000Z',
      })
      .expect(400)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            code: 'PLAN_INACTIVE',
            path: '/api/v1/subscriptions',
          }),
        );

        expect(typeof body.message).toBe('string');
        expect(typeof body.timestamp).toBe('string');
      });
  });

  it('/api/v1/subscriptions (POST) returns 409 when person already has an active subscription', async () => {
    const personResponse = await request(app.getHttpServer())
      .post('/api/v1/people')
      .send({
        identificationType: 'CC',
        identificationNumber: '123456789',
        fullName: 'Subscription Duplicate Person',
        email: 'subscription-duplicate@example.com',
      })
      .expect(201);

    const personId = getResponseId(personResponse);

    const firstPlanResponse = await request(app.getHttpServer())
      .post('/api/v1/plans')
      .send({
        code: `E2E-SUB-FIRST-${Date.now()}`,
        name: 'First Subscription Plan',
        maxComplexes: 1,
        maxUnits: 100,
        monthlyPrice: 50000,
        quarterlyPrice: 140000,
        yearlyPrice: 500000,
      })
      .expect(201);

    const secondPlanResponse = await request(app.getHttpServer())
      .post('/api/v1/plans')
      .send({
        code: `E2E-SUB-SECOND-${Date.now()}`,
        name: 'Second Subscription Plan',
        maxComplexes: 1,
        maxUnits: 100,
        monthlyPrice: 60000,
        quarterlyPrice: 160000,
        yearlyPrice: 600000,
      })
      .expect(201);

    const firstPlanId = getResponseId(firstPlanResponse);
    const secondPlanId = getResponseId(secondPlanResponse);

    await request(app.getHttpServer())
      .post('/api/v1/subscriptions')
      .send({
        personId,
        planId: firstPlanId,
        billingCycle: 'MONTHLY',
        startDate: '2026-08-14T00:00:00.000Z',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/v1/subscriptions')
      .send({
        personId,
        planId: secondPlanId,
        billingCycle: 'MONTHLY',
        startDate: '2026-08-14T00:00:00.000Z',
      })
      .expect(409)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 409,
            code: 'ACTIVE_SUBSCRIPTION_ALREADY_EXISTS',
            path: '/api/v1/subscriptions',
          }),
        );

        expect(typeof body.message).toBe('string');
        expect(typeof body.timestamp).toBe('string');
      });
  });

  it('/api/v1/auth/me (GET) rejects missing authentication', () => {
    return request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .expect(401)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 401,
            code: 'UNAUTHORIZED',
            path: '/api/v1/auth/me',
          }),
        );
      });
  });

  it('/api/v1/auth/me (GET) rejects invalid authentication header', () => {
    return request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', 'Basic invalid-token')
      .expect(401)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 401,
            code: 'UNAUTHORIZED',
            path: '/api/v1/auth/me',
          }),
        );
      });
  });

  it('/api/v1/auth/me (GET) rejects invalid bearer token', () => {
    return request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 401,
            code: 'UNAUTHORIZED',
            path: '/api/v1/auth/me',
          }),
        );
      });
  }, 15000);

  it('/api/v1/auth/me (GET) accepts valid Supabase authentication', async () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
    const testEmail = process.env.FARO_TEST_EMAIL;
    const testPassword = process.env.FARO_TEST_PASSWORD;

    if (!supabaseUrl || !supabasePublishableKey) {
      throw new Error(
        'SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are required for the authentication E2E test',
      );
    }

    if (!testEmail || !testPassword) {
      throw new Error(
        'FARO_TEST_EMAIL and FARO_TEST_PASSWORD are required for the authentication E2E test',
      );
    }

    const supabase = createClient(supabaseUrl, supabasePublishableKey);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (error || !data.session) {
      throw new Error(
        `Supabase test authentication failed: ${error?.message ?? 'No session returned'}`,
      );
    }

    const response = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${data.session.access_token}`)
      .expect(200);

    expect(response.body).toEqual({
      userId: data.user.id,
      email: data.user.email ?? null,
    });
  }, 15000);
});
