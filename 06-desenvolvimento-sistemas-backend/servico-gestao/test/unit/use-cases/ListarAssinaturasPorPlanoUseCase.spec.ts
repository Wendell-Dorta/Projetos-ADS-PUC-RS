import { ListarAssinaturasPorPlanoUseCase } from '../../../src/application/use-cases/ListarAssinaturasPorPlanoUseCase';
import { InMemoryAssinaturaRepository } from '../repositories/InMemoryAssinaturaRepository';
import { InMemoryPlanoRepository } from '../repositories/InMemoryPlanoRepository';
import { Custo } from '../../../src/domain/value-objects/Custo';
import { PeriodoFidelidade } from '../../../src/domain/value-objects/PeriodoFidelidade';
import { PlanoNotFoundError } from '../../../src/domain/errors/DomainErrors';

describe('ListarAssinaturasPorPlanoUseCase', () => {
  let useCase: ListarAssinaturasPorPlanoUseCase;
  let assinaturaRepo: InMemoryAssinaturaRepository;
  let planoRepo: InMemoryPlanoRepository;

  beforeEach(() => {
    assinaturaRepo = new InMemoryAssinaturaRepository();
    planoRepo = new InMemoryPlanoRepository();
    useCase = new ListarAssinaturasPorPlanoUseCase(assinaturaRepo, planoRepo);
  });

  it('deve listar apenas as assinaturas vinculadas ao plano especificado', async () => {
    const custoPlano = Custo.create(100).value as Custo;
    const plano55 = await planoRepo.save({
      nome: 'Plano 55',
      custoMensal: custoPlano,
      descricao: 'Desc 55',
    });
    const plano99 = await planoRepo.save({
      nome: 'Plano 99',
      custoMensal: custoPlano,
      descricao: 'Desc 99',
    });

    const agora = new Date();
    const periodo = PeriodoFidelidade.create(
      agora,
      new Date(agora.getTime() + 365 * 24 * 60 * 60 * 1000),
    ).value as PeriodoFidelidade;

    await assinaturaRepo.save({
      codPlano: plano55.codigo,
      codCli: 1,
      periodoFidelidade: periodo,
      dataUltimoPagamento: agora,
      custoFinal: custoPlano,
      descricao: 'Plano 55 User 1',
    });

    await assinaturaRepo.save({
      codPlano: plano99.codigo,
      codCli: 2,
      periodoFidelidade: periodo,
      dataUltimoPagamento: agora,
      custoFinal: custoPlano,
      descricao: 'Plano 99 User 2',
    });

    const result = await useCase.execute(plano55.codigo);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.length).toBe(1);
      expect(result.value[0].codPlano).toBe(plano55.codigo);
    }
  });

  it('deve retornar PlanoNotFoundError quando o plano nao existir', async () => {
    const result = await useCase.execute(9999);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(PlanoNotFoundError);
    }
  });
});
