import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Saúde')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check do ServicoFaturamento' })
  check() {
    return {
      status: 'ok',
      servico: 'servico-faturamento',
      banco: 'faturamento.db (SQLite)',
      timestamp: new Date().toISOString(),
    };
  }
}
