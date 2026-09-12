import { Module } from '@nestjs/common';
import { AssinaturaController } from '../controllers/AssinaturaController';
import { PrismaAssinaturaRepository } from '../../repositories/PrismaAssinaturaRepository';
import { ClienteModule } from './ClienteModule';
import { PlanoModule } from './PlanoModule';
import { CriarAssinaturaUseCase } from '../../../application/use-cases/CriarAssinaturaUseCase';
import { ListarAssinaturasPorTipoUseCase } from '../../../application/use-cases/ListarAssinaturasPorTipoUseCase';
import { ListarAssinaturasPorClienteUseCase } from '../../../application/use-cases/ListarAssinaturasPorClienteUseCase';
import { ListarAssinaturasPorPlanoUseCase } from '../../../application/use-cases/ListarAssinaturasPorPlanoUseCase';
import {
  ASSINATURA_REPOSITORY_TOKEN,
  CLIENTE_REPOSITORY_TOKEN,
  PLANO_REPOSITORY_TOKEN,
} from '../../../domain/repositories/tokens';
import { IAssinaturaRepository } from '../../../domain/repositories/IAssinaturaRepository';
import { IClienteRepository } from '../../../domain/repositories/IClienteRepository';
import { IPlanoRepository } from '../../../domain/repositories/IPlanoRepository';

@Module({
  imports: [ClienteModule, PlanoModule],
  controllers: [AssinaturaController],
  providers: [
    {
      provide: ASSINATURA_REPOSITORY_TOKEN,
      useClass: PrismaAssinaturaRepository,
    },
    {
      provide: CriarAssinaturaUseCase,
      useFactory: (
        assRepo: IAssinaturaRepository,
        cliRepo: IClienteRepository,
        planoRepo: IPlanoRepository,
      ) => new CriarAssinaturaUseCase(assRepo, cliRepo, planoRepo),
      inject: [ASSINATURA_REPOSITORY_TOKEN, CLIENTE_REPOSITORY_TOKEN, PLANO_REPOSITORY_TOKEN],
    },
    {
      provide: ListarAssinaturasPorTipoUseCase,
      useFactory: (repo: IAssinaturaRepository) => new ListarAssinaturasPorTipoUseCase(repo),
      inject: [ASSINATURA_REPOSITORY_TOKEN],
    },
    {
      provide: ListarAssinaturasPorClienteUseCase,
      useFactory: (assRepo: IAssinaturaRepository, cliRepo: IClienteRepository) =>
        new ListarAssinaturasPorClienteUseCase(assRepo, cliRepo),
      inject: [ASSINATURA_REPOSITORY_TOKEN, CLIENTE_REPOSITORY_TOKEN],
    },
    {
      provide: ListarAssinaturasPorPlanoUseCase,
      useFactory: (assRepo: IAssinaturaRepository, planoRepo: IPlanoRepository) =>
        new ListarAssinaturasPorPlanoUseCase(assRepo, planoRepo),
      inject: [ASSINATURA_REPOSITORY_TOKEN, PLANO_REPOSITORY_TOKEN],
    },
  ],
})
export class AssinaturaModule {}
