import { Module } from '@nestjs/common';
import { ClienteController } from '../controllers/ClienteController';
import { PrismaClienteRepository } from '../../repositories/PrismaClienteRepository';
import { ListarClientesUseCase } from '../../../application/use-cases/ListarClientesUseCase';
import { CLIENTE_REPOSITORY_TOKEN } from '../../../domain/repositories/tokens';

@Module({
  controllers: [ClienteController],
  providers: [
    {
      provide: CLIENTE_REPOSITORY_TOKEN,
      useClass: PrismaClienteRepository,
    },
    {
      provide: ListarClientesUseCase,
      useFactory: (repo: PrismaClienteRepository) => new ListarClientesUseCase(repo),
      inject: [CLIENTE_REPOSITORY_TOKEN],
    },
  ],
  exports: [CLIENTE_REPOSITORY_TOKEN, ListarClientesUseCase],
})
export class ClienteModule {}
