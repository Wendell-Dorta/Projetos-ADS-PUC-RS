import { Controller, Post, Get, Body, Param, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RegistrarPagamentoUseCase } from '../../application/use-cases/RegistrarPagamentoUseCase';
import { ListarPagamentosUseCase } from '../../application/use-cases/ListarPagamentosUseCase';
import { RegistrarPagamentoRequestDTO } from '../dtos/RegistrarPagamentoRequestDTO';
import { PagamentoMapper } from '../mappers/PagamentoMapper';
import { PagamentoOutputDTO } from '../../application/dtos/PagamentoDTOs';

@ApiTags('Faturamento')
@Controller()
export class PagamentoController {
  constructor(
    private readonly registrarPagamentoUseCase: RegistrarPagamentoUseCase,
    private readonly listarPagamentosUseCase: ListarPagamentosUseCase,
  ) {}

  @Post('registrarpagamento')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar pagamento de assinatura',
    description:
      'Registra o pagamento efetuado para uma assinatura no banco próprio do ServicoFaturamento e dispara eventos assíncronos (RabbitMQ) para ServicoGestao e ServicoPlanosAtivos.',
  })
  @ApiResponse({
    status: 201,
    description: 'Pagamento registrado com sucesso e eventos despachados.',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados de pagamento inválidos.',
  })
  async registrar(@Body() dto: RegistrarPagamentoRequestDTO): Promise<{
    sucesso: boolean;
    mensagem: string;
    pagamento: PagamentoOutputDTO;
  }> {
    const result = await this.registrarPagamentoUseCase.execute({
      dia: dto.dia,
      mes: dto.mes,
      ano: dto.ano,
      codAss: dto.codAss,
      valorPago: dto.valorPago,
    });

    if (result.isLeft()) {
      throw result.value;
    }

    return {
      sucesso: true,
      mensagem: 'Pagamento registrado e eventos assíncronos emitidos com sucesso.',
      pagamento: PagamentoMapper.toDTO(result.value),
    };
  }

  @Get('faturamento/pagamentos')
  @ApiOperation({
    summary: 'Listar todos os pagamentos',
    description: 'Retorna todos os pagamentos armazenados no banco de dados isolado de faturamento.',
  })
  async listarTodos(): Promise<PagamentoOutputDTO[]> {
    const pagamentos = await this.listarPagamentosUseCase.execute();
    return pagamentos.map(PagamentoMapper.toDTO);
  }

  @Get('faturamento/pagamentos/:codAss')
  @ApiOperation({
    summary: 'Listar pagamentos de uma assinatura',
    description: 'Retorna o histórico de pagamentos de uma assinatura específica.',
  })
  @ApiParam({ name: 'codAss', description: 'Código da assinatura', example: 1 })
  async listarPorAssinatura(
    @Param('codAss', ParseIntPipe) codAss: number,
  ): Promise<PagamentoOutputDTO[]> {
    const pagamentos = await this.listarPagamentosUseCase.execute(codAss);
    return pagamentos.map(PagamentoMapper.toDTO);
  }
}
