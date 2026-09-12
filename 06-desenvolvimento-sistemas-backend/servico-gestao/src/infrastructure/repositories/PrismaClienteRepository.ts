import { Injectable } from '@nestjs/common';
import { Cliente } from '../../domain/entities/Cliente';
import { IClienteRepository } from '../../domain/repositories/IClienteRepository';
import { PrismaService } from '../database/prisma.service';
import { Email } from '../../domain/value-objects/Email';

@Injectable()
export class PrismaClienteRepository implements IClienteRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(r: any): Cliente {
    const emailOrError = Email.create(r.email);
    if (emailOrError.isLeft()) {
      throw emailOrError.value;
    }
    return new Cliente(r.codigo, r.nome, emailOrError.value);
  }

  async findAll(): Promise<Cliente[]> {
    const records = await this.prisma.cliente.findMany({
      orderBy: { codigo: 'asc' },
    });
    return records.map((r) => this.toEntity(r));
  }

  async findById(codigo: number): Promise<Cliente | null> {
    const record = await this.prisma.cliente.findUnique({
      where: { codigo },
    });
    if (!record) return null;
    return this.toEntity(record);
  }

  async save(cliente: Omit<Cliente, 'codigo'>): Promise<Cliente> {
    const record = await this.prisma.cliente.create({
      data: {
        nome: cliente.nome,
        email: cliente.email.value,
      },
    });
    return this.toEntity(record);
  }
}
