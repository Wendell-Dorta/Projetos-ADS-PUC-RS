import { Cliente } from '../../../src/domain/entities/Cliente';
import { IClienteRepository } from '../../../src/domain/repositories/IClienteRepository';

export class InMemoryClienteRepository implements IClienteRepository {
  public items: Cliente[] = [];

  async findAll(): Promise<Cliente[]> {
    return this.items;
  }

  async findById(codigo: number): Promise<Cliente | null> {
    const cliente = this.items.find((item) => item.codigo === codigo);
    return cliente || null;
  }

  async save(cliente: Omit<Cliente, 'codigo'>): Promise<Cliente> {
    const newCliente = new Cliente(this.items.length + 1, cliente.nome, cliente.email);
    this.items.push(newCliente);
    return newCliente;
  }
}
