import { Controller, Get, Post, Param, Body, ParseIntPipe, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CriarAssinaturaUseCase } from '../../../application/use-cases/CriarAssinaturaUseCase';
import { ListarAssinaturasPorTipoUseCase } from '../../../application/use-cases/ListarAssinaturasPorTipoUseCase';
import { ListarAssinaturasPorClienteUseCase } from '../../../application/use-cases/ListarAssinaturasPorClienteUseCase';
import { ListarAssinaturasPorPlanoUseCase } from '../../../application/use-cases/ListarAssinaturasPorPlanoUseCase';
import { ProcessarPagamentoAssinaturaUseCase } from '../../../application/use-cases/ProcessarPagamentoAssinaturaUseCase';
import { VerificarAssinaturaAtivaUseCase } from '../../../application/use-cases/VerificarAssinaturaAtivaUseCase';
import { AssinaturaMapper } from '../../../adapters/mappers/AssinaturaMapper';
import { AssinaturaOutputDTO } from '../../../application/dtos/AssinaturaDTOs';
import { CriarAssinaturaRequestDTO } from '../dtos/CriarAssinaturaRequestDTO';
import { PagamentoEventoDto } from '../dtos/PagamentoEventoDto';
import { AssinaturaResponseSwaggerDTO, ErrorResponseSwaggerDTO } from '../dtos/SwaggerResponseDTOs';

@ApiTags('Assinaturas')
@Controller(['gerenciaplanos', 'gestao'])
export class AssinaturaController {
  private readonly logger = new Logger(AssinaturaController.name);

  constructor(
    private readonly criarAssinaturaUseCase: CriarAssinaturaUseCase,
    private readonly listarAssinaturasPorTipoUseCase: ListarAssinaturasPorTipoUseCase,
    private readonly listarAssinaturasPorClienteUseCase: ListarAssinaturasPorClienteUseCase,
    private readonly listarAssinaturasPorPlanoUseCase: ListarAssinaturasPorPlanoUseCase,
    private readonly processarPagamentoUseCase: ProcessarPagamentoAssinaturaUseCase,
    private readonly verificarAssinaturaAtivaUseCase: VerificarAssinaturaAtivaUseCase,
  ) {}

  @Post('assinaturas')
  @ApiOperation({
    summary: 'Criar nova assinatura',
    description:
      'Cadastra uma nova assinatura vinculando um cliente a um plano, iniciando o período de fidelidade.',
  })
  @ApiResponse({
    status: 201,
    description: 'Assinatura criada com sucesso (HTTP 201 Created).',
    type: AssinaturaResponseSwaggerDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados de entrada inválidos (HTTP 400 Bad Request).',
    type: ErrorResponseSwaggerDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente ou Plano informado não foi encontrado (HTTP 404 Not Found).',
    type: ErrorResponseSwaggerDTO,
  })
  async criar(@Body() dto: CriarAssinaturaRequestDTO): Promise<AssinaturaOutputDTO> {
    const result = await this.criarAssinaturaUseCase.execute({
      codCli: dto.codCli,
      codPlano: dto.codPlano,
      custoFinal: dto.custoFinal,
      descricao: dto.descricao || '',
    });
    if (result.isLeft()) {
      throw result.value;
    }
    return AssinaturaMapper.toDTO(result.value);
  }

  @Get('assinaturas/:tipo')
  @ApiOperation({
    summary: 'Listar assinaturas por tipo de status',
    description:
      'Filtra assinaturas cadastradas por tipo: TODOS, ATIVOS ou CANCELADOS (calculado dinamicamente por pagamentos <= 30 dias).',
  })
  @ApiParam({
    name: 'tipo',
    description: 'Filtro de status: TODOS, ATIVOS ou CANCELADOS',
    example: 'ATIVOS',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de assinaturas filtrada com sucesso (HTTP 200 OK).',
    type: [AssinaturaResponseSwaggerDTO],
  })
  @ApiResponse({
    status: 400,
    description: 'Tipo de filtro inválido (HTTP 400 Bad Request).',
    type: ErrorResponseSwaggerDTO,
  })
  async listarPorTipo(@Param('tipo') tipo: string): Promise<AssinaturaOutputDTO[]> {
    const result = await this.listarAssinaturasPorTipoUseCase.execute(tipo);
    if (result.isLeft()) {
      throw result.value;
    }
    return result.value.map(AssinaturaMapper.toDTO);
  }

  @Get(['asscli/:codcli', 'assinaturascliente/:codcli'])
  @ApiOperation({
    summary: 'Listar assinaturas por cliente',
    description: 'Recupera o histórico de todas as assinaturas vinculadas a um cliente específico.',
  })
  @ApiParam({
    name: 'codcli',
    description: 'Código único do cliente',
    example: 2,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de assinaturas do cliente retornada com sucesso (HTTP 200 OK).',
    type: [AssinaturaResponseSwaggerDTO],
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente consultado não foi encontrado (HTTP 404 Not Found).',
    type: ErrorResponseSwaggerDTO,
  })
  async listarPorCliente(
    @Param('codcli', ParseIntPipe) codcli: number,
  ): Promise<AssinaturaOutputDTO[]> {
    const result = await this.listarAssinaturasPorClienteUseCase.execute(codcli);
    if (result.isLeft()) {
      throw result.value;
    }
    return result.value.map(AssinaturaMapper.toDTO);
  }

  @Get(['assinaturaplano/:codplano', 'assinaturasplano/:codplano'])
  @ApiOperation({
    summary: 'Listar assinaturas por plano',
    description:
      'Recupera todas as assinaturas ativas e canceladas associadas a um plano específico.',
  })
  @ApiParam({
    name: 'codplano',
    description: 'Código único do plano',
    example: 2,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de assinaturas do plano retornada com sucesso (HTTP 200 OK).',
    type: [AssinaturaResponseSwaggerDTO],
  })
  @ApiResponse({
    status: 404,
    description: 'Plano consultado não foi encontrado (HTTP 404 Not Found).',
    type: ErrorResponseSwaggerDTO,
  })
  async listarPorPlano(
    @Param('codplano', ParseIntPipe) codplano: number,
  ): Promise<AssinaturaOutputDTO[]> {
    const result = await this.listarAssinaturasPorPlanoUseCase.execute(codplano);
    if (result.isLeft()) {
      throw result.value;
    }
    return result.value.map(AssinaturaMapper.toDTO);
  }

  @Get(['assinaturas/valida/:codass', 'assinaturas/status/:codass'])
  @ApiOperation({
    summary: 'Verificar se assinatura está ativa',
    description:
      'Retorna se uma assinatura específica permanece ativa ou cancelada (usado pelo ServicoPlanosAtivos).',
  })
  @ApiParam({
    name: 'codass',
    description: 'Código único da assinatura',
    example: 1,
  })
  async verificarValidade(@Param('codass', ParseIntPipe) codass: number) {
    const result = await this.verificarAssinaturaAtivaUseCase.execute(codass);
    if (result.isLeft()) {
      throw result.value;
    }
    return result.value;
  }

  @EventPattern('PagamentoPlanoServicoGestao')
  async processarEventoPagamento(@Payload() data: PagamentoEventoDto) {
    this.logger.log(`[EVENTO RECEBIDO - RabbitMQ] PagamentoPlanoServicoGestao: Assinatura=${data.codAss}, Valor=${data.valorPago}, Data=${data.dia}/${data.mes}/${data.ano}`);
    const result = await this.processarPagamentoUseCase.execute(data);
    if (result.isLeft()) {
      this.logger.error(`[ServicoGestao] Erro ao atualizar assinatura ${data.codAss}: ${result.value.message}`);
      return { sucesso: false, erro: result.value.message };
    }
    this.logger.log(`[ServicoGestao] Validade da assinatura ${data.codAss} atualizada com sucesso no banco gestao.db!`);
    return { sucesso: true, assinatura: AssinaturaMapper.toDTO(result.value) };
  }

  @Post('eventos/pagamento')
  @ApiOperation({
    summary: 'Webhook síncrono/fallback para evento de pagamento',
    description: 'Endpoint alternativo para receber evento de pagamento quando executando sem RabbitMQ.',
  })
  async processarWebhookPagamento(@Body() data: PagamentoEventoDto) {
    this.logger.log(`[EVENTO RECEBIDO - HTTP Webhook] PagamentoPlanoServicoGestao: Assinatura=${data.codAss}`);
    const result = await this.processarPagamentoUseCase.execute(data);
    if (result.isLeft()) {
      throw result.value;
    }
    return {
      sucesso: true,
      mensagem: `Validade da assinatura ${data.codAss} atualizada com sucesso.`,
      assinatura: AssinaturaMapper.toDTO(result.value),
    };
  }
}
