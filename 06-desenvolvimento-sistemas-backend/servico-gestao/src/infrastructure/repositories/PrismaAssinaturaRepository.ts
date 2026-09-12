import { Injectable } from '@nestjs/common';
import { Assinatura } from '../../domain/entities/Assinatura';
import {
  IAssinaturaRepository,
  CriarAssinaturaProps,
} from '../../domain/repositories/IAssinaturaRepository';
import { PrismaService } from '../database/prisma.service';
import { Custo } from '../../domain/value-objects/Custo';
import { PeriodoFidelidade } from '../../domain/value-objects/PeriodoFidelidade';

@Injectable()
export class PrismaAssinaturaRepository implements IAssinaturaRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(r: any): Assinatura {
    const custoOrError = Custo.create(r.custoFinal);
    if (custoOrError.isLeft()) {
      throw custoOrError.value;
    }

    const periodoOrError = PeriodoFidelidade.create(r.inicioFidelidade, r.fimFidelidade);
    if (periodoOrError.isLeft()) {
      throw periodoOrError.value;
    }

    return new Assinatura(
      r.codigo,
      r.codPlano,
      r.codCli,
      periodoOrError.value,
      r.dataUltimoPagamento,
      custoOrError.value,
      r.descricao,
    );
  }

  async findAll(): Promise<Assinatura[]> {
    const records = await this.prisma.assinatura.findMany({
      orderBy: { codigo: 'asc' },
    });
    return records.map((r) => this.toEntity(r));
  }

  async findById(codigo: number): Promise<Assinatura | null> {
    const record = await this.prisma.assinatura.findUnique({
      where: { codigo },
    });
    if (!record) return null;
    return this.toEntity(record);
  }

  async findByCliente(codCli: number): Promise<Assinatura[]> {
    const records = await this.prisma.assinatura.findMany({
      where: { codCli },
      orderBy: { codigo: 'asc' },
    });
    return records.map((r) => this.toEntity(r));
  }

  async findByPlano(codPlano: number): Promise<Assinatura[]> {
    const records = await this.prisma.assinatura.findMany({
      where: { codPlano },
      orderBy: { codigo: 'asc' },
    });
    return records.map((r) => this.toEntity(r));
  }

  async save(assinatura: CriarAssinaturaProps): Promise<Assinatura> {
    const record = await this.prisma.assinatura.create({
      data: {
        codCli: assinatura.codCli,
        codPlano: assinatura.codPlano,
        inicioFidelidade: assinatura.periodoFidelidade.inicio,
        fimFidelidade: assinatura.periodoFidelidade.fim,
        dataUltimoPagamento: assinatura.dataUltimoPagamento,
        custoFinal: assinatura.custoFinal.value,
        descricao: assinatura.descricao,
      },
    });
    return this.toEntity(record);
  }
}
