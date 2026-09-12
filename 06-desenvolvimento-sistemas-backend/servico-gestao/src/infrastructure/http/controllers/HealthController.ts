import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthCheckService, HealthCheck, HealthIndicatorResult } from '@nestjs/terminus';
import { PrismaService } from '../../database/prisma.service';

@ApiTags('Health Check & Observabilidade')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Verificar status de integridade do sistema',
    description: 'Checa a conectividade em tempo real com o banco de dados SQLite.',
  })
  @ApiResponse({
    status: 200,
    description: 'Aplicação e banco de dados estão operacionais (Status UP).',
  })
  async check() {
    return this.health.check([
      async (): Promise<HealthIndicatorResult> => {
        try {
          await this.prisma.$queryRaw`SELECT 1`;
          return { database: { status: 'up' } };
        } catch (error: any) {
          return { database: { status: 'down', message: error.message } };
        }
      },
    ]);
  }
}
