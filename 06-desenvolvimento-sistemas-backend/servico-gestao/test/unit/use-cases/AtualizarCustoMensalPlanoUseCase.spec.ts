import { AtualizarCustoMensalPlanoUseCase } from '../../../src/application/use-cases/AtualizarCustoMensalPlanoUseCase';
import { InMemoryPlanoRepository } from '../repositories/InMemoryPlanoRepository';
import { Custo } from '../../../src/domain/value-objects/Custo';
import {
  PlanoNotFoundError,
  InvalidCustoMensalError,
} from '../../../src/domain/errors/DomainErrors';

describe('AtualizarCustoMensalPlanoUseCase', () => {
  let useCase: AtualizarCustoMensalPlanoUseCase;
  let planoRepo: InMemoryPlanoRepository;

  beforeEach(() => {
    planoRepo = new InMemoryPlanoRepository();
    useCase = new AtualizarCustoMensalPlanoUseCase(planoRepo);
  });

  it('deve atualizar o custo mensal de um plano existente com sucesso', async () => {
    const custoInicial = Custo.create(50.0).value as Custo;
    const plano = await planoRepo.save({
      nome: 'Plano 100MB',
      custoMensal: custoInicial,
      descricao: 'Plano basico',
    });

    const result = await useCase.execute({
      idPlano: plano.codigo,
      custoMensal: 75.5,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.codigo).toBe(plano.codigo);
      expect(result.value.custoMensal.value).toBe(75.5);
    }
  });

  it('deve retornar PlanoNotFoundError quando o id do plano nao existir', async () => {
    const result = await useCase.execute({
      idPlano: 9999,
      custoMensal: 100.0,
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(PlanoNotFoundError);
    }
  });

  it('deve retornar InvalidCustoMensalError quando o novo custo mensal for negativo', async () => {
    const custoInicial = Custo.create(50.0).value as Custo;
    const plano = await planoRepo.save({
      nome: 'Plano 100MB',
      custoMensal: custoInicial,
      descricao: 'Plano basico',
    });

    const result = await useCase.execute({
      idPlano: plano.codigo,
      custoMensal: -10.0,
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidCustoMensalError);
    }
  });
});
