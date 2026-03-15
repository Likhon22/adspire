import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { IErrorResponse } from 'src/common/interfaces/error-response.interface';
import { getHeaderSafely } from 'src/common/utils/request.utils';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = getHeaderSafely(request, 'x-request-id');
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorType = 'System Error';
    let validationErrors: string[] | undefined = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const payload = exceptionResponse as Record<string, unknown>;
        const resMessage = payload.message;
        const resError = payload.error;

        if (typeof resError === 'string') {
          errorType = resError;
        } else {
          errorType = exception.name;
        }

        if (Array.isArray(resMessage)) {
          message = 'Validation failed';
          validationErrors = resMessage as string[];
        } else if (typeof resMessage === 'string') {
          message = resMessage;
        } else {
          message = exception.message;
        }
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        errorType = exception.name;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errorType = exception.name;
    }

    const errorResponse: IErrorResponse = {
      success: false,
      statusCode: status,
      message,
      errorType,
      ...(validationErrors && { errors: validationErrors }),
      timestamp: new Date().toISOString(),
      path: request.url,
    };
    const logMessage = `[${requestId}] ${request.method} ${request.url} ${status} - ${message}`;

    if (Number(status) >= 500) {
      this.logger.error(
        logMessage,
        exception instanceof Error ? exception.stack : 'No stack trace',
      );
    } else if (Number(status) >= 400) {
      this.logger.warn(logMessage);
    } else {
      this.logger.log(logMessage);
    }

    response.status(status).json(errorResponse);
  }
}
