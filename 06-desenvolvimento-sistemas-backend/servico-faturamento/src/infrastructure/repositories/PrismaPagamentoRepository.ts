import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { IPagamentoRepository, SalvarPagamentoProps } from '../../domain/repositories/IPagamentoRepository';
import { Pagamento } from '../../domain/entities/Pagamento';

@Injectable()
export class PrismaPagamentoRepository implements IPagamentoRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(r: any): Pagamento {
    return new Pagamento(
      r.codigo,
      r.codAss,
      r.valorPago,
      r.dataPagamento,
      r.dia,
      r.mes,
      r.ano,
      r.criadoEm,
    );
  }

  async salvar(props: SalvarPagamentoProps): Promise<Pagamento> {
    const record = await this.prisma.pagamento.create({
      data: {
        codAss: props.codAss,
        valorPago: props.valorPago,
        dia: props.dia,
        mes: props.mes,
        ano: props.ano,
        dataPagamento: props.dataPagamento,
      },
    });
    return this.toEntity(record);
  }

  async buscarTodos(): Promise<Pagamento[]> {
    const records = await this.prisma.pagamento.findMany({
      orderBy: { codigo: 'desc' },
    });
    return records.map((r) => this.toEntity(r));
  }

  async buscarPorAssinatura(codAss: number): Promise<Pagamento[]> {
    const records = await this.prisma.pagamento.findMany({
      where: { codAss },
      orderBy: { dataPagamento: 'desc' },
    });
    return records.map((r) => this.toEntity(r));
  }

  async buscarPorCodigo(codigo: number): Promise<Pagamento | null> {
    const record = await this.prisma.pagamento.findUnique({
      where: { codigo },
    });
    if (!record) return null;
    return this.toEntity(record);
  }
}
