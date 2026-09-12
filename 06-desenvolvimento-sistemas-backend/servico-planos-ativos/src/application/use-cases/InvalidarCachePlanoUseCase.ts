import { IPlanosAtivosCache } from '../../domain/services/IPlanosAtivosCache';

export interface EventoPagamentoConsumidorPayload {
  dia: number;
  mes: number;
  ano: number;
  codAss: number;
  valorPago: number;
}

export class InvalidarCachePlanoUseCase {
  constructor(private readonly cache: IPlanosAtivosCache) {}

  execute(evento: EventoPagamentoConsumidorPayload): boolean {
    const removido = this.cache.delete(evento.codAss);
    return removido;
  }
}
