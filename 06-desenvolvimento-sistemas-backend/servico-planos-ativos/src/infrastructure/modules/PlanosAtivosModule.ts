import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlanosAtivosController } from '../../adapters/controllers/PlanosAtivosController';
import { InMemoryPlanosCache } from '../cache/InMemoryPlanosCache';
import { ServicoGestaoHttpClient } from '../http/ServicoGestaoHttpClient';
import { ConsultarPlanoAtivoUseCase } from '../../application/use-cases/ConsultarPlanoAtivoUseCase';
import { InvalidarCachePlanoUseCase } from '../../application/use-cases/InvalidarCachePlanoUseCase';
import { IPlanosAtivosCache } from '../../domain/services/IPlanosAtivosCache';
import { IServicoGestaoClient } from '../../domain/services/IServicoGestaoClient';

export const CACHE_SERVICE_TOKEN = Symbol('CACHE_SERVICE_TOKEN');
export const GESTAO_CLIENT_TOKEN = Symbol('GESTAO_CLIENT_TOKEN');

@Module({
  imports: [ConfigModule],
  controllers: [PlanosAtivosController],
  providers: [
    {
      provide: CACHE_SERVICE_TOKEN,
      useClass: InMemoryPlanosCache,
    },
    {
      provide: GESTAO_CLIENT_TOKEN,
      useClass: ServicoGestaoHttpClient,
    },
    {
      provide: ConsultarPlanoAtivoUseCase,
      useFactory: (cache: IPlanosAtivosCache, client: IServicoGestaoClient) =>
        new ConsultarPlanoAtivoUseCase(cache, client),
      inject: [CACHE_SERVICE_TOKEN, GESTAO_CLIENT_TOKEN],
    },
    {
      provide: InvalidarCachePlanoUseCase,
      useFactory: (cache: IPlanosAtivosCache) => new InvalidarCachePlanoUseCase(cache),
      inject: [CACHE_SERVICE_TOKEN],
    },
    {
      provide: InMemoryPlanosCache,
      useExisting: CACHE_SERVICE_TOKEN,
    },
  ],
  exports: [CACHE_SERVICE_TOKEN, GESTAO_CLIENT_TOKEN],
})
export class PlanosAtivosModule {}
