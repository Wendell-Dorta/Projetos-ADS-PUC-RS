export class Pagamento {
  constructor(
    public readonly codigo: number,
    public readonly codAss: number,
    public readonly valorPago: number,
    public readonly dataPagamento: Date,
    public readonly dia: number,
    public readonly mes: number,
    public readonly ano: number,
    public readonly criadoEm: Date = new Date(),
  ) {}

  public static criar(
    codAss: number,
    valorPago: number,
    dia: number,
    mes: number,
    ano: number,
    codigo: number = 0,
    criadoEm: Date = new Date(),
  ): Pagamento {
    const dataPagamento = new Date(Date.UTC(ano, mes - 1, dia));
    return new Pagamento(codigo, codAss, valorPago, dataPagamento, dia, mes, ano, criadoEm);
  }
}
