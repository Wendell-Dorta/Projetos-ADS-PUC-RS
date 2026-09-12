import { ProcessarPagamentoAssinaturaUseCase } from '../../../src/application/use-cases/ProcessarPagamentoAssinaturaUseCase';
import { IAssinaturaRepository, CriarAssinaturaProps } from '../../../src/domain/repositories/IAssinaturaRepository';
import { Assinatura } from '../../../src/domain/entities/Assinatura';
import { Custo } from '../../../src/domain/value-objects/Custo';
import { PeriodoFidelidade } from '../../../src/domain/value-objects/PeriodoFidelidade';

class MockAssinaturaRepo implements IAssinaturaRepository {
  public dataUltimoPagamento: Date = new Date('2024-01-01');

  async findAll(): Promise<Assinatura[]> { return []; }
  async findById(codigo: number): Promise<Assinatura | null> {
    if (codigo !== 1) return null;
    const custo = Custo.create(50).value as Custo;
    const periodo = PeriodoFidelidade.create(new Date('2024-01-01'), new Date('2025-01-01')).value as PeriodoFidelidade;
    return new Assinatura(1, 1, 1, periodo, this.dataUltimoPagamento, custo, 'Teste');
  }
  async findByCliente(): Promise<Assinatura[]> { return []; }
  async findByPlano(): Promise<Assinatura[]> { return []; }
  async save(props: CriarAssinaturaProps): Promise<Assinatura> {
    return new Assinatura(1, props.codPlano, props.codCli, props.periodoFidelidade, props.dataUltimoPagamento, props.custoFinal, props.descricao);
  }
  async atualizarPagamento(codigo: number, dataPagamento: Date): Promise<Assinatura | null> {
    if (codigo !== 1) return null;
    this.dataUltimoPagamento = dataPagamento;
    const custo = Custo.create(50).value as Custo;
    const periodo = PeriodoFidelidade.create(new Date('2024-01-01'), new Date('2025-01-01')).value as PeriodoFidelidade;
    return new Assinatura(1, 1, 1, periodo, dataPagamento, custo, 'Teste');
  }
}

describe('ProcessarPagamentoAssinaturaUseCase', () => {
  let repo: MockAssinaturaRepo;
  let useCase: ProcessarPagamentoAssinaturaUseCase;

  beforeEach(() => {
    repo = new MockAssinaturaRepo();
    useCase = new ProcessarPagamentoAssinaturaUseCase(repo);
  });

  it('deve atualizar a data de pagamento da assinatura com sucesso', async () => {
    const result = await useCase.execute({
      codAss: 1,
      dia: 10,
      mes: 3,
      ano: 2026,
      valorPago: 50.0,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.codigo).toBe(1);
      expect(result.value.dataUltimoPagamento.getUTCDate()).toBe(10);
      expect(result.value.dataUltimoPagamento.getUTCMonth()).toBe(2); // março = 2
    }
  });

  it('deve retornar erro se assinatura não for encontrada', async () => {
    const result = await useCase.execute({
      codAss: 999,
      dia: 1,
      mes: 1,
      ano: 2026,
      valorPago: 50.0,
    });

    expect(result.isLeft()).toBe(true);
  });
});
