import { Custo } from '../value-objects/Custo';

export class Plano {
  constructor(
    public readonly codigo: number,
    public readonly nome: string,
    public readonly custoMensal: Custo,
    public readonly data: Date,
    public readonly descricao: string,
  ) {}
}
