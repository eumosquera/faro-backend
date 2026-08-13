import { ValidationPipe, VersioningType } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { createClient } from '@supabase/supabase-js';
import request from 'supertest';
import { afterEach } from '@jest/globals';
import { AppModule } from './../src/app.module';
import { GlobalExceptionFilter } from './../src/core/errors/global-exception.filter';
import { CreateResidentialComplexUseCase } from './../src/modules/structure/application/use-cases/create-residential-complex/create-residential-complex.use-case';
describe('Application (e2e)', () => {
  let app: INestApplication;
  let residentialComplexId: string;

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

    const createResidentialComplexUseCase = app.get(CreateResidentialComplexUseCase);

    const residentialComplex = await createResidentialComplexUseCase.execute({
      name: 'E2E Residential Complex',
      address: 'E2E Test Address',
      city: 'Cali',
    });

    residentialComplexId = residentialComplex.id;
  });

  afterEach(async () => {
    await app.close();
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
