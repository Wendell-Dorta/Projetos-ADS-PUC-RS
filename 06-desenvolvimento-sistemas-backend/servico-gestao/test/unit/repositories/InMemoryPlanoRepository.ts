import { Plano } from '../../../src/domain/entities/Plano';
import { IPlanoRepository } from '../../../src/domain/repositories/IPlanoRepository';
import { Custo } from '../../../src/domain/value-objects/Custo';

export class InMemoryPlanoRepository implements IPlanoRepository {
  public items: Plano[] = [];

  async findAll(): Promise<Plano[]> {
    return this.items;
  }

  async findById(codigo: number): Promise<Plano | null> {
    const plano = this.items.find((item) => item.codigo === codigo);
    return plano || null;
  }

  async updateCustoMensal(codigo: number, custoMensal: Custo): Promise<Plano | null> {
    const index = this.items.findIndex((item) => item.codigo === codigo);
    if (index === -1) return null;

    const old = this.items[index];
    const updated = new Plano(old.codigo, old.nome, custoMensal, new Date(), old.descricao);
    this.items[index] = updated;
    return updated;
  }

  async save(plano: Omit<Plano, 'codigo' | 'data'>): Promise<Plano> {
    const newPlano = new Plano(
      this.items.length + 1,
      plano.nome,
      plano.custoMensal,
      new Date(),
      plano.descricao,
    );
    this.items.push(newPlano);
    return newPlano;
  }
}
