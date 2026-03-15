import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './modules/health/health.module';
import { HealthController } from './modules/health/interface/controllers/health.controller';
import { HealthService } from './modules/health/application/services/health.service';
import { RequestIdMiddleware } from './core/middleware/request-id.middleware';

@Module({
  imports: [UsersModule, HealthModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
