/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IApiResponse } from 'src/common/interfaces/api-response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  IApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IApiResponse<T>> {
    return next.handle().pipe(
      map((result: unknown) => {
        const isObject = result !== null && typeof result === 'object';
        const responseObj = isObject ? (result as Record<string, any>) : {};

        const isWrapped =
          responseObj.result !== undefined || responseObj.data !== undefined;

        return {
          success: true,
          message: responseObj.message || 'Operation successful',
          data: isWrapped ? (responseObj.result ?? responseObj.data) : result,
          meta: responseObj.meta || undefined,
          timestamp: new Date().toISOString(),
        } as IApiResponse<T>;
      }),
    );
  }
}
