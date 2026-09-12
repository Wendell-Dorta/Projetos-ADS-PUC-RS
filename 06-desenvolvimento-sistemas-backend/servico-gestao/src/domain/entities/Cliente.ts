import { Email } from '../value-objects/Email';

export class Cliente {
  constructor(
    public readonly codigo: number,
    public readonly nome: string,
    public readonly email: Email,
  ) {}
}
