import { ValidationPipe, VersioningType } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
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
});
