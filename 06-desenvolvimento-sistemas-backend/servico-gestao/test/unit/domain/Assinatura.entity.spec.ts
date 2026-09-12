import { Assinatura } from '../../../src/domain/entities/Assinatura';
import { Custo } from '../../../src/domain/value-objects/Custo';
import { PeriodoFidelidade } from '../../../src/domain/value-objects/PeriodoFidelidade';

describe('Assinatura Entity', () => {
  it('deve ser considerada ATIVA se o ultimo pagamento ocorreu ha no maximo 30 dias', () => {
    const agora = new Date();
    const dataPagamentoRecente = new Date(agora.getTime() - 10 * 24 * 60 * 60 * 1000); // 10 dias atras

    const custo = Custo.create(100).value as Custo;
    const periodo = PeriodoFidelidade.create(
      agora,
      new Date(agora.getTime() + 365 * 24 * 60 * 60 * 1000),
    ).value as PeriodoFidelidade;

    const assinatura = new Assinatura(
      1,
      10,
      20,
      periodo,
      dataPagamentoRecente,
      custo,
      'Assinatura teste ativa',
    );

    expect(assinatura.isAtiva(agora)).toBe(true);
    expect(assinatura.getStatus(agora)).toBe('ATIVO');
  });

  it('deve ser considerada CANCELADO se o ultimo pagamento ocorreu ha mais de 30 dias', () => {
    const agora = new Date();
    const dataPagamentoAntigo = new Date(agora.getTime() - 45 * 24 * 60 * 60 * 1000); // 45 dias atras

    const custo = Custo.create(100).value as Custo;
    const periodo = PeriodoFidelidade.create(
      agora,
      new Date(agora.getTime() + 365 * 24 * 60 * 60 * 1000),
    ).value as PeriodoFidelidade;

    const assinatura = new Assinatura(
      1,
      10,
      20,
      periodo,
      dataPagamentoAntigo,
      custo,
      'Assinatura teste inativa',
    );

    expect(assinatura.isAtiva(agora)).toBe(false);
    expect(assinatura.getStatus(agora)).toBe('CANCELADO');
  });
});
