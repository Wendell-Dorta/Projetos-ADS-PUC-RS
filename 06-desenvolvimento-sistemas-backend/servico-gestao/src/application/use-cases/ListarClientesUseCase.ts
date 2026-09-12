import { Cliente } from '../../domain/entities/Cliente';
import { IClienteRepository } from '../../domain/repositories/IClienteRepository';
import { DomainError } from '../../domain/errors/DomainErrors';
import { Either, right } from '../../domain/shared/Either';

export class ListarClientesUseCase {
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(): Promise<Either<DomainError, Cliente[]>> {
    const clientes = await this.clienteRepository.findAll();
    return right(clientes);
  }
}
