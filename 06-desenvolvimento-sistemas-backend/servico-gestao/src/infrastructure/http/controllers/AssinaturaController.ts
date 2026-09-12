import { Controller, Get, Post, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CriarAssinaturaUseCase } from '../../../application/use-cases/CriarAssinaturaUseCase';
import { ListarAssinaturasPorTipoUseCase } from '../../../application/use-cases/ListarAssinaturasPorTipoUseCase';
import { ListarAssinaturasPorClienteUseCase } from '../../../application/use-cases/ListarAssinaturasPorClienteUseCase';
import { ListarAssinaturasPorPlanoUseCase } from '../../../application/use-cases/ListarAssinaturasPorPlanoUseCase';
import { AssinaturaMapper } from '../../../adapters/mappers/AssinaturaMapper';
import { AssinaturaOutputDTO } from '../../../application/dtos/AssinaturaDTOs';
import { CriarAssinaturaRequestDTO } from '../dtos/CriarAssinaturaRequestDTO';
import { AssinaturaResponseSwaggerDTO, ErrorResponseSwaggerDTO } from '../dtos/SwaggerResponseDTOs';

@ApiTags('Assinaturas')
@Controller(['gerenciaplanos', 'gestao'])
export class AssinaturaController {
  constructor(
    private readonly criarAssinaturaUseCase: CriarAssinaturaUseCase,
    private readonly listarAssinaturasPorTipoUseCase: ListarAssinaturasPorTipoUseCase,
    private readonly listarAssinaturasPorClienteUseCase: ListarAssinaturasPorClienteUseCase,
    private readonly listarAssinaturasPorPlanoUseCase: ListarAssinaturasPorPlanoUseCase,
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

  @Get('asscli/:codcli')
  @ApiOperation({
    summary: 'Listar assinaturas por cliente',
    description: 'Recupera o histórico de todas as assinaturas vinculadas a um cliente específico.',
  })
  @ApiParam({
    name: 'codcli',
    description: 'Código único do cliente',
    example: 21,
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

  @Get('assinaturaplano/:codplano')
  @ApiOperation({
    summary: 'Listar assinaturas por plano',
    description:
      'Recupera todas as assinaturas ativas e canceladas associadas a um plano específico.',
  })
  @ApiParam({
    name: 'codplano',
    description: 'Código único do plano',
    example: 11,
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
}
