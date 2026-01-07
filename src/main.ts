import 'dotenv/config';
import { NestFactory, PartialGraphHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import type { ValidationError } from 'class-validator';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter';
import { createValidationErrorResponse } from './common/helpers/validation-error.helper';
import { json, urlencoded } from 'express';
import fs from 'fs';

const port = process.env.PORT ?? 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    abortOnError: false,
  });
  app.enableCors();
  app.setGlobalPrefix('/api/v1');
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        // Log the full validation errors for debugging
        console.log(
          'Validation Errors:',
          JSON.stringify(validationErrors, null, 2),
        );

        // Use the helper to extract all errors with full property paths
        const errorResponse = createValidationErrorResponse(validationErrors);

        return new BadRequestException(errorResponse);
      },
    }),
  );
  app.useGlobalFilters(new PrismaClientExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('TransitFlow API')
    .setDescription('TransitFlow API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port);
}
bootstrap()
  .then(() => console.log(`Server running at http://localhost:${port}`))
  .catch((err) => {
    fs.writeFileSync('graph.json', PartialGraphHost.toString() ?? '');
    process.exit(1);
  });
