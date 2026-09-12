import { IPagamentoRepository } from '../../domain/repositories/IPagamentoRepository';
import { Pagamento } from '../../domain/entities/Pagamento';

export class ListarPagamentosUseCase {
  constructor(private readonly pagamentoRepository: IPagamentoRepository) {}

  async execute(codAss?: number): Promise<Pagamento[]> {
    if (codAss) {
      return this.pagamentoRepository.buscarPorAssinatura(codAss);
    }
    return this.pagamentoRepository.buscarTodos();
  }
}
