export class DomainError extends Error {
  public readonly statusCode: number = 400;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ClienteNotFoundError extends DomainError {
  override readonly statusCode: number = 404;

  constructor(public readonly codCli: number) {
    super(`Cliente com código ${codCli} não foi encontrado.`);
  }
}

export class PlanoNotFoundError extends DomainError {
  override readonly statusCode: number = 404;

  constructor(public readonly codPlano: number) {
    super(`Plano com código ${codPlano} não foi encontrado.`);
  }
}

export class InvalidCustoMensalError extends DomainError {
  constructor(message: string = 'O custo do plano não pode ser negativo.') {
    super(message);
  }
}

export class InvalidEmailError extends DomainError {
  constructor(public readonly email: string) {
    super(`O endereço de e-mail '${email}' é inválido.`);
  }
}

export class InvalidPeriodoFidelidadeError extends DomainError {
  constructor(
    message: string = 'A data de término da fidelidade deve ser posterior à data de início.',
  ) {
    super(message);
  }
}

export class InvalidFilterTypeError extends DomainError {
  constructor(tipo: string) {
    super(
      `Tipo de filtro de assinatura inválido: '${tipo}'. Tipos válidos: TODOS, ATIVOS, CANCELADOS.`,
    );
  }
}
