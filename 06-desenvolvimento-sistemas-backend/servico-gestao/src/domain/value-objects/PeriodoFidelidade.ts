import { Either, left, right } from '../shared/Either';
import { InvalidPeriodoFidelidadeError } from '../errors/DomainErrors';

export class PeriodoFidelidade {
  private constructor(
    public readonly inicio: Date,
    public readonly fim: Date,
  ) {}

  public static create(
    inicio: Date,
    fim: Date,
  ): Either<InvalidPeriodoFidelidadeError, PeriodoFidelidade> {
    if (!inicio || !fim || fim.getTime() <= inicio.getTime()) {
      return left(new InvalidPeriodoFidelidadeError());
    }
    return right(new PeriodoFidelidade(inicio, fim));
  }

  public equals(other: PeriodoFidelidade): boolean {
    return (
      this.inicio.getTime() === other.inicio.getTime() && this.fim.getTime() === other.fim.getTime()
    );
  }
}
