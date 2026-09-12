import { ListarPlanosUseCase } from '../../../src/application/use-cases/ListarPlanosUseCase';
import { InMemoryPlanoRepository } from '../repositories/InMemoryPlanoRepository';
import { Custo } from '../../../src/domain/value-objects/Custo';

describe('ListarPlanosUseCase', () => {
  let useCase: ListarPlanosUseCase;
  let planoRepo: InMemoryPlanoRepository;

  beforeEach(() => {
    planoRepo = new InMemoryPlanoRepository();
    useCase = new ListarPlanosUseCase(planoRepo);
  });

  it('deve retornar todos os planos cadastrados', async () => {
    const custo1 = Custo.create(49.9).value as Custo;
    const custo2 = Custo.create(99.9).value as Custo;

    await planoRepo.save({ nome: 'Plano Start 50MB', custoMensal: custo1, descricao: 'Entrada' });
    await planoRepo.save({ nome: 'Plano Turbo 300MB', custoMensal: custo2, descricao: 'Avancado' });

    const result = await useCase.execute();

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.length).toBe(2);
      expect(result.value[0].nome).toBe('Plano Start 50MB');
      expect(result.value[1].nome).toBe('Plano Turbo 300MB');
    }
  });
});
