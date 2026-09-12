export interface RegistrarPagamentoInput {
  dia: number;
  mes: number;
  ano: number;
  codAss: number;
  valorPago: number;
}

export interface PagamentoOutputDTO {
  codigo: number;
  codAss: number;
  valorPago: number;
  dataPagamento: string;
  dia: number;
  mes: number;
  ano: number;
  criadoEm: string;
}
