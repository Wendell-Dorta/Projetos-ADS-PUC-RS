import { IAssinaturaRepository } from '../../domain/repositories/IAssinaturaRepository';
import { Either, left, right } from '../../domain/shared/Either';
import { DomainError, AssinaturaNotFoundError } from '../../domain/errors/DomainErrors';

export interface StatusAssinaturaOutput {
  codAss: number;
  codCli: number;
  codPlano: number;
  ativa: boolean;
  status: 'ATIVO' | 'CANCELADO';
  dataUltimoPagamento: Date;
}

export class VerificarAssinaturaAtivaUseCase {
  constructor(private readonly assinaturaRepo: IAssinaturaRepository) {}

  async execute(codAss: number): Promise<Either<DomainError, StatusAssinaturaOutput>> {
    if (!codAss || codAss <= 0) {
      return left(new DomainError('Código da assinatura deve ser um número positivo válido.'));
    }

    const assinatura = await this.assinaturaRepo.findById(codAss);
    if (!assinatura) {
      return left(new AssinaturaNotFoundError(codAss));
    }

    return right({
      codAss: assinatura.codigo,
      codCli: assinatura.codCli,
      codPlano: assinatura.codPlano,
      ativa: assinatura.isAtiva(),
      status: assinatura.getStatus(),
      dataUltimoPagamento: assinatura.dataUltimoPagamento,
    });
  }
}
