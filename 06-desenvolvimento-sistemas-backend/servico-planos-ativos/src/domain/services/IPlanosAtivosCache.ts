export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRatio: number;
}

export interface IPlanosAtivosCache {
  get(codAss: number): boolean | undefined;
  set(codAss: number, ativa: boolean, ttlMs?: number): void;
  delete(codAss: number): boolean;
  clear(): void;
  getStats(): CacheStats;
}
