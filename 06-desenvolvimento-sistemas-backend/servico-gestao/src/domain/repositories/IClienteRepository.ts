import { Cliente } from '../entities/Cliente';

export interface IClienteRepository {
  findAll(): Promise<Cliente[]>;
  findById(codigo: number): Promise<Cliente | null>;
  save(cliente: Omit<Cliente, 'codigo'>): Promise<Cliente>;
}
