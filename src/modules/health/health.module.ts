import { Module } from '@nestjs/common';
import { HealthController } from './interface/controllers/health.controller';
import { HealthService } from './application/services/health.service';

@Module({
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
