import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Project Faro API')
    .setDescription(
      'API for the administration and operation of residential communities and horizontal property.',
    )
    .setVersion('1.0')
    .build();

  const documentFactory = (): ReturnType<typeof SwaggerModule.createDocument> =>
    SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, documentFactory);
}
