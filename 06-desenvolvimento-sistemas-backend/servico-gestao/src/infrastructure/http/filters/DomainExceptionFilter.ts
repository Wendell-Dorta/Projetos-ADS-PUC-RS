import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from '../../../domain/errors/DomainErrors';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.statusCode || HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      error: exception.name,
      message: exception.message,
    });
  }
}
