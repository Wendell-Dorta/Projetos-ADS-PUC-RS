import { Controller, Get, Post, Param, Body, ParseIntPipe, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ConsultarPlanoAtivoUseCase } from '../../application/use-cases/ConsultarPlanoAtivoUseCase';
import { InvalidarCachePlanoUseCase, EventoPagamentoConsumidorPayload } from '../../application/use-cases/InvalidarCachePlanoUseCase';
import { IPlanosAtivosCache } from '../../domain/services/IPlanosAtivosCache';

@ApiTags('Planos Ativos')
@Controller('planosativos')
export class PlanosAtivosController {
  private readonly logger = new Logger(PlanosAtivosController.name);

  constructor(
    private readonly consultarPlanoAtivoUseCase: ConsultarPlanoAtivoUseCase,
    private readonly invalidarCachePlanoUseCase: InvalidarCachePlanoUseCase,
    private readonly cache: IPlanosAtivosCache,
  ) {}

  @Get(':codass')
  @ApiOperation({
    summary: 'Verificar se plano/assinatura permanece ativo',
    description:
      'Retorna boolean (true ou false) indicando se a assinatura está ativa. Utiliza cache interno de alto desempenho (Cache-Aside Pattern).',
  })
  @ApiParam({
    name: 'codass',
    description: 'Código da assinatura',
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'Booleano indicando status da assinatura (true ou false)',
    schema: { type: 'boolean' },
  })
  async consultar(@Param('codass', ParseIntPipe) codass: number): Promise<boolean> {
    const result = await this.consultarPlanoAtivoUseCase.execute(codass);
    if (result.isLeft()) {
      throw result.value;
    }
    return result.value;
  }

  @Get('cache/metricas')
  @ApiOperation({
    summary: 'Obter métricas de performance do Cache',
    description: 'Retorna contagem de Cache Hits, Cache Misses, Taxa de Acerto (Hit Ratio) e tamanho atual.',
  })
  obterMetricas() {
    return {
      servico: 'servico-planos-ativos',
      metricas: this.cache.getStats(),
      timestamp: new Date().toISOString(),
    };
  }

  @EventPattern('PagamentoPlanoServicoPlanosAtivos')
  async processarEventoPagamento(@Payload() data: EventoPagamentoConsumidorPayload) {
    this.logger.log(
      `[EVENTO RECEBIDO - RabbitMQ] PagamentoPlanoServicoPlanosAtivos: Assinatura=${data.codAss}, invalidando cache...`,
    );
    const removido = this.invalidarCachePlanoUseCase.execute(data);
    this.logger.log(
      `[ServicoPlanosAtivos] Invalidação de cache concluída para codAss ${data.codAss}. Removido: ${removido}`,
    );
    return { sucesso: true, invalidado: removido };
  }

  @Post('eventos/pagamento')
  @ApiOperation({
    summary: 'Webhook síncrono/fallback para invalidação de cache',
    description: 'Endpoint alternativo para receber evento de pagamento quando executando sem RabbitMQ.',
  })
  async processarWebhookPagamento(@Body() data: EventoPagamentoConsumidorPayload) {
    this.logger.log(
      `[EVENTO RECEBIDO - HTTP Webhook] PagamentoPlanoServicoPlanosAtivos: Assinatura=${data.codAss}`,
    );
    const removido = this.invalidarCachePlanoUseCase.execute(data);
    return {
      sucesso: true,
      mensagem: `Cache para a assinatura ${data.codAss} invalidado com sucesso.`,
      invalidado: removido,
    };
  }
}
