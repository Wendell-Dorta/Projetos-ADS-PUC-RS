import { Injectable } from '@nestjs/common';
import { Plano } from '../../domain/entities/Plano';
import { IPlanoRepository } from '../../domain/repositories/IPlanoRepository';
import { PrismaService } from '../database/prisma.service';
import { Custo } from '../../domain/value-objects/Custo';

@Injectable()
export class PrismaPlanoRepository implements IPlanoRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(r: any): Plano {
    const custoOrError = Custo.create(r.custoMensal);
    if (custoOrError.isLeft()) {
      throw custoOrError.value;
    }
    return new Plano(r.codigo, r.nome, custoOrError.value, r.data, r.descricao);
  }

  async findAll(): Promise<Plano[]> {
    const records = await this.prisma.plano.findMany({
      orderBy: { codigo: 'asc' },
    });
    return records.map((r) => this.toEntity(r));
  }

  async findById(codigo: number): Promise<Plano | null> {
    const record = await this.prisma.plano.findUnique({
      where: { codigo },
    });
    if (!record) return null;
    return this.toEntity(record);
  }

  async updateCustoMensal(codigo: number, custoMensal: Custo): Promise<Plano | null> {
    try {
      const record = await this.prisma.plano.update({
        where: { codigo },
        data: {
          custoMensal: custoMensal.value,
          data: new Date(),
        },
      });
      return this.toEntity(record);
    } catch {
      return null;
    }
  }

  async save(plano: Omit<Plano, 'codigo' | 'data'>): Promise<Plano> {
    const record = await this.prisma.plano.create({
      data: {
        nome: plano.nome,
        custoMensal: plano.custoMensal.value,
        descricao: plano.descricao,
        data: new Date(),
      },
    });
    return this.toEntity(record);
  }
}
