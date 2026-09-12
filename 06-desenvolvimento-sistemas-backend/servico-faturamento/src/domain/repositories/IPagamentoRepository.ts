import { Pagamento } from '../entities/Pagamento';

export interface SalvarPagamentoProps {
  codAss: number;
  valorPago: number;
  dia: number;
  mes: number;
  ano: number;
  dataPagamento: Date;
}

export interface IPagamentoRepository {
  salvar(props: SalvarPagamentoProps): Promise<Pagamento>;
  buscarTodos(): Promise<Pagamento[]>;
  buscarPorAssinatura(codAss: number): Promise<Pagamento[]>;
  buscarPorCodigo(codigo: number): Promise<Pagamento | null>;
}
