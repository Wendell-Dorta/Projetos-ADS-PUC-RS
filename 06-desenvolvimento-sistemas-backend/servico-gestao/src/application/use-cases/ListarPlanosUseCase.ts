import { Plano } from '../../domain/entities/Plano';
import { IPlanoRepository } from '../../domain/repositories/IPlanoRepository';
import { DomainError } from '../../domain/errors/DomainErrors';
import { Either, right } from '../../domain/shared/Either';

export class ListarPlanosUseCase {
  constructor(private readonly planoRepository: IPlanoRepository) {}

  async execute(): Promise<Either<DomainError, Plano[]>> {
    const planos = await this.planoRepository.findAll();
    return right(planos);
  }
}
