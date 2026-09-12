import { IsNumber, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarAssinaturaRequestDTO {
  @ApiProperty({ description: 'Código único identificador do cliente contratante', example: 21 })
  @Type(() => Number)
  @IsNumber({}, { message: 'O atributo codCli deve ser numérico.' })
  @IsNotEmpty({ message: 'O atributo codCli é obrigatório.' })
  codCli!: number;

  @ApiProperty({ description: 'Código único identificador do plano selecionado', example: 11 })
  @Type(() => Number)
  @IsNumber({}, { message: 'O atributo codPlano deve ser numérico.' })
  @IsNotEmpty({ message: 'O atributo codPlano é obrigatório.' })
  codPlano!: number;

  @ApiProperty({
    description: 'Valor acordado do custo final da assinatura em Reais',
    example: 79.9,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'O atributo custoFinal deve ser numérico.' })
  @IsNotEmpty({ message: 'O atributo custoFinal é obrigatório.' })
  custoFinal!: number;

  @ApiPropertyOptional({
    description: 'Observações ou detalhes preenchidos no ato da contratacao',
    example: 'Cliente com desconto promocional',
  })
  @IsOptional()
  @IsString({ message: 'O atributo descricao deve ser uma string.' })
  descricao?: string;
}
