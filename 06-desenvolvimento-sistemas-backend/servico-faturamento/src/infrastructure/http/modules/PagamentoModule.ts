import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PagamentoController } from '../../../adapters/controllers/PagamentoController';
import { PrismaService } from '../../database/prisma.service';
import { PrismaPagamentoRepository } from '../../repositories/PrismaPagamentoRepository';
import { ResilientEventPublisher } from '../../messaging/ResilientEventPublisher';
import { RegistrarPagamentoUseCase } from '../../../application/use-cases/RegistrarPagamentoUseCase';
import { ListarPagamentosUseCase } from '../../../application/use-cases/ListarPagamentosUseCase';
import { IPagamentoRepository } from '../../../domain/repositories/IPagamentoRepository';
import { IEventPublisher } from '../../../domain/services/IEventPublisher';

export const PAGAMENTO_REPO_TOKEN = Symbol('PAGAMENTO_REPO_TOKEN');
export const EVENT_PUBLISHER_TOKEN = Symbol('EVENT_PUBLISHER_TOKEN');

@Module({
  imports: [ConfigModule],
  controllers: [PagamentoController],
  providers: [
    PrismaService,
    {
      provide: PAGAMENTO_REPO_TOKEN,
      useClass: PrismaPagamentoRepository,
    },
    {
      provide: EVENT_PUBLISHER_TOKEN,
      useClass: ResilientEventPublisher,
    },
    {
      provide: RegistrarPagamentoUseCase,
      useFactory: (repo: IPagamentoRepository, publisher: IEventPublisher) =>
        new RegistrarPagamentoUseCase(repo, publisher),
      inject: [PAGAMENTO_REPO_TOKEN, EVENT_PUBLISHER_TOKEN],
    },
    {
      provide: ListarPagamentosUseCase,
      useFactory: (repo: IPagamentoRepository) => new ListarPagamentosUseCase(repo),
      inject: [PAGAMENTO_REPO_TOKEN],
    },
  ],
  exports: [PAGAMENTO_REPO_TOKEN, EVENT_PUBLISHER_TOKEN],
})
export class PagamentoModule {}
