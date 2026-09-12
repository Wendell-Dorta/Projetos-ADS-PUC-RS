import { Plano } from '../../domain/entities/Plano';
import { PlanoOutputDTO } from '../../application/dtos/PlanoDTOs';

export class PlanoMapper {
  public static toDTO(plano: Plano): PlanoOutputDTO {
    return {
      codigo: plano.codigo,
      nome: plano.nome,
      custoMensal: plano.custoMensal.value,
      data: plano.data.toISOString(),
      descricao: plano.descricao,
    };
  }
}
