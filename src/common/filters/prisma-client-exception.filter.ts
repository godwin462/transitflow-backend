import {
  ArgumentsHost,
  Catch,
  // ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { Prisma } from 'generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const message = exception.message.replace(/\n/g, '');

    switch (exception.code) {
      case 'P2002': {
        // console.log(
        //   (exception.meta?.driverAdapterError as DriverAdapterError)?.cause,
        // );
        const status = HttpStatus.CONFLICT;
        // P2002 usually provides the target field in meta
        const target =
          (
            exception.meta?.driverAdapterError as DriverAdapterError
          )?.cause?.constraint?.fields?.join(', ') || 'field';
        response.status(status).json({
          statusCode: status,
          message: `Unique constraint failed on the: ${target}`,
          error: 'Conflict',
        });
        break;
      }
      case 'P2025': {
        const status = HttpStatus.NOT_FOUND;
        response.status(status).json({
          statusCode: status,
          message: 'Record not found',
          error: 'Not Found',
        });
        break;
      }
      case 'P2022': {
        console.log(exception.meta);
        const status = HttpStatus.BAD_REQUEST;
        response.status(status).json({
          statusCode: status,
          message: (exception.meta?.driverAdapterError as DriverAdapterError)
            ?.cause.originalMessage, //'No images provided',
          error: 'Bad Request',
        });
        break;
      }
      case 'P1017': {
        // database not connection unsuccessful
        console.log(exception.meta);
        const status = HttpStatus.BAD_REQUEST;
        response.status(status).json({
          statusCode: status,
          message: 'Connection unavailable',
          error: 'Bad Request',
        });
        break;
      }
      default:
        console.log(exception.code);
        // default 500 server error
        super.catch(exception, host);
        break;
    }
  }
}
