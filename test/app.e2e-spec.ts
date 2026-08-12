import { ValidationPipe, VersioningType } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { createClient } from '@supabase/supabase-js';
import request from 'supertest';

import { AppModule } from './../src/app.module';
import { GlobalExceptionFilter } from './../src/core/errors/global-exception.filter';

describe('Application (e2e)', () => {
  let app: INestApplication;

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
  });

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
  });
});
