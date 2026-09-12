import { CircuitBreaker, CircuitState } from '../src/circuit-breaker';

describe('CircuitBreaker', () => {
  it('deve iniciar no estado CLOSED e permitir requisições', () => {
    const breaker = new CircuitBreaker('TesteService', 3, 1000);
    expect(breaker.getState()).toBe(CircuitState.CLOSED);
    expect(breaker.canPass()).toBe(true);
  });

  it('deve transitar para OPEN após atingir o limite de falhas', () => {
    const breaker = new CircuitBreaker('TesteService', 3, 1000);
    breaker.recordFailure();
    breaker.recordFailure();
    expect(breaker.getState()).toBe(CircuitState.CLOSED);

    breaker.recordFailure(); // 3ª falha
    expect(breaker.getState()).toBe(CircuitState.OPEN);
    expect(breaker.canPass()).toBe(false);
  });

  it('deve retornar para CLOSED quando registrar sucesso', () => {
    const breaker = new CircuitBreaker('TesteService', 3, 1000);
    breaker.recordFailure();
    breaker.recordFailure();
    breaker.recordSuccess();

    expect(breaker.getState()).toBe(CircuitState.CLOSED);
    expect(breaker.getStats().failureCount).toBe(0);
  });
});
