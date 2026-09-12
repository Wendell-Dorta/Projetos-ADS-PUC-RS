import { CriarAssinaturaUseCase } from '../../../src/application/use-cases/CriarAssinaturaUseCase';
import { InMemoryClienteRepository } from '../repositories/InMemoryClienteRepository';
import { InMemoryPlanoRepository } from '../repositories/InMemoryPlanoRepository';
import { InMemoryAssinaturaRepository } from '../repositories/InMemoryAssinaturaRepository';
import { Email } from '../../../src/domain/value-objects/Email';
import { Custo } from '../../../src/domain/value-objects/Custo';
import {
  ClienteNotFoundError,
  InvalidCustoMensalError,
} from '../../../src/domain/errors/DomainErrors';

describe('CriarAssinaturaUseCase', () => {
  let useCase: CriarAssinaturaUseCase;
  let clienteRepo: InMemoryClienteRepository;
  let planoRepo: InMemoryPlanoRepository;
  let assinaturaRepo: InMemoryAssinaturaRepository;

  beforeEach(() => {
    clienteRepo = new InMemoryClienteRepository();
    planoRepo = new InMemoryPlanoRepository();
    assinaturaRepo = new InMemoryAssinaturaRepository();
    useCase = new CriarAssinaturaUseCase(assinaturaRepo, clienteRepo, planoRepo);
  });

  it('deve criar uma assinatura com sucesso quando cliente e plano existirem', async () => {
    const email = Email.create('cliente@email.com').value as Email;
    const custoPlano = Custo.create(99.9).value as Custo;

    const cliente = await clienteRepo.save({ nome: 'Joao Silva', email });
    const plano = await planoRepo.save({
      nome: 'Fibra 300MB',
      custoMensal: custoPlano,
      descricao: 'Plano rapido',
    });

    const result = await useCase.execute({
      codCli: cliente.codigo,
      codPlano: plano.codigo,
      custoFinal: 89.9,
      descricao: 'Desconto promocional',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.codigo).toBe(1);
      expect(result.value.codCli).toBe(cliente.codigo);
      expect(result.value.codPlano).toBe(plano.codigo);
      expect(result.value.custoFinal.value).toBe(89.9);
    }
  });

  it('deve retornar ClienteNotFoundError quando o cliente nao for encontrado', async () => {
    const custoPlano = Custo.create(99.9).value as Custo;
    const plano = await planoRepo.save({
      nome: 'Fibra 300MB',
      custoMensal: custoPlano,
      descricao: 'Plano rapido',
    });

    const result = await useCase.execute({
      codCli: 9999,
      codPlano: plano.codigo,
      custoFinal: 89.9,
      descricao: 'Teste falha',
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ClienteNotFoundError);
    }
  });

  it('deve retornar InvalidCustoMensalError quando o custo for negativo', async () => {
    const result = await useCase.execute({
      codCli: 1,
      codPlano: 1,
      custoFinal: -50.0,
      descricao: 'Custo invalido',
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidCustoMensalError);
    }
  });
});
