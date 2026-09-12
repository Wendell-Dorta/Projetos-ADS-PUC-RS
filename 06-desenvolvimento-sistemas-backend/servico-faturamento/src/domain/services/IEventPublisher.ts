export interface EventoPagamentoPayload {
  dia: number;
  mes: number;
  ano: number;
  codAss: number;
  valorPago: number;
}

export interface IEventPublisher {
  publicarEventoGestao(evento: EventoPagamentoPayload): Promise<void>;
  publicarEventoPlanosAtivos(evento: EventoPagamentoPayload): Promise<void>;
}
