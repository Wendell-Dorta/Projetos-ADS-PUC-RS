import { Plano } from '../../domain/entities/Plano';
import { IPlanoRepository } from '../../domain/repositories/IPlanoRepository';
import { DomainError, PlanoNotFoundError } from '../../domain/errors/DomainErrors';
import { AtualizarCustoMensalInputDTO } from '../dtos/PlanoDTOs';
import { Either, left, right } from '../../domain/shared/Either';
import { Custo } from '../../domain/value-objects/Custo';

export class AtualizarCustoMensalPlanoUseCase {
  constructor(private readonly planoRepository: IPlanoRepository) {}

  async execute(input: AtualizarCustoMensalInputDTO): Promise<Either<DomainError, Plano>> {
    const custoOrError = Custo.create(input.custoMensal);
    if (custoOrError.isLeft()) {
      return left(custoOrError.value);
    }

    const planoAtualizado = await this.planoRepository.updateCustoMensal(
      input.idPlano,
      custoOrError.value,
    );

    if (!planoAtualizado) {
      return left(new PlanoNotFoundError(input.idPlano));
    }

    return right(planoAtualizado);
  }
}
