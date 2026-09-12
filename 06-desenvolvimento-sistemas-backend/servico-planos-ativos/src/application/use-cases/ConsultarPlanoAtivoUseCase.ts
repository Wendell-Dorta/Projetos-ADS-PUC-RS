import { IPlanosAtivosCache } from '../../domain/services/IPlanosAtivosCache';
import { IServicoGestaoClient } from '../../domain/services/IServicoGestaoClient';
import { Either, left, right } from '../../domain/shared/Either';
import { DomainException } from '../../domain/errors/DomainException';

export interface ConsultaPlanoAtivoResult {
  codAss: number;
  ativo: boolean;
  origem: 'CACHE' | 'SERVICO_GESTAO';
}

export class ConsultarPlanoAtivoUseCase {
  constructor(
    private readonly cache: IPlanosAtivosCache,
    private readonly gestaoClient: IServicoGestaoClient,
  ) {}

  async execute(codAss: number): Promise<Either<DomainException, boolean>> {
    if (!codAss || codAss <= 0) {
      return left(new DomainException('Código da assinatura deve ser um número inteiro positivo.'));
    }

    // 1. Consulta o Cache Local interno
    const valorEmCache = this.cache.get(codAss);
    if (valorEmCache !== undefined) {
      return right(valorEmCache);
    }

    // 2. Cache Miss: Consulta o ServicoGestao
    try {
      const estaAtivo = await this.gestaoClient.consultarValidadeAssinatura(codAss);
      // 3. Registra no Cache para consultas subsequentes de alta performance
      this.cache.set(codAss, estaAtivo);
      return right(estaAtivo);
    } catch (err: any) {
      return left(
        new DomainException(
          `Falha ao consultar validade da assinatura ${codAss} no ServicoGestao: ${err?.message || err}`,
        ),
      );
    }
  }
}
