import { Either, left, right } from '../shared/Either';
import { InvalidCustoMensalError } from '../errors/DomainErrors';

export class Custo {
  private constructor(public readonly value: number) {}

  public static create(valor: number): Either<InvalidCustoMensalError, Custo> {
    if (typeof valor !== 'number' || isNaN(valor) || valor < 0) {
      return left(new InvalidCustoMensalError());
    }
    return right(new Custo(valor));
  }

  public equals(other: Custo): boolean {
    return this.value === other.value;
  }
}
