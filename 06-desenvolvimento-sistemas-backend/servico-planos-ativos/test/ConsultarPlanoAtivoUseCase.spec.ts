import { ConsultarPlanoAtivoUseCase } from '../src/application/use-cases/ConsultarPlanoAtivoUseCase';
import { InvalidarCachePlanoUseCase } from '../src/application/use-cases/InvalidarCachePlanoUseCase';
import { IPlanosAtivosCache, CacheStats } from '../src/domain/services/IPlanosAtivosCache';
import { IServicoGestaoClient } from '../src/domain/services/IServicoGestaoClient';

class MockCache implements IPlanosAtivosCache {
  public map = new Map<number, boolean>();
  public hits = 0;
  public misses = 0;

  get(codAss: number): boolean | undefined {
    if (this.map.has(codAss)) {
      this.hits++;
      return this.map.get(codAss);
    }
    this.misses++;
    return undefined;
  }

  set(codAss: number, ativa: boolean): void {
    this.map.set(codAss, ativa);
  }

  delete(codAss: number): boolean {
    return this.map.delete(codAss);
  }

  clear(): void {
    this.map.clear();
  }

  getStats(): CacheStats {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      size: this.map.size,
      hitRatio: total > 0 ? this.hits / total : 0,
    };
  }
}

class MockGestaoClient implements IServicoGestaoClient {
  public callCount = 0;
  public mockStatus: Record<number, boolean> = {
    1: true,
    2: false,
    5: true,
  };

  async consultarValidadeAssinatura(codAss: number): Promise<boolean> {
    this.callCount++;
    return this.mockStatus[codAss] ?? false;
  }
}

describe('ConsultarPlanoAtivoUseCase & Cache Invalidation', () => {
  let cache: MockCache;
  let client: MockGestaoClient;
  let consultarUseCase: ConsultarPlanoAtivoUseCase;
  let invalidarUseCase: InvalidarCachePlanoUseCase;

  beforeEach(() => {
    cache = new MockCache();
    client = new MockGestaoClient();
    consultarUseCase = new ConsultarPlanoAtivoUseCase(cache, client);
    invalidarUseCase = new InvalidarCachePlanoUseCase(cache);
  });

  it('deve consultar ServicoGestao no primeiro acesso (Cache Miss) e salvar no cache', async () => {
    const result = await consultarUseCase.execute(5);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).toBe(true);
    }
    expect(client.callCount).toBe(1);
    expect(cache.map.get(5)).toBe(true);
    expect(cache.misses).toBe(1);
    expect(cache.hits).toBe(0);
  });

  it('deve retornar do cache no segundo acesso (Cache Hit) sem chamar ServicoGestao', async () => {
    // 1ª chamada -> miss
    await consultarUseCase.execute(5);
    expect(client.callCount).toBe(1);

    // 2ª chamada -> hit
    const result2 = await consultarUseCase.execute(5);
    expect(result2.isRight()).toBe(true);
    if (result2.isRight()) {
      expect(result2.value).toBe(true);
    }
    expect(client.callCount).toBe(1); // Não chamou novamente!
    expect(cache.hits).toBe(1);
  });

  it('deve invalidar o cache quando receber evento de pagamento e forçar nova consulta', async () => {
    // Popula cache
    await consultarUseCase.execute(1);
    expect(client.callCount).toBe(1);

    // Simula evento de pagamento
    invalidarUseCase.execute({
      codAss: 1,
      dia: 1,
      mes: 1,
      ano: 2025,
      valorPago: 10,
    });
    expect(cache.map.has(1)).toBe(false);

    // Próxima consulta deve chamar ServicoGestao novamente
    await consultarUseCase.execute(1);
    expect(client.callCount).toBe(2);
  });

  it('deve retornar erro para código de assinatura inválido', async () => {
    const result = await consultarUseCase.execute(-1);
    expect(result.isLeft()).toBe(true);
  });
});
