import { Injectable, Logger } from '@nestjs/common';
import { IPlanosAtivosCache, CacheStats } from '../../domain/services/IPlanosAtivosCache';

interface CacheEntry {
  ativa: boolean;
  expiresAt: number;
}

@Injectable()
export class InMemoryPlanosCache implements IPlanosAtivosCache {
  private readonly logger = new Logger(InMemoryPlanosCache.name);
  private readonly cache = new Map<number, CacheEntry>();
  private hits = 0;
  private misses = 0;
  private readonly defaultTtlMs: number;

  constructor() {
    this.defaultTtlMs = parseInt(process.env.CACHE_TTL_MS || '300000', 10); // 5 min padrão
  }

  get(codAss: number): boolean | undefined {
    const entry = this.cache.get(codAss);
    if (!entry) {
      this.misses++;
      this.logger.log(`[CACHE MISS] Assinatura ${codAss} não encontrada no cache.`);
      return undefined;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(codAss);
      this.misses++;
      this.logger.log(`[CACHE EXPIRED] Entrada expirada para assinatura ${codAss}.`);
      return undefined;
    }

    this.hits++;
    this.logger.log(`[CACHE HIT] Assinatura ${codAss} encontrada em cache: ativo = ${entry.ativa}`);
    return entry.ativa;
  }

  set(codAss: number, ativa: boolean, ttlMs?: number): void {
    const ttl = ttlMs !== undefined ? ttlMs : this.defaultTtlMs;
    const expiresAt = Date.now() + ttl;
    this.cache.set(codAss, { ativa, expiresAt });
    this.logger.log(
      `[CACHE SET] Assinatura ${codAss} armazenada em cache: ativo = ${ativa} (TTL: ${ttl}ms)`,
    );
  }

  delete(codAss: number): boolean {
    const existed = this.cache.delete(codAss);
    if (existed) {
      this.logger.log(
        `[CACHE INVALIDATED] Entrada da assinatura ${codAss} removida do cache por evento de pagamento.`,
      );
    }
    return existed;
  }

  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
    this.logger.log(`[CACHE CLEARED] Cache limpo.`);
  }

  getStats(): CacheStats {
    const total = this.hits + this.misses;
    const hitRatio = total > 0 ? Number((this.hits / total).toFixed(4)) : 0;
    return {
      hits: this.hits,
      misses: this.misses,
      size: this.cache.size,
      hitRatio,
    };
  }
}
