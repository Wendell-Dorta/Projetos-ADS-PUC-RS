export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private lastFailureTime = 0;
  private readonly failureThreshold: number;
  private readonly recoveryTimeoutMs: number;

  constructor(
    public readonly name: string,
    failureThreshold = 5,
    recoveryTimeoutMs = 10000,
  ) {
    this.failureThreshold = failureThreshold;
    this.recoveryTimeoutMs = recoveryTimeoutMs;
  }

  public canPass(): boolean {
    if (this.state === CircuitState.CLOSED) {
      return true;
    }

    const now = Date.now();
    if (this.state === CircuitState.OPEN) {
      if (now - this.lastFailureTime > this.recoveryTimeoutMs) {
        this.state = CircuitState.HALF_OPEN;
        console.log(`[CircuitBreaker:${this.name}] Transição para HALF_OPEN (tentando recuperação)`);
        return true;
      }
      return false;
    }

    // HALF_OPEN
    return true;
  }

  public recordSuccess(): void {
    if (this.state !== CircuitState.CLOSED) {
      console.log(`[CircuitBreaker:${this.name}] Sucesso registrado. Circuito FECHADO (normalizado).`);
    }
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
  }

  public recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold || this.state === CircuitState.HALF_OPEN) {
      this.state = CircuitState.OPEN;
      console.warn(
        `[CircuitBreaker:${this.name}] Falhas consecutivas atingidas (${this.failureCount}). Circuito ABERTO.`,
      );
    }
  }

  public getState(): CircuitState {
    return this.state;
  }

  public getStats() {
    return {
      name: this.name,
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime ? new Date(this.lastFailureTime).toISOString() : null,
    };
  }
}
