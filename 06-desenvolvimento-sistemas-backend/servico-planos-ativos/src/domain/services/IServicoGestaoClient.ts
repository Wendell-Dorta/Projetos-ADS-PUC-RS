export interface IServicoGestaoClient {
  consultarValidadeAssinatura(codAss: number): Promise<boolean>;
}
