import { Custo } from '../value-objects/Custo';
import { PeriodoFidelidade } from '../value-objects/PeriodoFidelidade';

export type StatusAssinatura = 'ATIVO' | 'CANCELADO';

export class Assinatura {
  constructor(
    public readonly codigo: number,
    public readonly codPlano: number,
    public readonly codCli: number,
    public readonly periodoFidelidade: PeriodoFidelidade,
    public readonly dataUltimoPagamento: Date,
    public readonly custoFinal: Custo,
    public readonly descricao: string,
  ) {}

  /**
   * Regra de Negócio: A assinatura é considerada ATIVA se o pagamento mais recente
   * tiver sido realizado há no máximo 30 dias (sem tolerância a atraso).
   * Caso contrário, a assinatura possui status CANCELADO.
   *
   * Otimização Assintótica O(1) de Tempo e Espaço Auxiliar.
   */
  public isAtiva(dataReferencia: Date = new Date()): boolean {
    const msPorDia = 1000 * 60 * 60 * 24;
    const diffEmDias = Math.floor(
      (dataReferencia.getTime() - this.dataUltimoPagamento.getTime()) / msPorDia,
    );
    return diffEmDias <= 30;
  }

  public getStatus(dataReferencia: Date = new Date()): StatusAssinatura {
    return this.isAtiva(dataReferencia) ? 'ATIVO' : 'CANCELADO';
  }
}
