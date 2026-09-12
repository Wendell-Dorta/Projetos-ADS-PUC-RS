import { Pagamento } from '../../domain/entities/Pagamento';
import { PagamentoOutputDTO } from '../../application/dtos/PagamentoDTOs';

export class PagamentoMapper {
  public static toDTO(entity: Pagamento): PagamentoOutputDTO {
    return {
      codigo: entity.codigo,
      codAss: entity.codAss,
      valorPago: entity.valorPago,
      dataPagamento: entity.dataPagamento.toISOString(),
      dia: entity.dia,
      mes: entity.mes,
      ano: entity.ano,
      criadoEm: entity.criadoEm.toISOString(),
    };
  }
}
