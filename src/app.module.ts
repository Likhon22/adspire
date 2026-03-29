import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './modules/health/health.module';

import { RequestIdMiddleware } from './core/middleware/request-id.middleware';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './core/config/app.config';
import { validate } from './core/config/env.validation';
@Module({
  imports: [
    UsersModule,
    HealthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validate,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
