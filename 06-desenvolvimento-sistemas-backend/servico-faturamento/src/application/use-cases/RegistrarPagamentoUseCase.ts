import { IPagamentoRepository } from '../../domain/repositories/IPagamentoRepository';
import { IEventPublisher, EventoPagamentoPayload } from '../../domain/services/IEventPublisher';
import { Pagamento } from '../../domain/entities/Pagamento';
import { Either, left, right } from '../../domain/shared/Either';
import { DomainException } from '../../domain/errors/DomainException';
import { RegistrarPagamentoInput } from '../dtos/PagamentoDTOs';

export class RegistrarPagamentoUseCase {
  constructor(
    private readonly pagamentoRepository: IPagamentoRepository,
    private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(input: RegistrarPagamentoInput): Promise<Either<DomainException, Pagamento>> {
    if (!input.codAss || input.codAss <= 0) {
      return left(new DomainException('O código da assinatura (codAss) deve ser um número inteiro positivo.'));
    }

    if (input.valorPago === undefined || input.valorPago === null || input.valorPago <= 0) {
      return left(new DomainException('O valor pago (valorPago) deve ser um número positivo maior que zero.'));
    }

    if (!input.dia || input.dia < 1 || input.dia > 31) {
      return left(new DomainException('O dia do pagamento deve estar entre 1 e 31.'));
    }

    if (!input.mes || input.mes < 1 || input.mes > 12) {
      return left(new DomainException('O mês do pagamento deve estar entre 1 e 12.'));
    }

    if (!input.ano || input.ano < 2000) {
      return left(new DomainException('O ano do pagamento deve ser válido (>= 2000).'));
    }

    const dataPagamento = new Date(Date.UTC(input.ano, input.mes - 1, input.dia));

    // 1. Persiste o pagamento no banco próprio do microsserviço (faturamento.db)
    const novoPagamento = await this.pagamentoRepository.salvar({
      codAss: input.codAss,
      valorPago: input.valorPago,
      dia: input.dia,
      mes: input.mes,
      ano: input.ano,
      dataPagamento,
    });

    // 2. Prepara o payload do evento assíncrono
    const eventoPayload: EventoPagamentoPayload = {
      dia: input.dia,
      mes: input.mes,
      ano: input.ano,
      codAss: input.codAss,
      valorPago: input.valorPago,
    };

    // 3. Emite eventos assíncronos para o ServicoGestao e ServicoPlanosAtivos
    try {
      await Promise.all([
        this.eventPublisher.publicarEventoGestao(eventoPayload),
        this.eventPublisher.publicarEventoPlanosAtivos(eventoPayload),
      ]);
    } catch (err: any) {
      console.error(`[RegistrarPagamentoUseCase] Erro ao despachar eventos assíncronos: ${err?.message || err}`);
    }

    return right(novoPagamento);
  }
}
