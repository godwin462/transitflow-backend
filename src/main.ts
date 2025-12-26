import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import type { ValidationError } from 'class-validator';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter';

const port = process.env.PORT ?? 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        // console.log(validationErrors);
        const children = validationErrors[0].children;
        const firstErrorMessage =
          validationErrors.length > 0 && validationErrors[0].constraints
            ? Object.values(validationErrors[0].constraints).join(', ')
            : children
              ? children[0].constraints?.whitelistValidation
              : validationErrors[0].constraints?.isEnum ||
                'Payload validation failed';

        // console.log('Validation Error:', '');
        return new BadRequestException(firstErrorMessage);
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
  .catch((err) => console.error(err));
