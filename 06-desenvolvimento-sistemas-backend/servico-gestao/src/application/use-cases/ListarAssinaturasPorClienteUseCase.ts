import { Assinatura } from '../../domain/entities/Assinatura';
import { IAssinaturaRepository } from '../../domain/repositories/IAssinaturaRepository';
import { IClienteRepository } from '../../domain/repositories/IClienteRepository';
import { DomainError, ClienteNotFoundError } from '../../domain/errors/DomainErrors';
import { Either, left, right } from '../../domain/shared/Either';

export class ListarAssinaturasPorClienteUseCase {
  constructor(
    private readonly assinaturaRepository: IAssinaturaRepository,
    private readonly clienteRepository: IClienteRepository,
  ) {}

  async execute(codCli: number): Promise<Either<DomainError, Assinatura[]>> {
    const cliente = await this.clienteRepository.findById(codCli);
    if (!cliente) {
      return left(new ClienteNotFoundError(codCli));
    }

    const assinaturas = await this.assinaturaRepository.findByCliente(codCli);
    return right(assinaturas);
  }
}
