import { Assinatura } from '../../domain/entities/Assinatura';
import { IAssinaturaRepository } from '../../domain/repositories/IAssinaturaRepository';
import { DomainError, InvalidFilterTypeError } from '../../domain/errors/DomainErrors';
import { Either, left, right } from '../../domain/shared/Either';

export type TipoFiltroAssinatura = 'TODOS' | 'ATIVOS' | 'CANCELADOS';

export class ListarAssinaturasPorTipoUseCase {
  constructor(private readonly assinaturaRepository: IAssinaturaRepository) {}

  async execute(tipo: string): Promise<Either<DomainError, Assinatura[]>> {
    const tipoNormalizado = tipo.toUpperCase() as TipoFiltroAssinatura;

    const todas = await this.assinaturaRepository.findAll();

    if (tipoNormalizado === 'ATIVOS') {
      return right(todas.filter((ass) => ass.isAtiva()));
    }

    if (tipoNormalizado === 'CANCELADOS') {
      return right(todas.filter((ass) => !ass.isAtiva()));
    }

    if (tipoNormalizado === 'TODOS') {
      return right(todas);
    }

    return left(new InvalidFilterTypeError(tipo));
  }
}
