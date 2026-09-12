import { IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AtualizarCustoRequestDTO {
  @ApiProperty({ description: 'Novo valor do custo mensal do plano em Reais', example: 89.9 })
  @Type(() => Number)
  @IsNumber({}, { message: 'O atributo custoMensal deve ser numérico.' })
  @IsNotEmpty({ message: 'O atributo custoMensal é obrigatório.' })
  custoMensal!: number;
}
