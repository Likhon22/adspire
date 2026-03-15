import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import { GlobalExceptionFilter } from './core/filters/http-exception.filter';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './core/logger/winston.config';
import { LoggingInterceptor } from './core/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
