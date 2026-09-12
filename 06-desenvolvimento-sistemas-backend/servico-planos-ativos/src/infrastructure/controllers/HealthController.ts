import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Saúde')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check do ServicoPlanosAtivos' })
  check() {
    return {
      status: 'ok',
      servico: 'servico-planos-ativos',
      cache: 'InMemoryPlanosCache (TTL 300s)',
      timestamp: new Date().toISOString(),
    };
  }
}
