import { Module } from '@nestjs/common';
import { PlanoController } from '../controllers/PlanoController';
import { PrismaPlanoRepository } from '../../repositories/PrismaPlanoRepository';
import { ListarPlanosUseCase } from '../../../application/use-cases/ListarPlanosUseCase';
import { AtualizarCustoMensalPlanoUseCase } from '../../../application/use-cases/AtualizarCustoMensalPlanoUseCase';
import { PLANO_REPOSITORY_TOKEN } from '../../../domain/repositories/tokens';

@Module({
  controllers: [PlanoController],
  providers: [
    {
      provide: PLANO_REPOSITORY_TOKEN,
      useClass: PrismaPlanoRepository,
    },
    {
      provide: ListarPlanosUseCase,
      useFactory: (repo: PrismaPlanoRepository) => new ListarPlanosUseCase(repo),
      inject: [PLANO_REPOSITORY_TOKEN],
    },
    {
      provide: AtualizarCustoMensalPlanoUseCase,
      useFactory: (repo: PrismaPlanoRepository) => new AtualizarCustoMensalPlanoUseCase(repo),
      inject: [PLANO_REPOSITORY_TOKEN],
    },
  ],
  exports: [PLANO_REPOSITORY_TOKEN, ListarPlanosUseCase, AtualizarCustoMensalPlanoUseCase],
})
export class PlanoModule {}
