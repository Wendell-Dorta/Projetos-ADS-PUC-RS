export interface AtualizarCustoMensalInputDTO {
  idPlano: number;
  custoMensal: number;
}

export interface PlanoOutputDTO {
  codigo: number;
  nome: string;
  custoMensal: number;
  data: string;
  descricao: string;
}
