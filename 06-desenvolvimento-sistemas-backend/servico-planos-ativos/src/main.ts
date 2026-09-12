import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import { AppModule } from './infrastructure/modules/AppModule';
import { DomainExceptionFilter } from './infrastructure/http/filters/DomainExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // 1. Logger Pino
  app.useLogger(app.get(Logger));

  // 2. Segurança de cabeçalhos
  app.use(helmet());

  // 3. CORS
  app.enableCors();

  // 4. Validação Global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 5. Filtro de Exceções de Domínio
  app.useGlobalFilters(new DomainExceptionFilter());

  // 6. Graceful Shutdown
  app.enableShutdownHooks();

  // 7. Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ServicoPlanosAtivos - Consulta de Planos Ativos e Cache')
    .setDescription(
      'Microsserviço de alta performance responsável por consultar e armazenar em cache as assinaturas ativas com invalidação por eventos (RabbitMQ) (Fase 2).',
    )
    .setVersion('1.0.0')
    .addTag('Planos Ativos', 'Consulta e invalidação de cache de planos')
    .addTag('Saúde', 'Verificação de integridade')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 3003;

  // 8. Conexão com Message Broker RabbitMQ (Transport.RMQ) para observar PagamentoPlanoServicoPlanosAtivos
  const rmqUrl =
    configService.get<string>('RABBITMQ_URL') ||
    process.env.RABBITMQ_URL ||
    'amqp://guest:guest@localhost:5672';
  try {
    app.connectMicroservice({
      transport: 5, // Transport.RMQ
      options: {
        urls: [rmqUrl],
        queue: 'planos_ativos_queue',
        queueOptions: {
          durable: false,
        },
      },
    });
    await app.startAllMicroservices();
    app.get(Logger).log(`[RabbitMQ] Inscrito na fila 'planos_ativos_queue' para invalidação de cache.`);
  } catch (err: any) {
    app.get(Logger).warn(`[RabbitMQ] Não conectado ao broker (${err?.message || err}). Operando com fallback HTTP webhook.`);
  }

  await app.listen(PORT);

  const logger = app.get(Logger);
  logger.log(`====================================================`);
  logger.log(` ServicoPlanosAtivos (NestJS + Cache In-Memory + RMQ)`);
  logger.log(` Servidor ativo em: http://localhost:${PORT}`);
  logger.log(` Documentação Swagger UI: http://localhost:${PORT}/api-docs`);
  logger.log(` Health Check: http://localhost:${PORT}/health`);
  logger.log(` Endpoint: GET http://localhost:${PORT}/planosativos/:codass`);
  logger.log(`====================================================`);
}

bootstrap();
