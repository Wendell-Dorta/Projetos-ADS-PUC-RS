import { ApiProperty } from '@nestjs/swagger';

export class ClienteResponseSwaggerDTO {
  @ApiProperty({ description: 'Código único do cliente', example: 21 })
  codigo!: number;

  @ApiProperty({ description: 'Nome completo do cliente', example: 'Ana Silva' })
  nome!: string;

  @ApiProperty({ description: 'Endereço de e-mail do cliente', example: 'ana.silva@email.com' })
  email!: string;
}

export class PlanoResponseSwaggerDTO {
  @ApiProperty({ description: 'Código único do plano', example: 11 })
  codigo!: number;

  @ApiProperty({ description: 'Nome do plano contratável', example: 'Fibra 100 Mega' })
  nome!: string;

  @ApiProperty({ description: 'Valor do custo mensal do plano em Reais', example: 89.9 })
  custoMensal!: number;

  @ApiProperty({
    description: 'Data de criação/atualização do plano',
    example: '2026-08-05T02:15:48.792Z',
  })
  data!: string;

  @ApiProperty({
    description: 'Descrição detalhada do plano',
    example: 'Internet banda larga de 100MB',
  })
  descricao!: string;
}

export class AssinaturaResponseSwaggerDTO {
  @ApiProperty({ description: 'Código único da assinatura', example: 13 })
  codigo!: number;

  @ApiProperty({ description: 'Código do cliente titular', example: 21 })
  codCli!: number;

  @ApiProperty({ description: 'Código do plano assinado', example: 11 })
  codPlano!: number;

  @ApiProperty({
    description: 'Data de início do período de fidelidade (1 ano)',
    example: '2026-08-05T02:15:48.792Z',
  })
  inicioFidelidade!: string;

  @ApiProperty({
    description: 'Data de término do período de fidelidade',
    example: '2027-08-05T02:15:48.792Z',
  })
  fimFidelidade!: string;

  @ApiProperty({
    description: 'Data do último pagamento efetuado pelo cliente',
    example: '2026-07-31T02:15:48.792Z',
  })
  dataUltimoPagamento!: string;

  @ApiProperty({
    description: 'Valor cobrado nesta assinatura durante a fidelidade',
    example: 79.9,
  })
  custoFinal!: number;

  @ApiProperty({
    description: 'Descrição ou observações cadastradas no momento da venda',
    example: 'Desconto promocional de fidelidade anual',
  })
  descricao!: string;

  @ApiProperty({
    description: 'Status dinâmico da assinatura (calculado pelo histórico de pagamento <= 30 dias)',
    example: 'ATIVO',
    enum: ['ATIVO', 'CANCELADO'],
  })
  status!: 'ATIVO' | 'CANCELADO';
}

export class ErrorResponseSwaggerDTO {
  @ApiProperty({ description: 'Código de status HTTP', example: 404 })
  statusCode!: number;

  @ApiProperty({
    description: 'Tipo do erro de domínio ou servidor',
    example: 'ClienteNotFoundError',
  })
  error!: string;

  @ApiProperty({
    description: 'Mensagem explicativa detalhada sobre a falha',
    example: 'Cliente com código 99999 não foi encontrado.',
  })
  message!: string;
}
