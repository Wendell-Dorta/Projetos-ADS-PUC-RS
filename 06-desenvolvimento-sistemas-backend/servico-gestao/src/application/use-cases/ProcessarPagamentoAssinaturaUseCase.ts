import { IAssinaturaRepository } from '../../domain/repositories/IAssinaturaRepository';
import { Assinatura } from '../../domain/entities/Assinatura';
import { Either, left, right } from '../../domain/shared/Either';
import { DomainError, AssinaturaNotFoundError } from '../../domain/errors/DomainErrors';

export interface ProcessarPagamentoInput {
  codAss: number;
  dia: number;
  mes: number;
  ano: number;
  valorPago: number;
}

export class ProcessarPagamentoAssinaturaUseCase {
  constructor(private readonly assinaturaRepo: IAssinaturaRepository) {}

  async execute(input: ProcessarPagamentoInput): Promise<Either<DomainError, Assinatura>> {
    if (!input.codAss || input.codAss <= 0) {
      return left(new DomainError('Código da assinatura deve ser um número positivo válido.'));
    }
    if (input.valorPago <= 0) {
      return left(new DomainError('Valor pago deve ser maior que zero.'));
    }
    if (input.dia < 1 || input.dia > 31 || input.mes < 1 || input.mes > 12 || input.ano < 2000) {
      return left(new DomainError('Data de pagamento inválida.'));
    }

    const dataPagamento = new Date(Date.UTC(input.ano, input.mes - 1, input.dia));
    const assinatura = await this.assinaturaRepo.atualizarPagamento(input.codAss, dataPagamento);
    if (!assinatura) {
      return left(new AssinaturaNotFoundError(input.codAss));
    }
    return right(assinatura);
  }
}
