import { Assinatura } from '../../domain/entities/Assinatura';
import { IAssinaturaRepository } from '../../domain/repositories/IAssinaturaRepository';
import { IPlanoRepository } from '../../domain/repositories/IPlanoRepository';
import { DomainError, PlanoNotFoundError } from '../../domain/errors/DomainErrors';
import { Either, left, right } from '../../domain/shared/Either';

export class ListarAssinaturasPorPlanoUseCase {
  constructor(
    private readonly assinaturaRepository: IAssinaturaRepository,
    private readonly planoRepository: IPlanoRepository,
  ) {}

  async execute(codPlano: number): Promise<Either<DomainError, Assinatura[]>> {
    const plano = await this.planoRepository.findById(codPlano);
    if (!plano) {
      return left(new PlanoNotFoundError(codPlano));
    }

    const assinaturas = await this.assinaturaRepository.findByPlano(codPlano);
    return right(assinaturas);
  }
}
