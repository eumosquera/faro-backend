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

    app.useGlobalFilters(new GlobalExceptionFilter());

    await app.init();
  });

  it('/unknown-route (GET)', () => {
    return request(app.getHttpServer())
      .get('/unknown-route')
      .expect(404)
      .expect((response) => {
        const body = response.body as Record<string, unknown>;

        expect(body).toEqual(
          expect.objectContaining({
            statusCode: 404,
            code: 'NOT_FOUND',
            message: 'Cannot GET /unknown-route',
            path: '/unknown-route',
          }),
        );

        expect(typeof body.timestamp).toBe('string');
      });
  });
});
