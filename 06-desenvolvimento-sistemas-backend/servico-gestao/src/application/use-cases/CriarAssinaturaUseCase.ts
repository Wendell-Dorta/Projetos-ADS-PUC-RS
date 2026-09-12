import { Assinatura } from '../../domain/entities/Assinatura';
import { IAssinaturaRepository } from '../../domain/repositories/IAssinaturaRepository';
import { IClienteRepository } from '../../domain/repositories/IClienteRepository';
import { IPlanoRepository } from '../../domain/repositories/IPlanoRepository';
import {
  DomainError,
  ClienteNotFoundError,
  PlanoNotFoundError,
} from '../../domain/errors/DomainErrors';
import { CriarAssinaturaInputDTO } from '../dtos/AssinaturaDTOs';
import { Either, left, right } from '../../domain/shared/Either';
import { Custo } from '../../domain/value-objects/Custo';
import { PeriodoFidelidade } from '../../domain/value-objects/PeriodoFidelidade';

export class CriarAssinaturaUseCase {
  constructor(
    private readonly assinaturaRepository: IAssinaturaRepository,
    private readonly clienteRepository: IClienteRepository,
    private readonly planoRepository: IPlanoRepository,
  ) {}

  async execute(input: CriarAssinaturaInputDTO): Promise<Either<DomainError, Assinatura>> {
    const custoOrError = Custo.create(input.custoFinal);
    if (custoOrError.isLeft()) {
      return left(custoOrError.value);
    }

    const cliente = await this.clienteRepository.findById(input.codCli);
    if (!cliente) {
      return left(new ClienteNotFoundError(input.codCli));
    }

    const plano = await this.planoRepository.findById(input.codPlano);
    if (!plano) {
      return left(new PlanoNotFoundError(input.codPlano));
    }

    const inicioFidelidade = new Date();
    // Fidelidade padrão de 1 ano (365 dias)
    const fimFidelidade = new Date(inicioFidelidade.getTime() + 365 * 24 * 60 * 60 * 1000);

    const periodoOrError = PeriodoFidelidade.create(inicioFidelidade, fimFidelidade);
    if (periodoOrError.isLeft()) {
      return left(periodoOrError.value);
    }

    const dataUltimoPagamento = inicioFidelidade;

    const novaAssinatura = await this.assinaturaRepository.save({
      codCli: input.codCli,
      codPlano: input.codPlano,
      periodoFidelidade: periodoOrError.value,
      dataUltimoPagamento,
      custoFinal: custoOrError.value,
      descricao: input.descricao || '',
    });

    return right(novaAssinatura);
  }
}
