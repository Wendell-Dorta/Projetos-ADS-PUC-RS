import { Cliente } from '../../domain/entities/Cliente';
import { ClienteOutputDTO } from '../../application/dtos/ClienteDTOs';

export class ClienteMapper {
  public static toDTO(cliente: Cliente): ClienteOutputDTO {
    return {
      codigo: cliente.codigo,
      nome: cliente.nome,
      email: cliente.email.value,
    };
  }
}
