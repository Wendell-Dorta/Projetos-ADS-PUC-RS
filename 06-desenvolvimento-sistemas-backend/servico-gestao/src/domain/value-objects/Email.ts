import { Either, left, right } from '../shared/Either';
import { InvalidEmailError } from '../errors/DomainErrors';

export class Email {
  private constructor(public readonly value: string) {}

  public static create(email: string): Either<InvalidEmailError, Email> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return left(new InvalidEmailError(email));
    }
    return right(new Email(email));
  }

  public equals(other: Email): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase();
  }
}
