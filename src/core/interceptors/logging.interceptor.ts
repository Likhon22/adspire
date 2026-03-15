import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';
import { getHeaderSafely } from 'src/common/utils/request.utils';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, originalUrl } = request;
    const startTime = Date.now();
    return next.handle().pipe(
      tap(() => {
        const statusCode = response.statusCode;
        const duration = Date.now() - startTime;
        const requestId = getHeaderSafely(request, 'x-request-id');
        this.logger.log(
          `[${requestId}] ${method} ${originalUrl} ${statusCode} - ${duration}ms`,
        );
      }),
    );
  }
}
