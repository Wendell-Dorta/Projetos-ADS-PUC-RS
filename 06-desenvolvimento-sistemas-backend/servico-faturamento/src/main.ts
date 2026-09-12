import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import { AppModule } from './infrastructure/http/modules/AppModule';
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
    .setTitle('ServicoFaturamento - API de Cobranças e Pagamentos')
    .setDescription(
      'Microsserviço responsável por registrar pagamentos e emitir eventos assíncronos (RabbitMQ) para o ServicoGestao e ServicoPlanosAtivos (Fase 2).',
    )
    .setVersion('1.0.0')
    .addTag('Faturamento', 'Registro e consulta de pagamentos')
    .addTag('Saúde', 'Verificação de integridade')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 3002;
  await app.listen(PORT);

  const logger = app.get(Logger);
  logger.log(`====================================================`);
  logger.log(` ServicoFaturamento (NestJS + RabbitMQ + SQLite)`);
  logger.log(` Servidor ativo em: http://localhost:${PORT}`);
  logger.log(` Documentação Swagger UI: http://localhost:${PORT}/api-docs`);
  logger.log(` Health Check: http://localhost:${PORT}/health`);
  logger.log(` Endpoint: POST http://localhost:${PORT}/registrarpagamento`);
  logger.log(`====================================================`);
}

bootstrap();
