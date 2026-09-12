import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ListarClientesUseCase } from '../../../application/use-cases/ListarClientesUseCase';
import { ClienteMapper } from '../../../adapters/mappers/ClienteMapper';
import { ClienteOutputDTO } from '../../../application/dtos/ClienteDTOs';
import { ClienteResponseSwaggerDTO, ErrorResponseSwaggerDTO } from '../dtos/SwaggerResponseDTOs';

@ApiTags('Clientes')
@Controller(['gerenciaplanos/clientes', 'gestao/clientes'])
export class ClienteController {
  constructor(private readonly listarClientesUseCase: ListarClientesUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos os clientes',
    description: 'Recupera a lista completa de todos os clientes cadastrados na operadora.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes retornada com sucesso.',
    type: [ClienteResponseSwaggerDTO],
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno no servidor.',
    type: ErrorResponseSwaggerDTO,
  })
  async listar(): Promise<ClienteOutputDTO[]> {
    const result = await this.listarClientesUseCase.execute();
    if (result.isLeft()) {
      throw result.value;
    }
    return result.value.map(ClienteMapper.toDTO);
  }
}
