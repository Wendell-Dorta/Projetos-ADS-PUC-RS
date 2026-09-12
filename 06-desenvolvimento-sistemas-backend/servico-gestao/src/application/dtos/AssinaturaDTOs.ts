export interface CriarAssinaturaInputDTO {
  codCli: number;
  codPlano: number;
  custoFinal: number;
  descricao: string;
}

export interface AssinaturaOutputDTO {
  codigo: number;
  codCli: number;
  codPlano: number;
  inicioFidelidade: string;
  fimFidelidade: string;
  dataUltimoPagamento: string;
  custoFinal: number;
  descricao: string;
  status: 'ATIVO' | 'CANCELADO';
}
