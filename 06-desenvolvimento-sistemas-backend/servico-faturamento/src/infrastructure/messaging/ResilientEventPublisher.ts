import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import axios from 'axios';
import { IEventPublisher, EventoPagamentoPayload } from '../../domain/services/IEventPublisher';

@Injectable()
export class ResilientEventPublisher implements IEventPublisher {
  private readonly logger = new Logger(ResilientEventPublisher.name);
  private gestaoClient: ClientProxy | null = null;
  private planosAtivosClient: ClientProxy | null = null;
  private readonly gestaoHttpUrl: string;
  private readonly planosAtivosHttpUrl: string;
  private readonly rmqUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.gestaoHttpUrl =
      this.configService.get<string>('SERVICO_GESTAO_URL') || 'http://localhost:3001';
    this.planosAtivosHttpUrl =
      this.configService.get<string>('SERVICO_PLANOS_ATIVOS_URL') || 'http://localhost:3003';
    this.rmqUrl =
      this.configService.get<string>('RABBITMQ_URL') ||
      process.env.RABBITMQ_URL ||
      'amqp://guest:guest@localhost:5672';

    this.initRabbitMQClients();
  }

  private initRabbitMQClients() {
    try {
      this.gestaoClient = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [this.rmqUrl],
          queue: 'gestao_queue',
          queueOptions: { durable: false },
        },
      });

      this.planosAtivosClient = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [this.rmqUrl],
          queue: 'planos_ativos_queue',
          queueOptions: { durable: false },
        },
      });

      this.logger.log(`[RabbitMQ Publisher] Configurado para broker: ${this.rmqUrl}`);
    } catch (err: any) {
      this.logger.warn(`[RabbitMQ Publisher] Falha ao inicializar clientes RMQ: ${err?.message}`);
    }
  }

  async publicarEventoGestao(evento: EventoPagamentoPayload): Promise<void> {
    let rmqSuccess = false;

    if (this.gestaoClient) {
      try {
        this.gestaoClient.emit('PagamentoPlanoServicoGestao', evento);
        this.logger.log(
          `[EVENTO PUBLICADO - RabbitMQ] PagamentoPlanoServicoGestao -> gestao_queue (Assinatura: ${evento.codAss})`,
        );
        rmqSuccess = true;
      } catch (err: any) {
        this.logger.warn(
          `[RabbitMQ] Falha ao emitir PagamentoPlanoServicoGestao via broker: ${err?.message}`,
        );
      }
    }

    // Sincronização resiliente via HTTP fallback
    try {
      await axios.post(`${this.gestaoHttpUrl}/gestao/eventos/pagamento`, evento, {
        timeout: 2000,
      });
      this.logger.log(
        `[EVENTO SINCRONIZADO - HTTP Fallback] ServicoGestao notificado com sucesso (Assinatura: ${evento.codAss})`,
      );
    } catch (httpErr: any) {
      if (!rmqSuccess) {
        this.logger.warn(
          `[ResilientPublisher] ServicoGestao não respondeu via HTTP (${httpErr?.message}).`,
        );
      }
    }
  }

  async publicarEventoPlanosAtivos(evento: EventoPagamentoPayload): Promise<void> {
    let rmqSuccess = false;

    if (this.planosAtivosClient) {
      try {
        this.planosAtivosClient.emit('PagamentoPlanoServicoPlanosAtivos', evento);
        this.logger.log(
          `[EVENTO PUBLICADO - RabbitMQ] PagamentoPlanoServicoPlanosAtivos -> planos_ativos_queue (Assinatura: ${evento.codAss})`,
        );
        rmqSuccess = true;
      } catch (err: any) {
        this.logger.warn(
          `[RabbitMQ] Falha ao emitir PagamentoPlanoServicoPlanosAtivos via broker: ${err?.message}`,
        );
      }
    }

    // Sincronização resiliente via HTTP fallback
    try {
      await axios.post(`${this.planosAtivosHttpUrl}/planosativos/eventos/pagamento`, evento, {
        timeout: 2000,
      });
      this.logger.log(
        `[EVENTO SINCRONIZADO - HTTP Fallback] ServicoPlanosAtivos notificado com sucesso para invalidar cache (Assinatura: ${evento.codAss})`,
      );
    } catch (httpErr: any) {
      if (!rmqSuccess) {
        this.logger.warn(
          `[ResilientPublisher] ServicoPlanosAtivos não respondeu via HTTP (${httpErr?.message}).`,
        );
      }
    }
  }
}
