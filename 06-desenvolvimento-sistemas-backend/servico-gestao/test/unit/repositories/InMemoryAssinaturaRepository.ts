import { Assinatura } from '../../../src/domain/entities/Assinatura';
import {
  IAssinaturaRepository,
  CriarAssinaturaProps,
} from '../../../src/domain/repositories/IAssinaturaRepository';

export class InMemoryAssinaturaRepository implements IAssinaturaRepository {
  public items: Assinatura[] = [];

  async findAll(): Promise<Assinatura[]> {
    return this.items;
  }

  async findById(codigo: number): Promise<Assinatura | null> {
    const item = this.items.find((ass) => ass.codigo === codigo);
    return item || null;
  }

  async findByCliente(codCli: number): Promise<Assinatura[]> {
    return this.items.filter((ass) => ass.codCli === codCli);
  }

  async findByPlano(codPlano: number): Promise<Assinatura[]> {
    return this.items.filter((ass) => ass.codPlano === codPlano);
  }

  async save(props: CriarAssinaturaProps): Promise<Assinatura> {
    const newAss = new Assinatura(
      this.items.length + 1,
      props.codPlano,
      props.codCli,
      props.periodoFidelidade,
      props.dataUltimoPagamento,
      props.custoFinal,
      props.descricao,
    );
    this.items.push(newAss);
    return newAss;
  }
}
