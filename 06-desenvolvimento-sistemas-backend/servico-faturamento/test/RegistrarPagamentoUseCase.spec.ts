import { RegistrarPagamentoUseCase } from '../src/application/use-cases/RegistrarPagamentoUseCase';
import { IPagamentoRepository, SalvarPagamentoProps } from '../src/domain/repositories/IPagamentoRepository';
import { IEventPublisher, EventoPagamentoPayload } from '../src/domain/services/IEventPublisher';
import { Pagamento } from '../src/domain/entities/Pagamento';

class InMemoryPagamentoRepository implements IPagamentoRepository {
  public items: Pagamento[] = [];
  private currentId = 1;

  async salvar(props: SalvarPagamentoProps): Promise<Pagamento> {
    const item = new Pagamento(
      this.currentId++,
      props.codAss,
      props.valorPago,
      props.dataPagamento,
      props.dia,
      props.mes,
      props.ano,
    );
    this.items.push(item);
    return item;
  }

  async buscarTodos(): Promise<Pagamento[]> {
    return this.items;
  }

  async buscarPorAssinatura(codAss: number): Promise<Pagamento[]> {
    return this.items.filter((p) => p.codAss === codAss);
  }

  async buscarPorCodigo(codigo: number): Promise<Pagamento | null> {
    return this.items.find((p) => p.codigo === codigo) || null;
  }
}

class MockEventPublisher implements IEventPublisher {
  public gestaoEvents: EventoPagamentoPayload[] = [];
  public planosAtivosEvents: EventoPagamentoPayload[] = [];

  async publicarEventoGestao(evento: EventoPagamentoPayload): Promise<void> {
    this.gestaoEvents.push(evento);
  }

  async publicarEventoPlanosAtivos(evento: EventoPagamentoPayload): Promise<void> {
    this.planosAtivosEvents.push(evento);
  }
}

describe('RegistrarPagamentoUseCase', () => {
  let repo: InMemoryPagamentoRepository;
  let publisher: MockEventPublisher;
  let useCase: RegistrarPagamentoUseCase;

  beforeEach(() => {
    repo = new InMemoryPagamentoRepository();
    publisher = new MockEventPublisher();
    useCase = new RegistrarPagamentoUseCase(repo, publisher);
  });

  it('deve registrar um pagamento válido com sucesso e emitir ambos os eventos', async () => {
    const result = await useCase.execute({
      dia: 5,
      mes: 5,
      ano: 2025,
      codAss: 10,
      valorPago: 89.9,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.codigo).toBe(1);
      expect(result.value.codAss).toBe(10);
      expect(result.value.valorPago).toBe(89.9);
      expect(result.value.dia).toBe(5);
    }

    expect(repo.items.length).toBe(1);
    expect(publisher.gestaoEvents.length).toBe(1);
    expect(publisher.planosAtivosEvents.length).toBe(1);
    expect(publisher.gestaoEvents[0].codAss).toBe(10);
    expect(publisher.planosAtivosEvents[0].codAss).toBe(10);
  });

  it('deve rejeitar se codAss for menor ou igual a zero', async () => {
    const result = await useCase.execute({
      dia: 1,
      mes: 1,
      ano: 2025,
      codAss: 0,
      valorPago: 50,
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value.message).toContain('codAss');
    }
    expect(repo.items.length).toBe(0);
    expect(publisher.gestaoEvents.length).toBe(0);
  });

  it('deve rejeitar se valorPago for <= 0', async () => {
    const result = await useCase.execute({
      dia: 1,
      mes: 1,
      ano: 2025,
      codAss: 1,
      valorPago: 0,
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value.message).toContain('valorPago');
    }
  });

  it('deve rejeitar se a data for inválida', async () => {
    const result = await useCase.execute({
      dia: 32,
      mes: 1,
      ano: 2025,
      codAss: 1,
      valorPago: 50,
    });

    expect(result.isLeft()).toBe(true);
  });
});
