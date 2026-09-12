import { IsInt, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrarPagamentoRequestDTO {
  @ApiProperty({
    description: 'Dia em que o pagamento foi realizado (1-31)',
    example: 1,
  })
  @IsInt({ message: 'O dia deve ser um número inteiro.' })
  @Min(1, { message: 'O dia não pode ser menor que 1.' })
  @Max(31, { message: 'O dia não pode ser maior que 31.' })
  dia!: number;

  @ApiProperty({
    description: 'Mês em que o pagamento foi realizado (1-12)',
    example: 1,
  })
  @IsInt({ message: 'O mês deve ser um número inteiro.' })
  @Min(1, { message: 'O mês não pode ser menor que 1.' })
  @Max(12, { message: 'O mês não pode ser maior que 12.' })
  mes!: number;

  @ApiProperty({
    description: 'Ano em que o pagamento foi realizado (ex: 2025)',
    example: 2025,
  })
  @IsInt({ message: 'O ano deve ser um número inteiro.' })
  @Min(2000, { message: 'O ano deve ser maior ou igual a 2000.' })
  ano!: number;

  @ApiProperty({
    description: 'Código da assinatura que está sendo paga',
    example: 1,
  })
  @IsInt({ message: 'O código da assinatura (codAss) deve ser um número inteiro.' })
  @Min(1, { message: 'O código da assinatura deve ser maior que zero.' })
  codAss!: number;

  @ApiProperty({
    description: 'Valor monetário pago pela assinatura',
    example: 0.01,
  })
  @IsNumber({}, { message: 'O valor pago deve ser um número decimal válido.' })
  @Min(0.01, { message: 'O valor pago deve ser de no mínimo 0.01.' })
  valorPago!: number;
}
