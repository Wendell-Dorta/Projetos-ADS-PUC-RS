import { Plano } from '../entities/Plano';
import { Custo } from '../value-objects/Custo';

export interface IPlanoRepository {
  findAll(): Promise<Plano[]>;
  findById(codigo: number): Promise<Plano | null>;
  updateCustoMensal(codigo: number, custoMensal: Custo): Promise<Plano | null>;
  save(plano: Omit<Plano, 'codigo' | 'data'>): Promise<Plano>;
}
