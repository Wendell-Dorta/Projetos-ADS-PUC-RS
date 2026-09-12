import { Assinatura } from '../entities/Assinatura';
import { Custo } from '../value-objects/Custo';
import { PeriodoFidelidade } from '../value-objects/PeriodoFidelidade';

export interface CriarAssinaturaProps {
  codPlano: number;
  codCli: number;
  periodoFidelidade: PeriodoFidelidade;
  dataUltimoPagamento: Date;
  custoFinal: Custo;
  descricao: string;
}

export interface IAssinaturaRepository {
  findAll(): Promise<Assinatura[]>;
  findById(codigo: number): Promise<Assinatura | null>;
  findByCliente(codCli: number): Promise<Assinatura[]>;
  findByPlano(codPlano: number): Promise<Assinatura[]>;
  save(assinatura: CriarAssinaturaProps): Promise<Assinatura>;
  atualizarPagamento(codigo: number, dataPagamento: Date): Promise<Assinatura | null>;
}
