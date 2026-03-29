import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import { GlobalExceptionFilter } from './core/filters/http-exception.filter';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './core/logger/winston.config';
import { LoggingInterceptor } from './core/interceptors/logging.interceptor';
import { ConfigType } from '@nestjs/config';
import { appConfig } from './core/config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });
  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(config.port, () => {
    console.log(
      `Server listening on port ${config.port} in ${config.env} mode`,
    );
  });
}
bootstrap();
