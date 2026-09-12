import { Assinatura } from '../../domain/entities/Assinatura';
import { AssinaturaOutputDTO } from '../../application/dtos/AssinaturaDTOs';

export class AssinaturaMapper {
  public static toDTO(assinatura: Assinatura): AssinaturaOutputDTO {
    return {
      codigo: assinatura.codigo,
      codCli: assinatura.codCli,
      codPlano: assinatura.codPlano,
      inicioFidelidade: assinatura.periodoFidelidade.inicio.toISOString(),
      fimFidelidade: assinatura.periodoFidelidade.fim.toISOString(),
      dataUltimoPagamento: assinatura.dataUltimoPagamento.toISOString(),
      custoFinal: assinatura.custoFinal.value,
      descricao: assinatura.descricao,
      status: assinatura.getStatus(),
    };
  }
}
