import { IsInt, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PagamentoEventoDto {
  @ApiProperty({ description: 'Dia do pagamento', example: 1 })
  @IsInt()
  @Min(1)
  @Max(31)
  dia!: number;

  @ApiProperty({ description: 'Mês do pagamento', example: 1 })
  @IsInt()
  @Min(1)
  @Max(12)
  mes!: number;

  @ApiProperty({ description: 'Ano do pagamento', example: 2025 })
  @IsInt()
  @Min(2000)
  ano!: number;

  @ApiProperty({ description: 'Código da assinatura', example: 1 })
  @IsInt()
  @Min(1)
  codAss!: number;

  @ApiProperty({ description: 'Valor pago pela assinatura', example: 0.01 })
  @IsNumber()
  @Min(0.01)
  valorPago!: number;
}
