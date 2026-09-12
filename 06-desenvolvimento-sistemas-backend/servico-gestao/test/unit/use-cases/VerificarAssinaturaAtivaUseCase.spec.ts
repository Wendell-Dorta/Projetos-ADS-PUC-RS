import { VerificarAssinaturaAtivaUseCase } from '../../../src/application/use-cases/VerificarAssinaturaAtivaUseCase';
import { IAssinaturaRepository, CriarAssinaturaProps } from '../../../src/domain/repositories/IAssinaturaRepository';
import { Assinatura } from '../../../src/domain/entities/Assinatura';
import { Custo } from '../../../src/domain/value-objects/Custo';
import { PeriodoFidelidade } from '../../../src/domain/value-objects/PeriodoFidelidade';

class MockAssinaturaRepo implements IAssinaturaRepository {
  async findAll(): Promise<Assinatura[]> { return []; }
  async findById(codigo: number): Promise<Assinatura | null> {
    if (codigo === 1) {
      // Ativa (recente)
      const custo = Custo.create(50).value as Custo;
      const periodo = PeriodoFidelidade.create(new Date('2024-01-01'), new Date('2027-01-01')).value as PeriodoFidelidade;
      return new Assinatura(1, 1, 1, periodo, new Date(), custo, 'Teste Ativo');
    }
    if (codigo === 2) {
      // Cancelada (atrasada há mais de 30 dias)
      const custo = Custo.create(50).value as Custo;
      const periodo = PeriodoFidelidade.create(new Date('2024-01-01'), new Date('2027-01-01')).value as PeriodoFidelidade;
      const dataAntiga = new Date();
      dataAntiga.setDate(dataAntiga.getDate() - 40);
      return new Assinatura(2, 1, 1, periodo, dataAntiga, custo, 'Teste Cancelado');
    }
    return null;
  }
  async findByCliente(): Promise<Assinatura[]> { return []; }
  async findByPlano(): Promise<Assinatura[]> { return []; }
  async save(props: CriarAssinaturaProps): Promise<Assinatura> {
    return new Assinatura(1, props.codPlano, props.codCli, props.periodoFidelidade, props.dataUltimoPagamento, props.custoFinal, props.descricao);
  }
  async atualizarPagamento(): Promise<Assinatura | null> { return null; }
}

describe('VerificarAssinaturaAtivaUseCase', () => {
  let repo: MockAssinaturaRepo;
  let useCase: VerificarAssinaturaAtivaUseCase;

  beforeEach(() => {
    repo = new MockAssinaturaRepo();
    useCase = new VerificarAssinaturaAtivaUseCase(repo);
  });

  it('deve retornar ativa = true para assinatura com pagamento recente', async () => {
    const result = await useCase.execute(1);
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.codAss).toBe(1);
      expect(result.value.ativa).toBe(true);
      expect(result.value.status).toBe('ATIVO');
    }
  });

  it('deve retornar ativa = false para assinatura com pagamento atrasado (>30 dias)', async () => {
    const result = await useCase.execute(2);
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.codAss).toBe(2);
      expect(result.value.ativa).toBe(false);
      expect(result.value.status).toBe('CANCELADO');
    }
  });

  it('deve retornar erro para código inexistente', async () => {
    const result = await useCase.execute(999);
    expect(result.isLeft()).toBe(true);
  });
});
