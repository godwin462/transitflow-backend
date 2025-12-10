import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import type { ValidationError } from 'class-validator';

const port = process.env.PORT ?? 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('/api/v1');
  // app.useGlobalPipes(new ValidationPipe());
  app.useGlobalPipes(
    new ValidationPipe({
      // ... other ValidationPipe options
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        // Extract the first error message or combine them into a single string
        console.log(validationErrors);
        const firstErrorMessage =
          validationErrors.length > 0 && validationErrors[0].constraints
            ? Object.values(validationErrors[0].constraints).join(' ')
            : 'Validation failed'; // Default message if no errors

        return new BadRequestException(firstErrorMessage);
      },
    }),
  );

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
