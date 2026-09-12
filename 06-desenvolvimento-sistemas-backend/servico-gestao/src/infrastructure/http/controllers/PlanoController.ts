import { Controller, Get, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ListarPlanosUseCase } from '../../../application/use-cases/ListarPlanosUseCase';
import { AtualizarCustoMensalPlanoUseCase } from '../../../application/use-cases/AtualizarCustoMensalPlanoUseCase';
import { PlanoMapper } from '../../../adapters/mappers/PlanoMapper';
import { PlanoOutputDTO } from '../../../application/dtos/PlanoDTOs';
import { AtualizarCustoRequestDTO } from '../dtos/AtualizarCustoRequestDTO';
import { PlanoResponseSwaggerDTO, ErrorResponseSwaggerDTO } from '../dtos/SwaggerResponseDTOs';

@ApiTags('Planos')
@Controller(['gerenciaplanos/planos', 'gestao/planos'])
export class PlanoController {
  constructor(
    private readonly listarPlanosUseCase: ListarPlanosUseCase,
    private readonly atualizarCustoMensalPlanoUseCase: AtualizarCustoMensalPlanoUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos os planos',
    description: 'Recupera o catálogo completo de planos de internet ofertados pela operadora.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de planos retornada com sucesso.',
    type: [PlanoResponseSwaggerDTO],
  })
  async listar(): Promise<PlanoOutputDTO[]> {
    const result = await this.listarPlanosUseCase.execute();
    if (result.isLeft()) {
      throw result.value;
    }
    return result.value.map(PlanoMapper.toDTO);
  }

  @Patch(':idPlano')
  @ApiOperation({
    summary: 'Atualizar custo mensal de um plano',
    description: 'Atualiza o valor do custo mensal de um plano específico pelo seu ID.',
  })
  @ApiParam({
    name: 'idPlano',
    description: 'Código único identificador do plano',
    example: 11,
  })
  @ApiResponse({
    status: 200,
    description: 'Custo mensal do plano atualizado com sucesso.',
    type: PlanoResponseSwaggerDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Custo mensal inválido (ex: valor negativo).',
    type: ErrorResponseSwaggerDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Plano não encontrado para o ID informado.',
    type: ErrorResponseSwaggerDTO,
  })
  async atualizarCustoMensal(
    @Param('idPlano', ParseIntPipe) idPlano: number,
    @Body() dto: AtualizarCustoRequestDTO,
  ): Promise<PlanoOutputDTO> {
    const result = await this.atualizarCustoMensalPlanoUseCase.execute({
      idPlano,
      custoMensal: dto.custoMensal,
    });
    if (result.isLeft()) {
      throw result.value;
    }
    return PlanoMapper.toDTO(result.value);
  }
}
