import { ListarAssinaturasPorClienteUseCase } from '../../../src/application/use-cases/ListarAssinaturasPorClienteUseCase';
import { InMemoryAssinaturaRepository } from '../repositories/InMemoryAssinaturaRepository';
import { InMemoryClienteRepository } from '../repositories/InMemoryClienteRepository';
import { Custo } from '../../../src/domain/value-objects/Custo';
import { PeriodoFidelidade } from '../../../src/domain/value-objects/PeriodoFidelidade';
import { Email } from '../../../src/domain/value-objects/Email';
import { ClienteNotFoundError } from '../../../src/domain/errors/DomainErrors';

describe('ListarAssinaturasPorClienteUseCase', () => {
  let useCase: ListarAssinaturasPorClienteUseCase;
  let assinaturaRepo: InMemoryAssinaturaRepository;
  let clienteRepo: InMemoryClienteRepository;

  beforeEach(() => {
    assinaturaRepo = new InMemoryAssinaturaRepository();
    clienteRepo = new InMemoryClienteRepository();
    useCase = new ListarAssinaturasPorClienteUseCase(assinaturaRepo, clienteRepo);
  });

  it('deve listar apenas as assinaturas pertencentes ao cliente especificado', async () => {
    const email = Email.create('cliente@email.com').value as Email;
    const cliente100 = await clienteRepo.save({ nome: 'Cliente 100', email });
    const cliente200 = await clienteRepo.save({ nome: 'Cliente 200', email });

    const agora = new Date();
    const custo = Custo.create(100).value as Custo;
    const periodo = PeriodoFidelidade.create(
      agora,
      new Date(agora.getTime() + 365 * 24 * 60 * 60 * 1000),
    ).value as PeriodoFidelidade;

    await assinaturaRepo.save({
      codPlano: 1,
      codCli: cliente100.codigo,
      periodoFidelidade: periodo,
      dataUltimoPagamento: agora,
      custoFinal: custo,
      descricao: 'Assinatura Cliente 100 A',
    });

    await assinaturaRepo.save({
      codPlano: 2,
      codCli: cliente100.codigo,
      periodoFidelidade: periodo,
      dataUltimoPagamento: agora,
      custoFinal: custo,
      descricao: 'Assinatura Cliente 100 B',
    });

    await assinaturaRepo.save({
      codPlano: 1,
      codCli: cliente200.codigo,
      periodoFidelidade: periodo,
      dataUltimoPagamento: agora,
      custoFinal: custo,
      descricao: 'Assinatura Cliente 200',
    });

    const result = await useCase.execute(cliente100.codigo);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.length).toBe(2);
      expect(result.value.every((ass) => ass.codCli === cliente100.codigo)).toBe(true);
    }
  });

  it('deve retornar ClienteNotFoundError quando o cliente nao existir', async () => {
    const result = await useCase.execute(9999);

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ClienteNotFoundError);
    }
  });
});
