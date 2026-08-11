import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';

import { ApplicationError } from './application-error';
import type { ErrorResponse } from './error-response';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();

    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const errorResponse = this.createErrorResponse(exception, request);

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private createErrorResponse(exception: unknown, request: Request): ErrorResponse {
    const timestamp = new Date().toISOString();

    if (exception instanceof ApplicationError) {
      return {
        statusCode: exception.statusCode,
        code: exception.code,
        message: exception.message,
        timestamp,
        path: request.url,
      };
    }

    if (exception instanceof HttpException) {
      return this.createHttpExceptionResponse(exception, request, timestamp);
    }

    this.logger.error(
      `Unhandled exception on ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      timestamp,
      path: request.url,
    };
  }

  private createHttpExceptionResponse(
    exception: HttpException,
    request: Request,
    timestamp: string,
  ): ErrorResponse {
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const message = this.extractMessage(exceptionResponse);
    const code = this.getHttpErrorCode(statusCode);

    return {
      statusCode,
      code,
      message,
      timestamp,
      path: request.url,
    };
  }

  private extractMessage(response: string | object): string {
    if (typeof response === 'string') {
      return response;
    }

    if (!('message' in response)) {
      return 'Request failed';
    }

    if (typeof response.message === 'string') {
      return response.message;
    }

    if (
      Array.isArray(response.message) &&
      response.message.every((message) => typeof message === 'string')
    ) {
      return response.message.join(', ');
    }

    return 'Request failed';
  }

  private getHttpErrorCode(statusCode: number): string {
    const httpErrorCodes: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
      [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
      [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
      [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
      [HttpStatus.CONFLICT]: 'CONFLICT',
    };

    return httpErrorCodes[statusCode] ?? 'HTTP_ERROR';
  }
}
