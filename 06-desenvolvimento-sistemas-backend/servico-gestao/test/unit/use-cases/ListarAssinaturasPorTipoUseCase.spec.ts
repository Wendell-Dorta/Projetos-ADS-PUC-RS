import { ListarAssinaturasPorTipoUseCase } from '../../../src/application/use-cases/ListarAssinaturasPorTipoUseCase';
import { InMemoryAssinaturaRepository } from '../repositories/InMemoryAssinaturaRepository';
import { Custo } from '../../../src/domain/value-objects/Custo';
import { PeriodoFidelidade } from '../../../src/domain/value-objects/PeriodoFidelidade';
import { InvalidFilterTypeError } from '../../../src/domain/errors/DomainErrors';

describe('ListarAssinaturasPorTipoUseCase', () => {
  let useCase: ListarAssinaturasPorTipoUseCase;
  let assinaturaRepo: InMemoryAssinaturaRepository;

  beforeEach(async () => {
    assinaturaRepo = new InMemoryAssinaturaRepository();
    useCase = new ListarAssinaturasPorTipoUseCase(assinaturaRepo);

    const agora = new Date();
    const custo = Custo.create(100).value as Custo;
    const periodo = PeriodoFidelidade.create(
      agora,
      new Date(agora.getTime() + 365 * 24 * 60 * 60 * 1000),
    ).value as PeriodoFidelidade;

    // Assinatura 1: Ativa (pagamento ha 5 dias)
    await assinaturaRepo.save({
      codPlano: 1,
      codCli: 10,
      periodoFidelidade: periodo,
      dataUltimoPagamento: new Date(agora.getTime() - 5 * 24 * 60 * 60 * 1000),
      custoFinal: custo,
      descricao: 'Ativa 1',
    });

    // Assinatura 2: Cancelada (pagamento ha 40 dias)
    await assinaturaRepo.save({
      codPlano: 2,
      codCli: 20,
      periodoFidelidade: periodo,
      dataUltimoPagamento: new Date(agora.getTime() - 40 * 24 * 60 * 60 * 1000),
      custoFinal: custo,
      descricao: 'Cancelada 1',
    });
  });

  it('deve listar apenas assinaturas ATIVAS quando tipo for ATIVOS', async () => {
    const result = await useCase.execute('ATIVOS');

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.length).toBe(1);
      expect(result.value[0].descricao).toBe('Ativa 1');
    }
  });

  it('deve listar apenas assinaturas CANCELADAS quando tipo for CANCELADOS', async () => {
    const result = await useCase.execute('CANCELADOS');

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.length).toBe(1);
      expect(result.value[0].descricao).toBe('Cancelada 1');
    }
  });

  it('deve listar TODAS as assinaturas quando tipo for TODOS', async () => {
    const result = await useCase.execute('TODOS');

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.length).toBe(2);
    }
  });

  it('deve retornar InvalidFilterTypeError quando o tipo for invalido', async () => {
    const result = await useCase.execute('FILTRO_INVALIDO');

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidFilterTypeError);
    }
  });
});
