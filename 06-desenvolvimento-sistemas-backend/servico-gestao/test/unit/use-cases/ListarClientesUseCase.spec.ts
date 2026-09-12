import { ListarClientesUseCase } from '../../../src/application/use-cases/ListarClientesUseCase';
import { InMemoryClienteRepository } from '../repositories/InMemoryClienteRepository';
import { Email } from '../../../src/domain/value-objects/Email';

describe('ListarClientesUseCase', () => {
  let useCase: ListarClientesUseCase;
  let clienteRepo: InMemoryClienteRepository;

  beforeEach(() => {
    clienteRepo = new InMemoryClienteRepository();
    useCase = new ListarClientesUseCase(clienteRepo);
  });

  it('deve retornar todos os clientes cadastrados', async () => {
    const email1 = Email.create('cliente1@email.com').value as Email;
    const email2 = Email.create('cliente2@email.com').value as Email;

    await clienteRepo.save({ nome: 'Cliente 1', email: email1 });
    await clienteRepo.save({ nome: 'Cliente 2', email: email2 });

    const result = await useCase.execute();

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.length).toBe(2);
      expect(result.value[0].nome).toBe('Cliente 1');
      expect(result.value[1].nome).toBe('Cliente 2');
    }
  });
});
