import { Injectable } from '@nestjs/common';
import { IApiResponse } from 'src/common/interfaces/api-response.interface';

@Injectable()
export class HealthService {
  getHealthStatus(): Partial<IApiResponse<any>> {
    const data = {
      status: 'up',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      service: 'Adspire API',
    };
    return {
      message: 'System is healthy',
      data: data,
    };
  }
}
